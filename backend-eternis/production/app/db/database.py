# app/db/database.py
"""Database connection and session management."""
import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv

# Setup logger
logger = logging.getLogger(__name__)

load_dotenv()

# Database URL from environment
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://erp_user:erp_secure_pass_2024@db:5432/erp_db"
)

# Create engine with connection pooling
engine = create_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,  # Check connection before use
    echo=False  # Set to True for SQL debugging (False in production)
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base for models
Base = declarative_base()


def get_db() -> Session:
    """Dependency for FastAPI routes to get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database tables safely (idempotent)."""
    # Import models to register them with Base
    # Use lazy import to avoid circular dependencies
    from app.models import user          # noqa: F401
    from app.models import project       # noqa: F401
    from app.models import employee      # noqa: F401
    from app.models import finance       # noqa: F401
    from app.models import task          # noqa: F401
    from app.models import notification  # noqa: F401
    
    # Create all tables safely (checkfirst=True prevents errors if tables exist)
    try:
        Base.metadata.create_all(bind=engine, checkfirst=True)
        logger.info(" Database tables initialized successfully")
    except Exception as e:
        if "already defined" in str(e).lower():
            # Expected in dev mode with hot-reload ← safe to ignore
            logger.warning(" Tables already registered, skipping creation")
        else:
            logger.error(f" Failed to initialize database: {e}")
            raise


def reset_db():
    """Drop all tables (for testing only - DANGEROUS in production!)."""
    logger.warning(" Dropping all database tables - TESTING ONLY")
    Base.metadata.drop_all(bind=engine)
