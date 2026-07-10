# app/routers/hr.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from app.db.database import get_db
from app.core.security import get_current_user, TokenData
from app.models.erp_models import Employee, Contract, Attendance, Payroll, EmploymentStatus, AttendanceStatus, ContractStatus
from app.schemas.hr_schemas import (
    EmployeeCreate, EmployeeUpdate, EmployeeResponse,
    ContractCreate, ContractResponse,
    AttendanceCreate, AttendanceResponse,
    PayrollCreate, PayrollResponse
)
from sqlalchemy import and_

router = APIRouter(prefix="/api/hr", tags=["HR Management"])

# ============ Employee Endpoints ============

@router.post("/employees", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee(
    employee: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Create a new employee (HR/Admin only)."""
    # Check if employee code or email already exists
    if db.query(Employee).filter(Employee.employee_code == employee.employee_code).first():
        raise HTTPException(status_code=400, detail="Employee code already exists")
    
    if db.query(Employee).filter(Employee.email == employee.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create employee
    db_employee = Employee(
        employee_code=employee.employee_code,
        full_name=employee.full_name,
        email=employee.email,
        phone=employee.phone,
        department=employee.department,
        position=employee.position,
        hire_date=employee.hire_date,
        base_salary=employee.base_salary,
        manager_id=employee.manager_id,
        employment_status=EmploymentStatus.PROBATION
    )
    
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    
    return db_employee

@router.get("/employees", response_model=List[EmployeeResponse])
def get_employees(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    department: Optional[str] = None,
    status: Optional[EmploymentStatus] = None,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Get all employees with optional filters."""
    query = db.query(Employee)
    
    if department:
        query = query.filter(Employee.department == department)
    if status:
        query = query.filter(Employee.employment_status == status)
    
    employees = query.offset(skip).limit(limit).all()
    return employees

@router.get("/employees/{employee_id}", response_model=EmployeeResponse)
def get_employee(
    employee_id: str,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Get employee by ID."""
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

@router.put("/employees/{employee_id}", response_model=EmployeeResponse)
def update_employee(
    employee_id: str,
    employee_update: EmployeeUpdate,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Update employee information."""
    db_employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Update only provided fields
    update_data = employee_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_employee, field, value)
    
    db.commit()
    db.refresh(db_employee)
    return db_employee

# ============ Contract Endpoints ============

@router.post("/contracts", response_model=ContractResponse, status_code=status.HTTP_201_CREATED)
def create_contract(
    contract: ContractCreate,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Create a new contract for an employee."""
    # Verify employee exists
    employee = db.query(Employee).filter(Employee.id == contract.employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    db_contract = Contract(
        employee_id=contract.employee_id,
        position=contract.position,
        department=contract.department,
        base_salary=contract.base_salary,
        start_date=contract.start_date,
        end_date=contract.end_date,
        contract_type=contract.contract_type,
        terms_and_conditions=contract.terms_and_conditions,
        status=ContractStatus.DRAFT
    )
    
    db.add(db_contract)
    db.commit()
    db.refresh(db_contract)
    
    return db_contract

@router.get("/contracts/{contract_id}", response_model=ContractResponse)
def get_contract(
    contract_id: str,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Get contract by ID."""
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    return contract

@router.post("/contracts/{contract_id}/sign")
def sign_contract(
    contract_id: str,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Sign and activate a contract."""
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    
    if contract.status != ContractStatus.DRAFT:
        raise HTTPException(status_code=400, detail="Contract must be in draft status")
    
    from datetime import datetime
    contract.status = ContractStatus.ACTIVE
    contract.signed_at = datetime.utcnow()
    
    db.commit()
    db.refresh(contract)
    
    return {"message": "Contract signed successfully", "contract_id": contract.id}

# ============ Attendance Endpoints ============

@router.post("/attendance", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
def mark_attendance(
    attendance: AttendanceCreate,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Mark attendance for an employee."""
    # Check if attendance already exists for this date
    existing = db.query(Attendance).filter(
        and_(Attendance.employee_id == attendance.employee_id, Attendance.date == attendance.date)
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Attendance already marked for this date")
    
    db_attendance = Attendance(
        employee_id=attendance.employee_id,
        date=attendance.date,
        status=attendance.status,
        check_in=attendance.check_in,
        check_out=attendance.check_out,
        notes=attendance.notes
    )
    
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    
    return db_attendance

@router.get("/attendance/{employee_id}", response_model=List[AttendanceResponse])
def get_attendance(
    employee_id: str,
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Get attendance records for an employee."""
    query = db.query(Attendance).filter(Attendance.employee_id == employee_id)
    
    if from_date:
        query = query.filter(Attendance.date >= from_date)
    if to_date:
        query = query.filter(Attendance.date <= to_date)
    
    return query.order_by(Attendance.date.desc()).all()

# ============ Payroll Endpoints ============

@router.post("/payroll", response_model=PayrollResponse, status_code=status.HTTP_201_CREATED)
def calculate_payroll(
    payroll_data: PayrollCreate,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Calculate monthly payroll for an employee."""
    # Verify employee exists
    employee = db.query(Employee).filter(Employee.id == payroll_data.employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Check if payroll already exists for this month
    existing = db.query(Payroll).filter(
        and_(Payroll.employee_id == payroll_data.employee_id, Payroll.month == payroll_data.month)
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Payroll already exists for this month")
    
    # Extract year from month (YYYY-MM format)
    year = int(payroll_data.month.split("-")[0])
    
    # Calculate salaries
    gross_salary = (
        payroll_data.base_salary +
        payroll_data.allowances +
        payroll_data.bonus +
        payroll_data.overtime_pay
    )
    
    net_salary = gross_salary - payroll_data.deductions
    
    db_payroll = Payroll(
        employee_id=payroll_data.employee_id,
        month=payroll_data.month,
        year=year,
        base_salary=payroll_data.base_salary,
        allowances=payroll_data.allowances,
        deductions=payroll_data.deductions,
        bonus=payroll_data.bonus,
        overtime_pay=payroll_data.overtime_pay,
        gross_salary=gross_salary,
        net_salary=net_salary,
        payment_status="pending"
    )
    
    db.add(db_payroll)
    db.commit()
    db.refresh(db_payroll)
    
    return db_payroll

@router.get("/payroll/{employee_id}", response_model=List[PayrollResponse])
def get_payroll_history(
    employee_id: str,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Get payroll history for an employee."""
    return db.query(Payroll).filter(Payroll.employee_id == employee_id).order_by(
        Payroll.year.desc(), Payroll.month.desc()
    ).all()