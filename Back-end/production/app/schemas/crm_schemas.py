# app/schemas/crm_schemas.py
from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from typing import Optional, List
from enum import Enum

class CustomerStatus(str, Enum):
    ACTIVE = "active"
    AT_RISK = "at_risk"
    CHURNED = "churned"
    VIP = "vip"

class InteractionCreate(BaseModel):
    customer_id: str
    name: str
    email: EmailStr
    company: str
    channel: str  # email, call, meeting, support_ticket
    content: str = Field(..., min_length=10, max_length=2000)

class InteractionResponse(BaseModel):
    id: str
    customer_id: str
    channel: str
    content: str
    timestamp: datetime
    sentiment_score: Optional[float]

class CustomerResponse(BaseModel):
    id: str
    name: str
    email: str
    company: str
    status: CustomerStatus
    satisfaction_score: Optional[float]
    last_contact: Optional[datetime]
    interactions_count: int

    class Config:
        from_attributes = True

class CRMInsightResponse(BaseModel):
    customer_id: str
    name: str
    company: str
    satisfaction_score: float
    status: CustomerStatus
    recommendation: str