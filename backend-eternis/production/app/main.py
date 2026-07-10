# app/main.py
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from contextlib import asynccontextmanager
import logging
import sys
import os
from dotenv import load_dotenv

load_dotenv()

from app.routers import (
    auth,
    hr,
    projects,
    billing,
    ai,
    crm,
    notifications,
    projects_api,
    voice_api
)
from app.db.database import engine, init_db
from app.core.config import settings

logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL.upper()),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"🚀 Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    try:
        init_db()
        logger.info("✅ Database initialized")
    except Exception as e:
        logger.error(f"❌ Database init failed: {e}")
    yield
    logger.info("🛑 Shutting down...")
    engine.dispose()
    logger.info("✅ Database connections closed")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-Powered ERP System with Qwen integration",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",      # React/Vite default
        "http://localhost:5173",      #vite default
        "http://127.0.0.1:3000",
        "https://eternis-frontend.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api", tags=["Authentication"])
app.include_router(hr.router, tags=["HR Management"])
app.include_router(projects.router, tags=["Project Management"])
app.include_router(billing.router, tags=["Billing & Finance"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI Intelligence"])
app.include_router(crm.router, tags=["Customer Relationship Management"])
app.include_router(notifications.router, tags=["Notifications"])
app.include_router(projects_api.router, tags=["Projects API"])
app.include_router(voice_api.router) 

@app.get("/api/health", tags=["System"])
def health_check():
    db_status = "disconnected"
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            if result.fetchone()[0] == 1:
                db_status = "connected"
    except Exception as e:
        logger.warning(f"Database health check failed: {e}")
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "auth": "enabled",
        "database": db_status
    }

@app.get("/", tags=["System"])
def root():
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "docs": "/docs",
        "health": "/api/health"
    }

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error", "error_id": "INTERNAL_ERROR"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower()
    )
