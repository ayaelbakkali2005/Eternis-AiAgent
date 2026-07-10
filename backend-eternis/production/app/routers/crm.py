# app/routers/crm.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.core.security import get_current_user, TokenData
from app.models.erp_models import Customer, Interaction  # ستضيف هذه النماذج لاحقاً
from app.schemas.crm_schemas import (
    InteractionCreate, InteractionResponse,
    CustomerResponse, CRMInsightResponse
)

router = APIRouter(prefix="/api/crm", tags=["Customer Relationship Management"])

@router.post("/interactions", response_model=InteractionResponse, status_code=status.HTTP_201_CREATED)
def log_interaction(
    interaction: InteractionCreate,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Log a new customer interaction with sentiment analysis."""
    # Simulated sentiment analysis (keyword-based)
    positive_keywords = ["great", "excellent", "happy", "thanks", "love", "perfect", "fast"]
    negative_keywords = ["bad", "terrible", "angry", "delay", "refund", "complain", "slow", "issue"]
    
    content_lower = interaction.content.lower()
    pos = sum(1 for w in positive_keywords if w in content_lower)
    neg = sum(1 for w in negative_keywords if w in content_lower)
    
    raw_score = (pos - neg) / max(1, pos + neg) if (pos + neg) > 0 else 0.0
    sentiment_score = round(max(-1.0, min(1.0, raw_score)), 2)
    
    # Create interaction record (simplified - in production, use SQLAlchemy models)
    return InteractionResponse(
        id=f"INT-001",  # Would be UUID in production
        customer_id=interaction.customer_id,
        channel=interaction.channel,
        content=interaction.content,
        timestamp=datetime.utcnow(),
        sentiment_score=sentiment_score
    )

@router.get("/customers/{customer_id}", response_model=CustomerResponse)
def get_customer(
    customer_id: str,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Get customer details with satisfaction score."""
    # Simplified mock response - in production, query database
    return CustomerResponse(
        id=customer_id,
        name="Global Corp",
        email="contact@global.com",
        company="Global Corp",
        status="vip",
        satisfaction_score=85.0,
        last_contact=datetime.utcnow(),
        interactions_count=12
    )

@router.get("/insights/{customer_id}", response_model=CRMInsightResponse)
def get_customer_insights(
    customer_id: str,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Generate AI-powered insights for a customer."""
    # Simplified mock response
    return CRMInsightResponse(
        customer_id=customer_id,
        name="Global Corp",
        company="Global Corp",
        satisfaction_score=85.0,
        status="vip",
        recommendation="Highly satisfied. Request testimonial or propose upsell opportunity."
    )

@router.post("/customers/{customer_id}/followup")
def schedule_followup(
    customer_id: str,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Schedule an automated follow-up message for a customer."""
    # In production: check last_contact date and generate personalized message
    return {
        "success": True,
        "message": f"Follow-up scheduled for customer {customer_id}",
        "scheduled_at": datetime.utcnow().isoformat()
    }