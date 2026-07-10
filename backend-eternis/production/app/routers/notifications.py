# app/routers/notifications.py
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.db.database import get_db
from app.core.security import get_current_user, TokenData
from app.services.notification_service import get_notification_service, NotificationService
from app.schemas.notification_schemas import (
    NotificationCreate, NotificationResponse, NotificationPreferences,
    BulkNotificationRequest, NotificationChannel, NotificationPriority, NotificationStatus
)
from app.tasks.notifications import (
    send_immediate_notification,
    send_deferred_notifications,
    send_deadline_reminders,
    cleanup_old_notifications,
    send_scheduled_notification,
    batch_send_notifications
)

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

@router.post("", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
def send_notification(
    notification: NotificationCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user),
    notification_service: NotificationService = Depends(get_notification_service)
):
    """Send a notification via specified channel."""
    # RBAC check
    if notification.recipient_id != current_user.user_id and current_user.user_role not in ["admin", "manager", "hr"]:
        raise HTTPException(status_code=403, detail="Not authorized to send to this recipient")
    
    # If scheduled, queue via Celery
    if notification.scheduled_at and notification.scheduled_at > datetime.now():
        # ✅ استخدام .delay() لاستدعاء مهمة Celery بشكل غير متزامن
        send_scheduled_notification.delay(notification.model_dump())
        status_msg = "Notification scheduled for later delivery"
    else:
        # Send immediately via service
        result = notification_service.send_notification(db, notification)
        status_msg = "Notification sent"
    
    return result

@router.post("/bulk", status_code=status.HTTP_202_ACCEPTED)
def send_bulk_notifications(
    request: BulkNotificationRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Send notifications to multiple recipients (admin/manager only)."""
    if current_user.user_role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Bulk notifications require admin or manager role")
    
    # Prepare batch
    notification_list = [
        {
            "recipient_id": rid,
            "channel": request.channel,
            "template": request.template,
            "message": request.message,
            "subject": request.subject,
            "data": request.data,
            "priority": request.priority
        }
        for rid in request.recipient_ids
    ]
    
    # ✅ Queue batch task via Celery
    batch_send_notifications.delay(notification_list)
    
    return {
        "message": f"Bulk notification queued for {len(request.recipient_ids)} recipients",
        "task_id": f"batch_{datetime.now().timestamp()}"
    }

@router.get("", response_model=List[NotificationResponse])
def get_my_notifications(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    unread_only: bool = False,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user),
    notification_service: NotificationService = Depends(get_notification_service)
):
    """Get current user's notifications with pagination."""
    if unread_only:
        notifications = notification_service.get_notifications(db, current_user.user_id, limit, skip)
        return [n for n in notifications if n.status != "read"]
    return notification_service.get_notifications(db, current_user.user_id, limit, skip)

@router.get("/unread-count")
def get_unread_count(
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user),
    notification_service: NotificationService = Depends(get_notification_service)
):
    """Get count of unread notifications for current user."""
    return {
        "user_id": current_user.user_id,
        "unread_count": notification_service.get_unread_count(db, current_user.user_id)
    }

@router.put("/{notification_id}/read")
def mark_notification_read(
    notification_id: str,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user),
    notification_service: NotificationService = Depends(get_notification_service)
):
    """Mark a notification as read."""
    success = notification_service.mark_as_read(db, notification_id, current_user.user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found or not owned by user")
    return {"message": "Notification marked as read"}

@router.get("/preferences", response_model=NotificationPreferences)
def get_preferences(
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Get current user's notification preferences."""
    # ملاحظة: NotificationPreference يجب أن يكون مُعرّفاً في app/models/erp_models.py
    from app.models.erp_models import NotificationPreference
    prefs = db.query(NotificationPreference).filter(
        NotificationPreference.user_id == current_user.user_id
    ).first()
    
    if not prefs:
        return NotificationPreferences(user_id=current_user.user_id)
    return prefs

@router.put("/preferences", response_model=NotificationPreferences)
def update_preferences(
    preferences: NotificationPreferences,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Update current user's notification preferences."""
    if preferences.user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Can only update own preferences")
    
    from app.models.erp_models import NotificationPreference
    prefs = db.query(NotificationPreference).filter(
        NotificationPreference.user_id == current_user.user_id
    ).first()
    
    if not prefs:
        prefs = NotificationPreference(user_id=current_user.user_id)
        db.add(prefs)
    
    update_data = preferences.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if field != "user_id":
            setattr(prefs, field, value)
    
    db.commit()
    db.refresh(prefs)
    return prefs