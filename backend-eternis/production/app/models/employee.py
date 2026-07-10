# app/models/employee.py
"""HR & Employee models."""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, Numeric, ForeignKey, CheckConstraint
from sqlalchemy import UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class Department(Base):
    __tablename__ = "departments"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    manager_id = Column(Integer, ForeignKey("employees.id"))
    budget_allocated = Column(Numeric(12, 2), default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    employees = relationship("Employee", back_populates="department_obj")
    __table_args__ = {'extend_existing': True}


class Employee(Base):
    __tablename__ = "employees"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String(20), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(20))
    role = Column(String(100), nullable=False)
    department = Column(String(100), nullable=False)  # Text field for display
    salary = Column(Numeric(10, 2))
    hire_date = Column(Date, default=func.current_date())
    manager_id = Column(Integer, ForeignKey("employees.id"))
    performance_rating = Column(String(20), CheckConstraint("performance_rating IN ('excellent', 'good', 'average', 'needs_improvement')"), default='good')
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    department_obj = relationship("Department", back_populates="employees", foreign_keys=[department])
    subordinates = relationship("Employee", backref="manager", remote_side=[id])
    tasks = relationship("Task", back_populates="assignee")
    expenses = relationship("Expense", back_populates="employee")
    attendance_records = relationship("Attendance", back_populates="employee")
    __table_args__ = {'extend_existing': True}


class Attendance(Base):
    __tablename__ = "attendance"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False)
    check_in = Column(DateTime(timezone=True))
    check_out = Column(DateTime(timezone=True))
    status = Column(String(20), CheckConstraint("status IN ('present', 'absent', 'late', 'remote', 'holiday', 'sick')"), default='present')
    notes = Column(String)
    
    # Relationships
    employee = relationship("Employee", back_populates="attendance_records")
    project_assignments = relationship("ProjectMember", back_populates="employee")
    __table_args__ = {'extend_existing': True}
    

Attendance.__table_args__ = (UniqueConstraint('employee_id', 'date', name='uq_attendance_emp_date'),)