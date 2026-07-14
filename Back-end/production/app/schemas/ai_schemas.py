# app/schemas/ai_schemas.py
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List, Dict, Any

# ============ Request Schemas ============

class ProjectRiskRequest(BaseModel):
    project_id: str = Field(..., description="ID of the project to analyze")

class FinancialAnalysisRequest(BaseModel):
    month: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}$", description="Month in YYYY-MM format")

class TeamAnalysisRequest(BaseModel):
    department: Optional[str] = Field(None, description="Filter by department name")

# ============ Response Schemas ============

class RiskAnalysisResponse(BaseModel):
    risk_level: str = Field(..., description="low|medium|high|critical")
    predicted_delay_days: int = Field(..., ge=0)
    key_risks: List[str]
    recommendations: List[str]
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    generated_at: Optional[str] = None
    model: Optional[str] = None
    mock_mode: Optional[bool] = None

class FinancialAnalysisResponse(BaseModel):
    financial_status: str = Field(..., description="healthy|warning|critical")
    cash_flow_forecast_30d: float
    concerns: List[str]
    actions: List[str]
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    generated_at: Optional[str] = None
    model: Optional[str] = None
    mock_mode: Optional[bool] = None

class TeamAnalysisResponse(BaseModel):
    team_health: str = Field(..., description="excellent|good|needs_attention|critical")
    burnout_risk: str = Field(..., description="low|medium|high")
    insights: List[str]
    suggestions: List[str]
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    generated_at: Optional[str] = None
    model: Optional[str] = None
    mock_mode: Optional[bool] = None

class ExecutiveSummaryResponse(BaseModel):
    overall_status: str = Field(..., description="excellent|good|fair|needs_attention")
    key_achievements: List[str]
    urgent_priorities: List[str]
    strategic_recommendations: List[str]
    next_week_focus: List[str]
    generated_at: Optional[str] = None
    model: Optional[str] = None
    mock_mode: Optional[bool] = None

class AIErrorResponse(BaseModel):
    error: str
    details: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)