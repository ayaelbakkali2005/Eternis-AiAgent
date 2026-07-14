# app/schemas/notification_schemas.py
from pydantic import BaseModel, Field, EmailStr, validator
from datetime import datetime
from typing import Optional, List, Dict, Any
from enum import Enum

class NotificationChannel(str, Enum):
    EMAIL = "email"
    SLACK = "slack"
    IN_APP = "in_app"
    SMS = "sms"  # Optional: requires Twilio integration

class NotificationPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class NotificationStatus(str, Enum):
    PENDING = "pending"
    SENT = "sent"
    FAILED = "failed"
    READ = "read"

class NotificationTemplate(str, Enum):
    WELCOME = "welcome"
    TASK_ASSIGNED = "task_assigned"
    DEADLINE_REMINDER = "deadline_reminder"
    PAYMENT_RECEIVED = "payment_received"
    CONTRACT_SIGNED = "contract_signed"
    PROJECT_DELAY = "project_delay"
    CUSTOM = "custom"

class NotificationCreate(BaseModel):
    recipient_id: str  # user_id or employee_id
    recipient_email: Optional[EmailStr] = None
    channel: NotificationChannel
    template: NotificationTemplate
    priority: NotificationPriority = NotificationPriority.MEDIUM
    subject: Optional[str] = None
    message: str = Field(..., min_length=1, max_length=2000)
    data: Optional[Dict[str, Any]] = None  # Dynamic template variables
    scheduled_at: Optional[datetime] = None  # For delayed sending
    extra_metadata: Optional[Dict[str, Any]] = None  # Extra context for tracking

class NotificationResponse(BaseModel):
    id: str
    recipient_id: str
    channel: NotificationChannel
    template: NotificationTemplate
    subject: Optional[str]
    message: str
    status: NotificationStatus
    priority: NotificationPriority
    sent_at: Optional[datetime]
    read_at: Optional[datetime]
    created_at: datetime
    extra_metadata: Optional[Dict[str, Any]]

    class Config:
        from_attributes = True

class NotificationPreferences(BaseModel):
    user_id: str
    email_enabled: bool = True
    slack_enabled: bool = False
    in_app_enabled: bool = True
    sms_enabled: bool = False
    quiet_hours_start: Optional[str] = None  # "22:00"
    quiet_hours_end: Optional[str] = None    # "08:00"
    preferred_channels: List[NotificationChannel] = [NotificationChannel.IN_APP]

class BulkNotificationRequest(BaseModel):
    recipient_ids: List[str]
    channel: NotificationChannel
    template: NotificationTemplate
    message: str
    subject: Optional[str] = None
    data: Optional[Dict[str, Any]] = None
    priority: NotificationPriority = NotificationPriority.MEDIUM