# app/services/ai_service.py
"""Main AI service orchestrator - coordinates all sub-services."""
import os
import logging
from typing import Dict, Any, Optional

from .prompts import (
    ERP_ASSISTANT_PROMPT,
    ERP_ASSISTANT_NO_CONTEXT_PROMPT,
    AGENT_PROMPT,
    EXECUTIVE_SUMMARY_PROMPT,
    RISK_ANALYSIS_PROMPT,
    FINANCIAL_ANALYSIS_PROMPT,
    TEAM_ANALYSIS_PROMPT
)
from .model_loader import ModelLoader
from .rag_service import RAGService
from .generator import Generator
from .health import get_ai_health_status

logger = logging.getLogger(__name__)


class QwenAIService:
    """Orchestrator for AI services with RAG support."""

    def __init__(
        self,
        model_path: str = "./models/qwen-local",
        faiss_path: str = "./models/faiss_index",
        device: str = "cpu",
        mock_mode: bool = False
    ):
        self.mock_mode = mock_mode
        self.model_path = model_path
        self.device = device
        
        if mock_mode:
            logger.warning("⚠️ AI service running in MOCK MODE")
            return

        # Initialize sub-services
        self.loader = ModelLoader(model_path, device)
        self.rag = RAGService(faiss_path)
        self.generator = None
        
        # Load components
        self.loader.load()
        self.rag.load()
        
        if self.loader.is_ready:
            self.generator = Generator(
                self.loader.model, 
                self.loader.tokenizer, 
                self.loader.device
            )

    def generate_response(
        self, 
        query: str, 
        max_tokens: int = 128,
        temperature: float = 0.1
    ) -> Dict[str, Any]:
        """Main RAG pipeline: Retrieve -> Format -> Generate -> Return."""
        if self.mock_mode:
            return {
                "response": f"[Mock AI] Simulated answer for: {query[:50]}...",
                "mock_mode": True,
                "success": True
            }
        if not self.loader.is_ready or not self.generator:
            return {"error": "AI service not initialized", "success": False}

        context = self.rag.retrieve_context(query)
        prompt = (
            ERP_ASSISTANT_PROMPT.format(context=context, question=query)
            if context
            else ERP_ASSISTANT_NO_CONTEXT_PROMPT.format(question=query)
        )
        answer = self.generator.generate(prompt, max_tokens, temperature)
        
        return {
            "response": answer or "Failed to generate response",
            "context_used": bool(context),
            "sources": self.rag.get_sources(query) if context else [],
            "success": True,
            "mock_mode": False
        }

    def chat_with_agent(self, user_query: str, max_tokens: int = 128) -> Dict[str, Any]:
        """AI Agent endpoint - OPTIMIZED FOR CPU + USES RAG CONTEXT."""
        if self.mock_mode:
            return {
                "role": "agent",
                "response": f"[Mock Agent] Query: '{user_query[:50]}...'. Simulated: Task completed.",
                "mock_mode": True,
                "success": True
            }
        if not self.generator:
            return {"role": "assistant", "response": "Service unavailable", "success": False}
        
        # هذا هو الإصلاح الرئيسي: استرجاع السياق من RAG 
        context = self.rag.retrieve_context(user_query)
        
        # اختر القالب المناسب حسب وجود سياق
        if context:
            prompt = ERP_ASSISTANT_PROMPT.format(context=context, question=user_query)
        else:
            prompt = ERP_ASSISTANT_NO_CONTEXT_PROMPT.format(question=user_query)
        
        # توليد الرد باستخدام المعلمات المُحسّنة لـ CPU
        answer = self.generator.generate(prompt, max_tokens=128, temperature=0.1)
        
        return {
            "role": "assistant",
            "response": answer or "Failed to generate response",
            "context_used": bool(context),  # ✅ الآن سيعود بـ True إذا وُجد سياق
            "sources": self.rag.get_sources(user_query) if context else [],
            "success": True,
            "mock_mode": False
        }

    def get_status(self) -> Dict[str, Any]:
        """Return service health status."""
        return get_ai_health_status(
            model_loaded=self.loader.is_ready if not self.mock_mode else False,
            rag_enabled=self.rag.is_ready if not self.mock_mode else False,
            device=self.device,
            model_path=self.model_path,
            mock_mode=self.mock_mode
        )

    # === Router-compatible methods ===
    def generate_executive_summary(self, project_id: str = None, max_tokens: int = 128) -> Dict[str, Any]:
        query = EXECUTIVE_SUMMARY_PROMPT.format(topic=f"project {project_id}" if project_id else "ERP system")
        return self.generate_response(query, max_tokens)

    def analyze_project_risk(self, project_id: str, max_tokens: int = 128) -> Dict[str, Any]:
        query = RISK_ANALYSIS_PROMPT.format(topic=f"project {project_id}")
        return self.generate_response(query, max_tokens)

    def analyze_financial_health(self, month: str = None, max_tokens: int = 128) -> Dict[str, Any]:
        query = FINANCIAL_ANALYSIS_PROMPT.format(topic=f"month {month}" if month else "overall system")
        return self.generate_response(query, max_tokens)

    def analyze_team_performance(self, department: str = None, max_tokens: int = 128) -> Dict[str, Any]:
        query = TEAM_ANALYSIS_PROMPT.format(topic=f"department {department}" if department else "organization")
        return self.generate_response(query, max_tokens)


# === Singleton Factory ===
_ai_service: Optional[QwenAIService] = None

def get_ai_service() -> QwenAIService:
    global _ai_service
    if _ai_service is None:
        model_path = os.getenv("AI_MODEL_PATH", "/app/models/qwen-local")     
        faiss_path = os.getenv("FAISS_INDEX_PATH", "/app/models/faiss_index")  
        device = os.getenv("AI_DEVICE", "cpu")
        mock_mode = os.getenv("AI_MOCK_MODE", "false").lower() == "true"
        logger.info(f"Initializing AI: model={model_path}, mock={mock_mode}, device={device}")
        _ai_service = QwenAIService(model_path, faiss_path, device, mock_mode)
    return _ai_service

def reset_ai_service():
    global _ai_service
    _ai_service = None
    logger.info("AI service reset")