from app.core.celery_app import celery_app
import time

@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def generate_ai_report(self, project_id: str):
    """Simulate AI report generation (replace with Qwen call)."""
    try:
        # Simulate heavy processing
        time.sleep(2)
        return {
            "project_id": project_id,
            "report": "AI Progress: 72%, Risk: MEDIUM, Deadline: On-track",
            "generated_at": time.time()
        }
    except Exception as e:
        # Retry on failure
        raise self.retry(exc=e)

@celery_app.task(bind=True, max_retries=2)
def send_notification(self, user_id: str, message: str, channel: str = "email"):
    """Send notification via email/SMS/push."""
    try:
        # Simulate sending
        print(f"[NOTIFY] {channel} to {user_id}: {message}")
        return {"status": "sent", "user_id": user_id, "channel": channel}
    except Exception as e:
        raise self.retry(exc=e, countdown=30)