# app/routers/billing.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import List, Optional
from datetime import date, datetime
from app.db.database import get_db
from app.core.security import get_current_user, TokenData
from app.models.erp_models import (
    Invoice, InvoiceItem, Payment, Expense,
    Project, Employee,
    InvoiceStatus, PaymentMethod, ExpenseCategory
)
from app.schemas.billing_schemas import (
    InvoiceCreate, InvoiceUpdate, InvoiceResponse,
    InvoiceItemCreate, InvoiceItemResponse,
    PaymentCreate, PaymentResponse,
    ExpenseCreate, ExpenseUpdate, ExpenseResponse,
    FinancialReportResponse
)

router = APIRouter(prefix="/api/billing", tags=["Billing & Finance"])

# ============ Helper Functions ============

def generate_invoice_number(db: Session, year: int) -> str:
    """Generate sequential invoice number like INV-2024-001."""
    last_invoice = db.query(Invoice).filter(
        Invoice.invoice_number.like(f"INV-{year}-%")
    ).order_by(Invoice.invoice_number.desc()).first()
    
    if last_invoice:
        last_num = int(last_invoice.invoice_number.split("-")[-1])
        return f"INV-{year}-{last_num + 1:03d}"
    else:
        return f"INV-{year}-001"

def calculate_invoice_totals(items: List[InvoiceItemCreate], tax_rate: float, discount: float) -> dict:
    """Calculate subtotal, tax, and total for an invoice."""
    subtotal = sum(item.quantity * item.unit_price for item in items)
    tax_amount = subtotal * (tax_rate / 100)
    total = subtotal + tax_amount - discount
    return {
        "subtotal": round(subtotal, 2),
        "tax_amount": round(tax_amount, 2),
        "total_amount": round(total, 2)
    }

# ============ Invoice Endpoints ============

@router.post("/invoices", response_model=InvoiceResponse, status_code=status.HTTP_201_CREATED)
def create_invoice(
    invoice_data: InvoiceCreate,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Create a new invoice with items."""
    # Verify project exists if provided
    if invoice_data.project_id:
        project = db.query(Project).filter(Project.id == invoice_data.project_id).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
    
    # Calculate totals
    totals = calculate_invoice_totals(
        invoice_data.items, 
        invoice_data.tax_rate, 
        invoice_data.discount
    )
    
    # Generate invoice number
    invoice_number = generate_invoice_number(db, invoice_data.issue_date.year)
    
    # Create invoice
    db_invoice = Invoice(
        invoice_number=invoice_number,
        project_id=invoice_data.project_id,
        client_name=invoice_data.client_name,
        client_email=invoice_data.client_email,
        subtotal=totals["subtotal"],
        tax_rate=invoice_data.tax_rate,
        tax_amount=totals["tax_amount"],
        discount=invoice_data.discount,
        total_amount=totals["total_amount"],
        issue_date=invoice_data.issue_date,
        due_date=invoice_data.due_date,
        status=InvoiceStatus.DRAFT,
        notes=invoice_data.notes
    )
    
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    
    # Create invoice items
    for item_data in invoice_data.items:
        item_total = item_data.quantity * item_data.unit_price
        db_item = InvoiceItem(
            invoice_id=db_invoice.id,
            description=item_data.description,
            quantity=item_data.quantity,
            unit_price=item_data.unit_price,
            total=round(item_total, 2)
        )
        db.add(db_item)
    
    db.commit()
    
    # Refresh to include items
    db.refresh(db_invoice)
    return db_invoice

@router.get("/invoices", response_model=List[InvoiceResponse])
def get_invoices(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status_filter: Optional[InvoiceStatus] = Query(None, alias="status"),
    project_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Get all invoices with optional filters."""
    query = db.query(Invoice)
    
    if status_filter:
        query = query.filter(Invoice.status == status_filter)
    if project_id:
        query = query.filter(Invoice.project_id == project_id)
    
    invoices = query.order_by(Invoice.issue_date.desc()).offset(skip).limit(limit).all()
    return invoices

@router.get("/invoices/{invoice_id}", response_model=InvoiceResponse)
def get_invoice(
    invoice_id: str,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Get invoice by ID."""
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice

@router.put("/invoices/{invoice_id}", response_model=InvoiceResponse)
def update_invoice(
    invoice_id: str,
    invoice_update: InvoiceUpdate,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Update invoice information."""
    db_invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not db_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    # Update fields
    update_data = invoice_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_invoice, field, value)
    
    # Auto-update status if paid
    if invoice_update.status == InvoiceStatus.PAID and not db_invoice.paid_date:
        db_invoice.paid_date = date.today()
    
    db.commit()
    db.refresh(db_invoice)
    return db_invoice

@router.delete("/invoices/{invoice_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_invoice(
    invoice_id: str,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Delete an invoice (only if draft)."""
    db_invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not db_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    if db_invoice.status != InvoiceStatus.DRAFT:
        raise HTTPException(status_code=400, detail="Only draft invoices can be deleted")
    
    db.delete(db_invoice)
    db.commit()
    return None

# ============ Payment Endpoints ============

@router.post("/invoices/{invoice_id}/payments", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
def record_payment(
    invoice_id: str,
    payment: PaymentCreate,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Record a payment for an invoice."""
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    # Calculate total paid so far
    total_paid = db.query(func.sum(Payment.amount)).filter(
        Payment.invoice_id == invoice_id
    ).scalar() or 0
    
    # Check if payment exceeds balance
    if total_paid + payment.amount > invoice.total_amount:
        raise HTTPException(status_code=400, detail="Payment exceeds invoice balance")
    
    # Create payment
    db_payment = Payment(
        invoice_id=invoice_id,
        amount=payment.amount,
        payment_method=payment.payment_method,
        transaction_reference=payment.transaction_reference,
        payment_date=payment.payment_date or datetime.utcnow(),
        notes=payment.notes
    )
    
    db.add(db_payment)
    
    # Update invoice status if fully paid
    new_total_paid = total_paid + payment.amount
    if new_total_paid >= invoice.total_amount:
        invoice.status = InvoiceStatus.PAID
        invoice.paid_date = date.today()
    elif invoice.status == InvoiceStatus.DRAFT:
        invoice.status = InvoiceStatus.SENT
    
    db.commit()
    db.refresh(db_payment)
    return db_payment

@router.get("/invoices/{invoice_id}/payments", response_model=List[PaymentResponse])
def get_invoice_payments(
    invoice_id: str,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Get all payments for an invoice."""
    return db.query(Payment).filter(Payment.invoice_id == invoice_id).all()

# ============ Expense Endpoints ============

@router.post("/expenses", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
def create_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Record a new expense."""
    # Verify project and employee if provided
    if expense.project_id:
        project = db.query(Project).filter(Project.id == expense.project_id).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
    
    if expense.employee_id:
        employee = db.query(Employee).filter(Employee.id == expense.employee_id).first()
        if not employee:
            raise HTTPException(status_code=404, detail="Employee not found")
    
    db_expense = Expense(
        project_id=expense.project_id,
        employee_id=expense.employee_id,
        category=expense.category,
        description=expense.description,
        amount=expense.amount,
        expense_date=expense.expense_date,
        receipt_url=expense.receipt_url,
        approved=False  # Requires approval by default
    )
    
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@router.get("/expenses", response_model=List[ExpenseResponse])
def get_expenses(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    category: Optional[ExpenseCategory] = None,
    project_id: Optional[str] = None,
    approved_only: bool = False,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Get all expenses with optional filters."""
    query = db.query(Expense)
    
    if category:
        query = query.filter(Expense.category == category)
    if project_id:
        query = query.filter(Expense.project_id == project_id)
    if approved_only:
        query = query.filter(Expense.approved == True)
    
    expenses = query.order_by(Expense.expense_date.desc()).offset(skip).limit(limit).all()
    return expenses

@router.put("/expenses/{expense_id}", response_model=ExpenseResponse)
def update_expense(
    expense_id: str,
    expense_update: ExpenseUpdate,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Update expense information."""
    db_expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    # Update fields
    update_data = expense_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_expense, field, value)
    
    # Auto-set approver if approved
    if expense_update.approved and not db_expense.approved_by:
        db_expense.approved_by = current_user.user_id
    
    db.commit()
    db.refresh(db_expense)
    return db_expense

# ============ Financial Reports ============

@router.get("/reports/financial", response_model=FinancialReportResponse)
def get_financial_report(
    month: str = Query(..., pattern=r"^\d{4}-\d{2}$"),  # Format: YYYY-MM
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Generate financial report for a specific month."""
    year, month_num = map(int, month.split("-"))
    
    # Invoice statistics
    invoice_stats = db.query(
        func.count(Invoice.id),
        func.sum(Invoice.total_amount),
        func.sum(Invoice.total_amount).filter(Invoice.status == InvoiceStatus.PAID),
        func.sum(Invoice.total_amount).filter(Invoice.status != InvoiceStatus.PAID)
    ).filter(
        and_(
            func.extract("year", Invoice.issue_date) == year,
            func.extract("month", Invoice.issue_date) == month_num
        )
    ).first()
    
    total_invoices, total_amount, total_paid, total_pending = invoice_stats or (0, 0, 0, 0)
    
    # Expense statistics
    expense_stats = db.query(
        func.sum(Expense.amount),
        Expense.category
    ).filter(
        and_(
            func.extract("year", Expense.expense_date) == year,
            func.extract("month", Expense.expense_date) == month_num,
            Expense.approved == True
        )
    ).group_by(Expense.category).all()
    
    total_expenses = sum(amount or 0 for amount, _ in expense_stats)
    expenses_by_category = {str(cat): float(amt or 0) for amt, cat in expense_stats}
    
    # Calculate net profit
    net_profit = (total_paid or 0) - (total_expenses or 0)
    
    return FinancialReportResponse(
        period=month,
        total_invoices=total_invoices or 0,
        total_invoice_amount=total_amount or 0,
        total_paid=total_paid or 0,
        total_pending=total_pending or 0,
        total_expenses=total_expenses or 0,
        net_profit=net_profit,
        expenses_by_category=expenses_by_category
    )

@router.get("/reports/project/{project_id}/costs")
def get_project_costs(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Get cost breakdown for a specific project."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Project-related expenses
    project_expenses = db.query(func.sum(Expense.amount)).filter(
        Expense.project_id == project_id,
        Expense.approved == True
    ).scalar() or 0
    
    # Project-related invoices
    project_invoices = db.query(
        func.sum(Invoice.total_amount),
        func.sum(Invoice.total_amount).filter(Invoice.status == InvoiceStatus.PAID)
    ).filter(Invoice.project_id == project_id).first()
    
    total_billed, total_received = project_invoices or (0, 0)
    
    # Employee costs (salaries allocated to project)
    # This is a simplified calculation - in production, you'd track time logs
    project_members = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id
    ).all()
    
    allocated_salary_cost = 0
    for member in project_members:
        employee = db.query(Employee).filter(Employee.id == member.employee_id).first()
        if employee:
            # Assume monthly salary * allocation% * 1 month (simplified)
            allocated_salary_cost += employee.base_salary * (member.allocation_percent / 100)
    
    return {
        "project_id": project_id,
        "project_name": project.name,
        "budget": project.budget,
        "total_expenses": project_expenses,
        "allocated_salary_costs": round(allocated_salary_cost, 2),
        "total_costs": round(project_expenses + allocated_salary_cost, 2),
        "total_billed": total_billed or 0,
        "total_received": total_received or 0,
        "profit_margin": round(((total_received or 0) - (project_expenses + allocated_salary_cost)), 2)
    }