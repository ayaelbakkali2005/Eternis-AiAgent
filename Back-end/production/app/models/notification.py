# app/models/notification.py
"""Notifications & Audit models."""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON,CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(20), CheckConstraint("type IN ('info', 'warning', 'error', 'success', 'system')"), default='info')
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="notifications")
    __table_args__ = {'extend_existing': True}


class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action = Column(String(50), nullable=False)  # e.g., "CREATE", "UPDATE", "DELETE"
    entity = Column(String(50), nullable=False)   # e.g., "project", "employee"
    entity_id = Column(Integer, nullable=True)
    details = Column(JSON, nullable=True)         # Store extra data as JSON
    ip_address = Column(String(45), nullable=True)  # IPv6 compatible
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", backref="audit_logs")
    __table_args__ = {'extend_existing': True}