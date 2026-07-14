# app/routers/voice_api.py
"""Voice AI Webhook for VAPI Integration - Secure & ERP-Optimized."""
import os
import hmac
import hashlib
import logging
import re
from pydantic import BaseModel, Field
from typing import List, Optional, Any
from fastapi import APIRouter, Request, HTTPException, BackgroundTasks, Header
from app.services.ai_service import get_ai_service

logger = logging.getLogger(__name__)

# Router with empty prefix to match VAPI config: /webhook (not /api/voice/webhook)
router = APIRouter(prefix="", tags=["Voice AI"])

# VAPI webhook secret key (add to .env)
VAPI_WEBHOOK_SECRET = os.getenv("VAPI_WEBHOOK_SECRET", "")


def _verify_signature(payload: bytes, signature_header: Optional[str]) -> bool:
    """Verifies VAPI webhook signature using HMAC-SHA256."""
    if not VAPI_WEBHOOK_SECRET or not signature_header:
        # Skip verification in development only (not recommended for production)
        logger.warning(" Webhook signature verification skipped (dev mode)")
        return True
    
    # Extract actual signature from header (may be in format sha256=...)
    actual_sig = signature_header.split("sha256=")[-1] if "sha256=" in signature_header else signature_header
    
    expected_sig = hmac.new(
        VAPI_WEBHOOK_SECRET.encode("utf-8"),
        payload,
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(actual_sig, expected_sig)


def _clean_for_tts(text: str) -> str:
    """Cleans text from markdown symbols and truncates for voice responses."""
    if not text:
        return "Sorry, I could not process your request."
    
    # Remove formatting symbols that cause TTS issues
    cleaned = re.sub(r'[*#_`>\-]', '', text)
    # Replace newlines with natural pauses
    cleaned = re.sub(r'\n\s*', '. ', cleaned)
    # Truncate response for natural speech (15-25 seconds ≈ 120-150 chars)
    if len(cleaned) > 150:
        cleaned = cleaned[:147] + "..."
    return cleaned.strip()


@router.post("/webhook")
async def vapi_webhook(
    request: Request,
    background_tasks: BackgroundTasks,
    x_vapi_signature: Optional[str] = Header(None, alias="X-VAPI-Signature")
):
    """
    Receives VAPI events and processes them using local Qwen model + RAG.
    
    Webhook URL for VAPI configuration:
    https://impale-absinthe-election.ngrok-free.dev
    """
    # 1️⃣ Read raw body for signature verification
    raw_body = await request.body()
    
    if not _verify_signature(raw_body, x_vapi_signature):
        logger.warning(" Invalid VAPI signature")
        raise HTTPException(status_code=401, detail="Invalid signature")

    # 2️⃣ Parse JSON payload
    try:
        data = await request.json()
    except Exception as e:
        logger.error(f"❌ Failed to parse JSON: {e}")
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

    event_type = data.get("type")
    call_id = data.get("callId", "unknown")
    transcript = data.get("transcript", "").strip()

    logger.info(f"🎤 VAPI Event: {event_type} | Call: {call_id} | Text: {transcript[:50]}...")

    # 3️⃣ Route events
    if event_type == "conversation-update" and transcript:
        try:
            #  Use local Qwen model (Singleton ← not reloaded per request)
            ai_service = get_ai_service()
            
            # Prompt optimized for short, accurate voice responses in ERP context
            voice_prompt = (
                "You are a professional voice assistant for Eternis ERP. "
                "Respond clearly and very concisely (under 25 words). "
                "Do not use lists, symbols, or formatting marks. "
                "If unsure, politely apologize and say 'Let me check the records'. "
                "Focus on: project status, employee info, budgets, tasks, and policies. "
                f"User question: {transcript}"
            )
            
            # Generate response with voice-optimized parameters: short + deterministic
            result = ai_service.chat_with_agent(voice_prompt, max_tokens=64, temperature=0.2)
            raw_response = result.get("response", "")
            
            # Clean text for TTS (Text-to-Speech)
            clean_response = _clean_for_tts(raw_response)
            
            logger.info(f" AI Response: {clean_response}")
            
            return {
                "response": clean_response,
                "interrupt": True,  # Allows user to interrupt immediately
                "custom_data": {
                    "call_id": call_id,
                    "used_rag": result.get("context_used", False),
                    "mock_mode": result.get("mock_mode", True)
                }
            }

        except Exception as e:
            logger.error(f"AI processing error: {e}")
            return {
                "response": "Sorry, there is a temporary technical issue. Please try again later.",
                "interrupt": True
            }

    elif event_type == "call-end":
        logger.info(f"Call ended | Call ID: {call_id}")
        # Optionally save call details to database or send notification here
        return {"status": "call-ended", "call_id": call_id}

    elif event_type == "transcription":
        # Transcription-only event ← ignored since we process text in conversation-update
        return {"status": "transcription-received"}

    else:
        logger.debug(f"Unhandled event: {event_type}")
        return {"status": "ignored", "event": event_type}


@router.get("/voice/health")
async def voice_health():
    """Health check endpoint for voice service."""
    return {
        "status": "healthy",
        "service": "voice-api",
        "webhook_url": "https://impale-absinthe-election.ngrok-free.dev"
    }

# ============================================================
#  OpenAI-Compatible Endpoint (لـ Vapi Custom LLM mode)
# ============================================================


class ChatMessage(BaseModel):
    role: str
    content: str

class ChatCompletionRequest(BaseModel):
    model: str
    messages: List[ChatMessage]
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = None

class ChatCompletionResponse(BaseModel):
    id: str = "chatcmpl-eternis"
    object: str = "chat.completion"
    created: int = Field(default_factory=lambda: int(__import__('time').time()))
    model: str = "eternis-qwen"
    choices: List[dict]
    usage: Optional[dict] = None

@router.post("/webhook/chat/completions", response_model=ChatCompletionResponse)
async def chat_completions(request: ChatCompletionRequest):
    """
    OpenAI-compatible endpoint for Vapi
    """
    try:
        user_message = None
        for msg in reversed(request.messages):
            if msg.role == "user":
                user_message = msg.content
                break
        
        if not user_message:
            raise HTTPException(status_code=400, detail="No user message")
        
        # use AI Service
        ai_service = get_ai_service()
        result = ai_service.chat_with_agent(
            f"Voice query: {user_message}",
            max_tokens=64,
            temperature=0.2
        )
        
        response_text = _clean_for_tts(result.get("response", "Sorry, I didn't understand."))
        
        return ChatCompletionResponse(
            model=request.model or "eternis-qwen",
            choices=[{
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": response_text
                },
                "finish_reason": "stop"
            }],
            usage={
                "prompt_tokens": len(user_message.split()),
                "completion_tokens": len(response_text.split()),
                "total_tokens": len(user_message.split()) + len(response_text.split())
            }
        )
        
    except Exception as e:
        logger.error(f"Chat completions error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))