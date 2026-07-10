# app/routers/auth.py - CORRECTED VERSION
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field, validator
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.security import (
    get_password_hash, 
    verify_password, 
    create_access_token,
    get_current_user,  
    TokenData
)
from app.core.config import settings
from datetime import timedelta
import re

router = APIRouter()

# Request/Response models
class UserRegister(BaseModel):
    user_id: str = Field(..., min_length=3, max_length=50)
    user_role: str = Field(..., pattern="^(admin|manager|hr|tech|employee)$")
    password: str = Field(..., min_length=8)
    email: str
    
    @validator('password')
    def password_strength(cls, v):
        if not re.search(r"[A-Z]", v) or not re.search(r"[0-9]", v):
            raise ValueError("Password must contain uppercase letter and number")
        return v

class UserLogin(BaseModel):
    user_id: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60

# Simulated user storage (replace with database in production)
USERS_DB = {}

@router.post("/auth/register", response_model=dict, tags=["Authentication"])
def register(user: UserRegister, db: Session = Depends(get_db)):
    """Register a new user with hashed password."""
    if user.user_id in USERS_DB:
        raise HTTPException(400, detail="User already exists")
    
    USERS_DB[user.user_id] = {
        "user_id": user.user_id,
        "role": user.user_role,
        "email": user.email,
        "hashed_password": get_password_hash(user.password),
        "is_active": True
    }
    
    return {"message": "User registered successfully", "user_id": user.user_id}

@router.post("/auth/login", response_model=TokenResponse, tags=["Authentication"])
def login(user: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user and return JWT token."""
    db_user = USERS_DB.get(user.user_id)
    
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not db_user.get("is_active", True):
        raise HTTPException(403, detail="Account is disabled")
    
    access_token = create_access_token(
        data={"sub": db_user["user_id"], "role": db_user["role"]},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return TokenResponse(access_token=access_token)

@router.get("/auth/me", response_model=dict, tags=["Authentication"])
def get_current_user_info(current_user: TokenData = Depends(get_current_user)):
    """Get current authenticated user info."""
    user = USERS_DB.get(current_user.user_id)
    if not user:
        raise HTTPException(404, detail="User not found")
    
    return {
        "user_id": user["user_id"],
        "role": user["role"],
        "email": user["email"],
        "is_active": user.get("is_active", True)
    }
