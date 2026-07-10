# app/models/project.py
"""Project Management models."""
from sqlalchemy import Column, Integer, String, DateTime, Date, Numeric, ForeignKey, CheckConstraint, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(String(20), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    budget = Column(Numeric(12, 2), nullable=False)
    status = Column(String(20), CheckConstraint("status IN ('planning', 'development', 'testing', 'review', 'completed', 'cancelled', 'on_hold')"), default='planning')
    priority = Column(String(10), CheckConstraint("priority IN ('low', 'medium', 'high', 'critical')"), default='medium')
    start_date = Column(Date)
    deadline = Column(Date)
    progress = Column(Integer, CheckConstraint("progress >= 0 AND progress <= 100"), default=0)
    client_name = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    members = relationship("ProjectMember", back_populates="project", cascade="all, delete-orphan")
    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")
    expenses = relationship("Expense", back_populates="project")
    invoices = relationship("Invoice", back_populates="project")
    
    __table_args__ = {'extend_existing': True}


class ProjectMember(Base):
    __tablename__ = "project_members"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id", ondelete="CASCADE"), nullable=False)
    role = Column(String(50))
    assigned_date = Column(Date, default=func.current_date())
    
    # Relationships
    project = relationship("Project", back_populates="members")
    employee = relationship("Employee", back_populates="project_assignments")
    
    __table_args__ = {'extend_existing': True}
