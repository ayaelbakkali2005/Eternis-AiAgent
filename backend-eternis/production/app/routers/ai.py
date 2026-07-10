# app/routers/ai.py
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import get_current_user, TokenData
from app.services.ai_service import get_ai_service, QwenAIService
from app.schemas.ai_schemas import (
    ProjectRiskRequest, FinancialAnalysisRequest, TeamAnalysisRequest,
    RiskAnalysisResponse, FinancialAnalysisResponse, TeamAnalysisResponse,
    ExecutiveSummaryResponse
)
from pydantic import BaseModel

router = APIRouter()

@router.post("/analyze/project-risk", response_model=RiskAnalysisResponse, tags=["AI Intelligence"])
def analyze_project_risk(
    request: ProjectRiskRequest,
    current_user: TokenData = Depends(get_current_user),
    ai_service: QwenAIService = Depends(get_ai_service)
):
    try:
        result = ai_service.analyze_project_risk(project_id=request.project_id)
        if "error" in result:
            raise HTTPException(status_code=404, detail=result["error"])
        return RiskAnalysisResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")

@router.post("/analyze/financial-health", response_model=FinancialAnalysisResponse, tags=["AI Intelligence"])
def analyze_financial_health(
    request: FinancialAnalysisRequest = FinancialAnalysisRequest(),
    current_user: TokenData = Depends(get_current_user),
    ai_service: QwenAIService = Depends(get_ai_service)
):
    try:
        result = ai_service.analyze_financial_health(month=request.month)
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        return FinancialAnalysisResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")

@router.post("/analyze/team-performance", response_model=TeamAnalysisResponse, tags=["AI Intelligence"])
def analyze_team_performance(
    request: TeamAnalysisRequest = TeamAnalysisRequest(),
    current_user: TokenData = Depends(get_current_user),
    ai_service: QwenAIService = Depends(get_ai_service)
):
    try:
        result = ai_service.analyze_team_performance(department=request.department)
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        return TeamAnalysisResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")

@router.get("/summary/executive", response_model=ExecutiveSummaryResponse, tags=["AI Intelligence"])
def generate_executive_summary(
    current_user: TokenData = Depends(get_current_user),
    ai_service: QwenAIService = Depends(get_ai_service)
):
    try:
        result = ai_service.generate_executive_summary()
        return ExecutiveSummaryResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI summary failed: {str(e)}")

# ✅ ✅ ✅ هذا هو التغيير الوحيد المطلوب ✅ ✅ ✅
@router.get("/model/status", tags=["AI Intelligence"])
def get_model_status(ai_service: QwenAIService = Depends(get_ai_service)):
    """Get AI model status - uses the orchestrator's built-in method."""
    return ai_service.get_status()

class AgentRequest(BaseModel):
    query: str

@router.post("/agent/chat", tags=["AI Agent"])
def agent_chat(
    request: AgentRequest,
    current_user: TokenData = Depends(get_current_user),
    ai_service: QwenAIService = Depends(get_ai_service)
):
    return ai_service.chat_with_agent(user_query=request.query)