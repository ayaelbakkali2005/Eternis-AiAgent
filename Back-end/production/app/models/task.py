# app/models/task.py
"""Task Management models."""
from sqlalchemy import (Column, 
                        Integer, 
                        String, 
                        DateTime, 
                        Date, 
                        ForeignKey, 
                        CheckConstraint, 
                        Text)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(String(20), unique=True, nullable=False, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    assigned_to = Column(Integer, ForeignKey("employees.id"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    status = Column(String(20), CheckConstraint("status IN ('todo', 'in_progress', 'review', 'done', 'blocked')"), default='todo')
    priority = Column(String(10), CheckConstraint("priority IN ('low', 'medium', 'high')"), default='medium')
    due_date = Column(Date)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="tasks")
    assignee = relationship("Employee", back_populates="tasks")
    __table_args__ = {'extend_existing': True}