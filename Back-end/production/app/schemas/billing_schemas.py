# app/schemas/billing_schemas.py
from pydantic import BaseModel, Field, EmailStr
from datetime import date, datetime
from typing import Optional, List
from enum import Enum

# Enums
class InvoiceStatus(str, Enum):
    DRAFT = "draft"
    SENT = "sent"
    PAID = "paid"
    OVERDUE = "overdue"
    CANCELLED = "cancelled"

class PaymentMethod(str, Enum):
    BANK_TRANSFER = "bank_transfer"
    CREDIT_CARD = "credit_card"
    CASH = "cash"
    CHECK = "check"
    DIGITAL_WALLET = "digital_wallet"

class ExpenseCategory(str, Enum):
    SALARY = "salary"
    EQUIPMENT = "equipment"
    SOFTWARE = "software"
    TRAVEL = "travel"
    MARKETING = "marketing"
    OFFICE = "office"
    OTHER = "other"

# ============ Invoice Item Schemas ============

class InvoiceItemCreate(BaseModel):
    description: str = Field(..., min_length=3, max_length=500)
    quantity: float = Field(default=1.0, gt=0)
    unit_price: float = Field(..., gt=0)

class InvoiceItemResponse(BaseModel):
    id: str
    invoice_id: str
    description: str
    quantity: float
    unit_price: float
    total: float
    
    class Config:
        from_attributes = True

# ============ Invoice Schemas ============

class InvoiceCreate(BaseModel):
    project_id: Optional[str] = None
    client_name: str = Field(..., min_length=2, max_length=200)
    client_email: Optional[EmailStr] = None
    items: List[InvoiceItemCreate]
    tax_rate: float = Field(default=15.0, ge=0, le=100)
    discount: float = Field(default=0.0, ge=0)
    issue_date: date
    due_date: date
    notes: Optional[str] = None

class InvoiceUpdate(BaseModel):
    client_name: Optional[str] = None
    client_email: Optional[EmailStr] = None
    status: Optional[InvoiceStatus] = None
    due_date: Optional[date] = None
    notes: Optional[str] = None

class InvoiceResponse(BaseModel):
    id: str
    invoice_number: str
    project_id: Optional[str]
    client_name: str
    client_email: Optional[str]
    subtotal: float
    tax_rate: float
    tax_amount: float
    discount: float
    total_amount: float
    amount_paid: float  # Calculated field
    balance_due: float  # Calculated field
    issue_date: date
    due_date: date
    paid_date: Optional[date]
    status: InvoiceStatus
    notes: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]
    items: List[InvoiceItemResponse]
    
    class Config:
        from_attributes = True

# ============ Payment Schemas ============

class PaymentCreate(BaseModel):
    amount: float = Field(..., gt=0)
    payment_method: PaymentMethod
    transaction_reference: Optional[str] = None
    payment_date: Optional[datetime] = None
    notes: Optional[str] = None

class PaymentResponse(BaseModel):
    id: str
    invoice_id: str
    amount: float
    payment_method: PaymentMethod
    transaction_reference: Optional[str]
    payment_date: datetime
    notes: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

# ============ Expense Schemas ============

class ExpenseCreate(BaseModel):
    project_id: Optional[str] = None
    employee_id: Optional[str] = None
    category: ExpenseCategory
    description: str = Field(..., min_length=3, max_length=500)
    amount: float = Field(..., gt=0)
    expense_date: date
    receipt_url: Optional[str] = None

class ExpenseUpdate(BaseModel):
    description: Optional[str] = None
    amount: Optional[float] = None
    category: Optional[ExpenseCategory] = None
    approved: Optional[bool] = None

class ExpenseResponse(BaseModel):
    id: str
    project_id: Optional[str]
    employee_id: Optional[str]
    category: ExpenseCategory
    description: str
    amount: float
    expense_date: date
    receipt_url: Optional[str]
    approved: bool
    approved_by: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

# ============ Financial Report Schemas ============

class FinancialReportResponse(BaseModel):
    period: str  # e.g., "2024-01"
    total_invoices: int
    total_invoice_amount: float
    total_paid: float
    total_pending: float
    total_expenses: float
    net_profit: float
    expenses_by_category: dict  # {category: amount}
    
    class Config:
        from_attributes = True