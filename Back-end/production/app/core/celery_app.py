# app/core/celery_app.py
from celery import Celery
from celery.schedules import crontab
import os

# Get config from environment
CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", "redis://redis:6379/0")
CELERY_RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND", "redis://redis:6379/0")

# Create Celery app
celery_app = Celery(
    "erp_worker",
    broker=CELERY_BROKER_URL,
    backend=CELERY_RESULT_BACKEND
)

# Optional: Configure Celery
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    task_routes={"app.tasks.*": {"queue": "erp_tasks"}},
    broker_transport_options={"visibility_timeout": 3600},
    
    # ============ Celery Beat Schedule ============
    beat_schedule={
        # Check and send deferred notifications every 30 minutes
        "send-deferred-notifications": {
            "task": "app.tasks.notifications.send_deferred_notifications",
            "schedule": crontab(minute="*/30"),
        },
        # Send deadline reminders daily at 9 AM
        "send-deadline-reminders": {
            "task": "app.tasks.notifications.send_deadline_reminders",
            "schedule": crontab(hour=9, minute=0),
        },
        # Clean up old notifications weekly (Sunday at 2 AM)
        "cleanup-old-notifications": {
            "task": "app.tasks.notifications.cleanup_old_notifications",
            "schedule": crontab(hour=2, minute=0, day_of_week=0),
        },
    },
    beat_scheduler="celery.beat:PersistentScheduler",
)

# Auto-discover tasks from app.tasks module
celery_app.autodiscover_tasks(["app.tasks"], force=True)