# app/services/notification_service.py
import os
import logging
import smtplib
import requests
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session

from app.models.erp_models import Notification, NotificationPreference, Employee
from app.schemas.notification_schemas import (
    NotificationCreate, NotificationChannel, NotificationPriority, 
    NotificationTemplate, NotificationStatus
)

logger = logging.getLogger(__name__)

class NotificationService:
    """
    Production-ready notification service supporting:
    - Email (SMTP)
    - Slack (Webhook)
    - In-App (Database)
    - Scheduled sending via Celery
    - Quiet hours respect
    - Template rendering
    """
    
    def __init__(self):
        # Email configuration
        self.smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_user = os.getenv("SMTP_USER", "")
        self.smtp_password = os.getenv("SMTP_PASSWORD", "")
        self.from_email = os.getenv("FROM_EMAIL", "noreply@eternis.com")
        
        # Slack configuration
        self.slack_webhook_url = os.getenv("SLACK_WEBHOOK_URL", "")
        self.slack_bot_token = os.getenv("SLACK_BOT_TOKEN", "")
        
        # Template registry
        self.templates = self._load_templates()
    
    def _load_templates(self) -> Dict[NotificationTemplate, Dict[str, str]]:
        """Load notification templates with placeholders."""
        return {
            NotificationTemplate.WELCOME: {
                "email_subject": "Welcome to Eternis ERP!",
                "email_body": """
                <h2>Welcome, {name}!</h2>
                <p>Your account has been created successfully.</p>
                <p><strong>Employee ID:</strong> {employee_id}</p>
                <p><strong>Role:</strong> {role}</p>
                <p>Get started: <a href="{dashboard_url}">Open Dashboard</a></p>
                """,
                "slack_text": "Welcome to Eternis, {name}! Your account is ready. Employee ID: {employee_id}",
                "in_app_text": "Welcome to Eternis! Your account ({employee_id}) is now active."
            },
            NotificationTemplate.TASK_ASSIGNED: {
                "email_subject": "New Task Assigned: {task_title}",
                "email_body": """
                <h2>New Task Assigned</h2>
                <p><strong>Task:</strong> {task_title}</p>
                <p><strong>Project:</strong> {project_name}</p>
                <p><strong>Due Date:</strong> {due_date}</p>
                <p><strong>Priority:</strong> {priority}</p>
                <p><a href="{task_url}">View Task Details</a></p>
                """,
                "slack_text": "New task: *{task_title}* in *{project_name}*. Due: {due_date}",
                "in_app_text": "New task assigned: {task_title} (Due: {due_date})"
            },
            NotificationTemplate.DEADLINE_REMINDER: {
                "email_subject": "Reminder: {task_title} due {due_date}",
                "email_body": """
                <h2>Deadline Reminder</h2>
                <p><strong>Task:</strong> {task_title}</p>
                <p><strong>Due:</strong> {due_date} ({hours_left} hours remaining)</p>
                <p><a href="{task_url}">Complete Task Now</a></p>
                """,
                "slack_text": f"Reminder: *{{task_title}}* due {{due_date}} ({{hours_left}}h left)",
                "in_app_text": "Reminder: {task_title} due {due_date}"
            },
            NotificationTemplate.PAYMENT_RECEIVED: {
                "email_subject": "Payment Received: {amount} {currency}",
                "email_body": """
                <h2>Payment Confirmed</h2>
                <p><strong>Amount:</strong> {amount} {currency}</p>
                <p><strong>Invoice:</strong> {invoice_id}</p>
                <p><strong>Date:</strong> {payment_date}</p>
                <p><a href="{invoice_url}">View Invoice</a></p>
                """,
                "slack_text": "Payment received: {amount} {currency} for invoice {invoice_id}",
                "in_app_text": "Payment received: {amount} {currency}"
            },
            NotificationTemplate.CONTRACT_SIGNED: {
                "email_subject": "Contract Signed: {contract_id}",
                "email_body": """
                <h2>Contract Executed</h2>
                <p><strong>Contract ID:</strong> {contract_id}</p>
                <p><strong>Employee:</strong> {employee_name}</p>
                <p><strong>Position:</strong> {position}</p>
                <p><strong>Start Date:</strong> {start_date}</p>
                """,
                "slack_text": "Contract signed: {contract_id} for {employee_name}",
                "in_app_text": "Contract {contract_id} has been signed"
            },
            NotificationTemplate.PROJECT_DELAY: {
                "email_subject": "Project Alert: {project_name} at risk",
                "email_body": """
                <h2>Project Delay Alert</h2>
                <p><strong>Project:</strong> {project_name}</p>
                <p><strong>Current Progress:</strong> {progress}%</p>
                <p><strong>Deadline:</strong> {deadline} ({days_overdue} days overdue)</p>
                <p><strong>Recommended Action:</strong> {recommendation}</p>
                <p><a href="{project_url}">Review Project</a></p>
                """,
                "slack_text": f"Project *{{project_name}}* at risk: {{progress}}% complete, {{days_overdue}}d overdue",
                "in_app_text": "{project_name} is behind schedule"
            },
            NotificationTemplate.CUSTOM: {
                "email_subject": "{subject}",
                "email_body": "{message}",
                "slack_text": "{message}",
                "in_app_text": "{message}"
            }
        }
    
    def _render_template(self, template: NotificationTemplate, data: Dict[str, Any], channel: NotificationChannel) -> Dict[str, str]:
        """Render template with dynamic data for specific channel."""
        tmpl = self.templates.get(template, self.templates[NotificationTemplate.CUSTOM])
        
        if channel == NotificationChannel.EMAIL:
            return {
                "subject": tmpl["email_subject"].format(**data) if "{subject}" not in tmpl["email_subject"] else data.get("subject", ""),
                "body": tmpl["email_body"].format(**data)
            }
        elif channel == NotificationChannel.SLACK:
            return {
                "text": tmpl["slack_text"].format(**data)
            }
        else:  # IN_APP
            return {
                "text": tmpl["in_app_text"].format(**data)
            }
    
    def _is_quiet_hours(self, preferences: NotificationPreference) -> bool:
        """Check if current time is within user's quiet hours."""
        if not preferences.quiet_hours_start or not preferences.quiet_hours_end:
            return False
        
        now = datetime.now().time()
        start = datetime.strptime(preferences.quiet_hours_start, "%H:%M").time()
        end = datetime.strptime(preferences.quiet_hours_end, "%H:%M").time()
        
        if start <= end:
            return start <= now <= end
        else:  # Overnight range (e.g., 22:00 - 08:00)
            return now >= start or now <= end
    
    def _should_send_now(self, notification: NotificationCreate, preferences: NotificationPreference) -> bool:
        """Determine if notification should be sent immediately or scheduled."""
        if notification.scheduled_at and notification.scheduled_at > datetime.now():
            return False  # Schedule for later via Celery
        
        if self._is_quiet_hours(preferences) and notification.priority not in [NotificationPriority.HIGH, NotificationPriority.URGENT]:
            return False  # Defer to after quiet hours
        
        return True
    
    def _send_email(self, to_email: str, subject: str, html_body: str) -> bool:
        """Send email via SMTP."""
        if not self.smtp_user or not self.smtp_password:
            logger.warning("SMTP credentials not configured. Email not sent.")
            return False
        
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = self.from_email
            msg["To"] = to_email
            
            msg.attach(MIMEText(html_body, "html"))
            
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.send_message(msg)
            
            logger.info(f"Email sent to {to_email}: {subject}")
            return True
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {e}")
            return False
    
    def _send_slack(self, webhook_url: Optional[str], text: str, channel: Optional[str] = None) -> bool:
        """Send message to Slack via webhook or bot token."""
        url = webhook_url or self.slack_webhook_url
        if not url:
            logger.warning("Slack webhook not configured. Message not sent.")
            return False
        
        try:
            payload = {
                "text": text,
                "channel": channel or "#general"
            }
            response = requests.post(url, json=payload, timeout=10)
            response.raise_for_status()
            logger.info(f"Slack message sent: {text[:100]}...")
            return True
        except Exception as e:
            logger.error(f"Failed to send Slack message: {e}")
            return False
    
    def _save_in_app_notification(self, db: Session, notification: NotificationCreate, rendered: Dict[str, str]) -> Notification:
        """Save notification to database for in-app display."""
        db_notification = Notification(
            recipient_id=notification.recipient_id,
            recipient_email=notification.recipient_email,
            channel=notification.channel.value,
            template=notification.template.value,
            priority=notification.priority.value,
            subject=rendered.get("subject") or notification.subject,
            message=rendered.get("text") or rendered.get("body") or notification.message,
            data=notification.data,
            metadata=notification.metadata,
            status=NotificationStatus.SENT.value,
            sent_at=datetime.now()
        )
        db.add(db_notification)
        db.commit()
        db.refresh(db_notification)
        return db_notification
    
    def send_notification(self, db: Session, notification: NotificationCreate) -> Notification:
        """
        Main entry point: route notification to appropriate channel(s).
        Returns the saved notification record.
        """
        # Get user preferences
        preferences = db.query(NotificationPreference).filter(
            NotificationPreference.user_id == notification.recipient_id
        ).first()
        
        if not preferences:
            # Create default preferences if none exist
            preferences = NotificationPreference(user_id=notification.recipient_id)
            db.add(preferences)
            db.commit()
            db.refresh(preferences)
        
        # Check if should send now or schedule
        if not self._should_send_now(notification, preferences):
            # Schedule for later via Celery (handled in tasks)
            logger.info(f"Notification scheduled for later: {notification.recipient_id}")
            return self._save_in_app_notification(db, notification, {"text": notification.message})
        
        # Render template
        rendered = self._render_template(notification.template, notification.data or {}, notification.channel)
        
        # Route to channel
        success = False
        if notification.channel == NotificationChannel.EMAIL and preferences.email_enabled:
            email = notification.recipient_email or self._get_user_email(db, notification.recipient_id)
            if email:
                success = self._send_email(email, rendered["subject"], rendered["body"])
        
        elif notification.channel == NotificationChannel.SLACK and preferences.slack_enabled:
            success = self._send_slack(None, rendered["text"])
        
        elif notification.channel == NotificationChannel.IN_APP and preferences.in_app_enabled:
            success = True  # Always succeeds for in-app
        
        # Save to database regardless of channel success
        status = NotificationStatus.SENT if success else NotificationStatus.FAILED
        db_notification = self._save_in_app_notification(db, notification, rendered)
        db_notification.status = status.value
        db.commit()
        
        return db_notification
    
    def _get_user_email(self, db: Session, user_id: str) -> Optional[str]:
        """Fetch user email from Employee table."""
        employee = db.query(Employee).filter(Employee.id == user_id).first()
        return employee.email if employee else None
    
    def mark_as_read(self, db: Session, notification_id: str, user_id: str) -> bool:
        """Mark a notification as read (for in-app)."""
        notification = db.query(Notification).filter(
            Notification.id == notification_id,
            Notification.recipient_id == user_id
        ).first()
        
        if not notification:
            return False
        
        notification.status = NotificationStatus.READ.value
        notification.read_at = datetime.now()
        db.commit()
        return True
    
    def get_unread_count(self, db: Session, user_id: str) -> int:
        """Get count of unread notifications for a user."""
        return db.query(Notification).filter(
            Notification.recipient_id == user_id,
            Notification.status.in_([NotificationStatus.SENT.value, NotificationStatus.PENDING.value])
        ).count()
    
    def get_notifications(self, db: Session, user_id: str, limit: int = 50, offset: int = 0) -> List[Notification]:
        """Get paginated notifications for a user."""
        return db.query(Notification).filter(
            Notification.recipient_id == user_id
        ).order_by(Notification.created_at.desc()).offset(offset).limit(limit).all()


# Global instance
_notification_service: Optional[NotificationService] = None

def get_notification_service() -> NotificationService:
    """Dependency injection factory."""
    global _notification_service
    if _notification_service is None:
        _notification_service = NotificationService()
    return _notification_service
