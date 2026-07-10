# app/models/finance.py
"""Finance & Billing models."""
from sqlalchemy import Column, Integer, String, DateTime, Date, Numeric, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class Budget(Base):
    __tablename__ = "budgets"
    
    id = Column(Integer, primary_key=True, index=True)
    period = Column(String(20), nullable=False)  # e.g., "Q1-2024"
    category = Column(String(50), nullable=False)  # e.g., "salaries"
    allocated = Column(Numeric(12, 2), nullable=False)
    spent = Column(Numeric(12, 2), default=0)
    forecast_status = Column(String(20), CheckConstraint("forecast_status IN ('on_track', 'at_risk', 'overrun', 'under_budget')"), default='on_track')
    notes = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    expenses = relationship("Expense", back_populates="budget_category", foreign_keys="Expense.category")
    __table_args__ = {'extend_existing': True}


class Expense(Base):
    __tablename__ = "expenses"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    category = Column(String(50), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    description = Column(String)
    receipt_url = Column(String(500))
    status = Column(String(20), CheckConstraint("status IN ('pending', 'approved', 'rejected', 'reimbursed')"), default='pending')
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    approved_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    employee = relationship("Employee", back_populates="expenses")
    project = relationship("Project", back_populates="expenses")
    budget_category = relationship("Budget", foreign_keys=[category], primaryjoin="and_(Expense.category==Budget.category)")

    __table_args__ = {'extend_existing': True}


class Invoice(Base):
    __tablename__ = "invoices"
    
    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(String(20), unique=True, nullable=False, index=True)
    client_name = Column(String(255), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    amount = Column(Numeric(12, 2), nullable=False)
    status = Column(String(20), CheckConstraint("status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')"), default='draft')
    issue_date = Column(Date, default=func.current_date())
    due_date = Column(Date)
    paid_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="invoices")
    __table_args__ = {'extend_existing': True}