"""Provides AI service health status."""
from typing import Dict, Any


def get_ai_health_status(
    model_loaded: bool,
    rag_enabled: bool,
    device: str,
    model_path: str,
    mock_mode: bool
) -> Dict[str, Any]:
    """Return comprehensive AI service status."""
    if mock_mode:
        return {
            "status": "ready",
            "model": "Mock-Qwen",
            "device": device,
            "mock_mode": True,
            "rag_enabled": False,
            "model_loaded": False
        }
    return {
        "status": "ready" if model_loaded else "loading",
        "model": model_path,
        "device": device,
        "mock_mode": False,
        "rag_enabled": rag_enabled,
        "model_loaded": model_loaded
    }