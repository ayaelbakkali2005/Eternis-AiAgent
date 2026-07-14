# app/services/__init__.py
"""AI Services Package"""
from .ai_service import get_ai_service, QwenAIService

__all__ = ["get_ai_service", "QwenAIService"]