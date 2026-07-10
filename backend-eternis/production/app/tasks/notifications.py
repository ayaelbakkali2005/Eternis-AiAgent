# app/tasks/notifications.py
from celery import shared_task
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List
import logging

from app.db.database import SessionLocal
from app.services.notification_service import get_notification_service
from app.models.erp_models import Notification, Employee, Project, Task
from app.schemas.notification_schemas import (
    NotificationCreate, 
    NotificationChannel, 
    NotificationTemplate,
    NotificationStatus
)

logger = logging.getLogger(__name__)

# ============ original tasks ============
@shared_task(name="notifications.send_immediate_notification")
def send_immediate_notification(notification_data: dict):
    db: Session = SessionLocal()
    try:
        notification_service = get_notification_service()
        notification = NotificationCreate(**notification_data)
        result = notification_service.send_notification(db, notification)
        logger.info(f"Immediate notification sent: {result.id}")
        return {"success": True, "notification_id": result.id}
    except Exception as e:
        logger.error(f"Failed to send immediate notification: {e}")
        return {"success": False, "error": str(e)}
    finally:
        db.close()

@shared_task(name="notifications.send_deferred_notifications")
def send_deferred_notifications():
    db: Session = SessionLocal()
    try:
        notification_service = get_notification_service()
        now = datetime.now()
        deferred = db.query(Notification).filter(
            Notification.status == NotificationStatus.PENDING.value,
            Notification.scheduled_at <= now
        ).all()
        
        sent_count = 0
        for notif in deferred:
            try:
                notification_data = {
                    "recipient_id": notif.recipient_id,
                    "recipient_email": notif.recipient_email,
                    "channel": notif.channel,
                    "template": notif.template,
                    "priority": notif.priority,
                    "subject": notif.subject,
                    "message": notif.message,
                    "data": notif.data,
                    "extra_metadata": getattr(notif, 'extra_metadata', None),
                    "scheduled_at": None
                }
                notification = NotificationCreate(**notification_data)
                result = notification_service.send_notification(db, notification)
                if result.status == NotificationStatus.SENT.value:
                    sent_count += 1
            except Exception as e:
                logger.error(f"Failed to send deferred notification {notif.id}: {e}")
        
        logger.info(f"Deferred notifications processed: {sent_count} sent")
        return {"success": True, "sent_count": sent_count}
    except Exception as e:
        logger.error(f"Failed to process deferred notifications: {e}")
        return {"success": False, "error": str(e)}
    finally:
        db.close()

@shared_task(name="notifications.send_deadline_reminders")
def send_deadline_reminders():
    db: Session = SessionLocal()
    try:
        notification_service = get_notification_service()
        now = datetime.now()
        reminders_sent = 0
        
        upcoming_tasks = db.query(Task).filter(
            Task.due_date >= now.date(),
            Task.due_date <= (now + timedelta(days=1)).date(),
            Task.status != "done"
        ).all()
        
        for task in upcoming_tasks:
            assignee = db.query(Employee).filter(Employee.id == task.assigned_to).first()
            if not assignee or not assignee.email:
                continue
            
            notification_data = {
                "recipient_id": task.assigned_to,
                "recipient_email": assignee.email,
                "channel": NotificationChannel.EMAIL,
                "template": NotificationTemplate.DEADLINE_REMINDER,
                "priority": "high",
                "subject": f"Reminder: {task.title} due tomorrow",
                "message": f"Task '{task.title}' is due on {task.due_date}.",
                "data": {
                    "task_title": task.title,
                    "due_date": task.due_date.isoformat() if task.due_date else "N/A",
                    "hours_left": 24,
                    "task_url": f"/tasks/{task.id}"
                }
            }
            
            try:
                notification = NotificationCreate(**notification_data)
                result = notification_service.send_notification(db, notification)
                if result.status == NotificationStatus.SENT.value:
                    reminders_sent += 1
            except Exception as e:
                logger.error(f"Failed to send deadline reminder for task {task.id}: {e}")
        
        logger.info(f"Deadline reminders sent: {reminders_sent}")
        return {"success": True, "reminders_sent": reminders_sent}
    except Exception as e:
        logger.error(f"Failed to send deadline reminders: {e}")
        return {"success": False, "error": str(e)}
    finally:
        db.close()

@shared_task(name="notifications.cleanup_old_notifications")
def cleanup_old_notifications(days_to_keep: int = 90):
    db: Session = SessionLocal()
    try:
        cutoff_date = datetime.now() - timedelta(days=days_to_keep)
        deleted_count = db.query(Notification).filter(
            Notification.status == NotificationStatus.READ.value,
            Notification.created_at < cutoff_date
        ).delete(synchronize_session=False)
        db.commit()
        logger.info(f"Cleaned up {deleted_count} old notifications")
        return {"success": True, "deleted_count": deleted_count}
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to cleanup old notifications: {e}")
        return {"success": False, "error": str(e)}
    finally:
        db.close()

# ============ new tasks of router ============
@shared_task(name="notifications.send_scheduled_notification")
def send_scheduled_notification(notification_data: dict):
    """Send a single scheduled/deferred notification."""
    db: Session = SessionLocal()
    try:
        notification_service = get_notification_service()
        notification = NotificationCreate(**notification_data)
        result = notification_service.send_notification(db, notification)
        logger.info(f"Scheduled notification sent: {result.id}")
        return {"success": True, "notification_id": result.id}
    except Exception as e:
        logger.error(f"Failed to send scheduled notification: {e}")
        return {"success": False, "error": str(e)}
    finally:
        db.close()

@shared_task(name="notifications.batch_send_notifications")
def batch_send_notifications(notification_list: List[dict]):
    """Send notifications to multiple recipients in batch."""
    db: Session = SessionLocal()
    try:
        notification_service = get_notification_service()
        sent_count = 0
        failed_count = 0
        
        for notif_data in notification_list:
            try:
                notification = NotificationCreate(**notif_data)
                result = notification_service.send_notification(db, notification)
                if result.status == NotificationStatus.SENT.value:
                    sent_count += 1
            except Exception as e:
                logger.error(f"Failed to send batch notification: {e}")
                failed_count += 1
        
        logger.info(f"Batch notifications: {sent_count} sent, {failed_count} failed")
        return {"success": True, "sent_count": sent_count, "failed_count": failed_count}
    except Exception as e:
        logger.error(f"Failed to process batch notifications: {e}")
        return {"success": False, "error": str(e)}
    finally:
        db.close()
