# app/schemas/hr_schemas.py
from pydantic import BaseModel, Field, EmailStr, validator
from datetime import date, datetime
from typing import Optional, List
from enum import Enum

# Enums
class EmploymentStatus(str, Enum):
    ACTIVE = "active"
    ON_LEAVE = "on_leave"
    TERMINATED = "terminated"
    PROBATION = "probation"

class AttendanceStatus(str, Enum):
    PRESENT = "present"
    ABSENT = "absent"
    LATE = "late"
    REMOTE = "remote"
    HALF_DAY = "half_day"

class ContractStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    EXPIRED = "expired"
    TERMINATED = "terminated"

# ============ Employee Schemas ============

class EmployeeCreate(BaseModel):
    employee_code: str = Field(..., min_length=3, max_length=20)
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = None
    department: str = Field(..., min_length=2)
    position: str = Field(..., min_length=2)
    hire_date: date
    base_salary: float = Field(..., gt=0)
    manager_id: Optional[str] = None

class EmployeeUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    employment_status: Optional[EmploymentStatus] = None
    base_salary: Optional[float] = None

class EmployeeResponse(BaseModel):
    id: str
    employee_code: str
    full_name: str
    email: str
    phone: Optional[str]
    department: str
    position: str
    hire_date: date
    employment_status: EmploymentStatus
    base_salary: float
    manager_id: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

# ============ Contract Schemas ============

class ContractCreate(BaseModel):
    employee_id: str
    position: str
    department: str
    base_salary: float = Field(..., gt=0)
    start_date: date
    end_date: Optional[date] = None
    contract_type: str = Field(default="permanent")
    terms_and_conditions: Optional[str] = None

class ContractResponse(BaseModel):
    id: str
    employee_id: str
    position: str
    department: str
    base_salary: float
    start_date: date
    end_date: Optional[date]
    contract_type: str
    status: ContractStatus
    created_at: datetime
    signed_at: Optional[datetime]
    
    class Config:
        from_attributes = True

# ============ Attendance Schemas ============

class AttendanceCreate(BaseModel):
    employee_id: str
    date: date
    status: AttendanceStatus
    check_in: Optional[datetime] = None
    check_out: Optional[datetime] = None
    notes: Optional[str] = None

class AttendanceResponse(BaseModel):
    id: str
    employee_id: str
    date: date
    status: AttendanceStatus
    check_in: Optional[datetime]
    check_out: Optional[datetime]
    notes: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

# ============ Payroll Schemas ============

class PayrollCreate(BaseModel):
    employee_id: str
    month: str = Field(..., pattern=r"^\d{4}-\d{2}$")  # YYYY-MM format
    base_salary: float
    allowances: float = 0.0
    deductions: float = 0.0
    bonus: float = 0.0
    overtime_pay: float = 0.0

class PayrollResponse(BaseModel):
    id: str
    employee_id: str
    month: str
    year: int
    base_salary: float
    allowances: float
    deductions: float
    bonus: float
    overtime_pay: float
    gross_salary: float
    net_salary: float
    payment_status: str
    payment_date: Optional[date]
    created_at: datetime
    
    class Config:
        from_attributes = True