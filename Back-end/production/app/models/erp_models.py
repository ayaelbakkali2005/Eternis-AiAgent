# app/models/erp_models.py
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Boolean, Integer, Text, Date, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy import JSON
from sqlalchemy.sql import func
from app.db.database import Base
import enum
import uuid
from enum import Enum as PyEnum  

# ============ Notification Enums ============
class NotificationChannel(PyEnum):
    EMAIL = "email"
    SLACK = "slack"
    IN_APP = "in_app"
    SMS = "sms"

class NotificationPriority(PyEnum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class NotificationStatus(PyEnum):  # ← هذا هو المفقود!
    PENDING = "pending"
    SENT = "sent"
    FAILED = "failed"
    READ = "read"

class NotificationTemplate(PyEnum):
    WELCOME = "welcome"
    TASK_ASSIGNED = "task_assigned"
    DEADLINE_REMINDER = "deadline_reminder"
    PAYMENT_RECEIVED = "payment_received"
    CONTRACT_SIGNED = "contract_signed"
    PROJECT_DELAY = "project_delay"
    CUSTOM = "custom"

# Enums
class EmploymentStatus(str, enum.Enum):
    ACTIVE = "active"
    ON_LEAVE = "on_leave"
    TERMINATED = "terminated"
    PROBATION = "probation"

class AttendanceStatus(str, enum.Enum):
    PRESENT = "present"
    ABSENT = "absent"
    LATE = "late"
    REMOTE = "remote"
    HALF_DAY = "half_day"

class ContractStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    EXPIRED = "expired"
    TERMINATED = "terminated"

# Employee Model
class Employee(Base):
    __tablename__ = "employees"
    
    id = Column(String, primary_key=True, default=lambda: f"E{uuid.uuid4().hex[:8].upper()}")
    employee_code = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String)
    department = Column(String, nullable=False)
    position = Column(String, nullable=False)
    hire_date = Column(Date, nullable=False)
    employment_status = Column(SQLEnum(EmploymentStatus), default=EmploymentStatus.PROBATION)
    base_salary = Column(Float, nullable=False)
    manager_id = Column(String, ForeignKey("employees.id"), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    contracts = relationship("Contract", back_populates="employee", cascade="all, delete-orphan")
    attendance_records = relationship("Attendance", back_populates="employee", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Employee {self.employee_code}: {self.full_name}>"

# Contract Model
class Contract(Base):
    __tablename__ = "contracts"
    
    id = Column(String, primary_key=True, default=lambda: f"C{uuid.uuid4().hex[:8].upper()}")
    employee_id = Column(String, ForeignKey("employees.id"), nullable=False)
    position = Column(String, nullable=False)
    department = Column(String, nullable=False)
    base_salary = Column(Float, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)  # Null for permanent contracts
    contract_type = Column(String, default="permanent")  # permanent, fixed-term, temporary
    status = Column(SQLEnum(ContractStatus), default=ContractStatus.DRAFT)
    terms_and_conditions = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    signed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    employee = relationship("Employee", back_populates="contracts")
    
    def __repr__(self):
        return f"<Contract {self.id} for {self.employee_id}>"

# Attendance Model
class Attendance(Base):
    __tablename__ = "attendance"
    
    id = Column(String, primary_key=True, default=lambda: f"A{uuid.uuid4().hex[:8].upper()}")
    employee_id = Column(String, ForeignKey("employees.id"), nullable=False)
    date = Column(Date, nullable=False, index=True)
    status = Column(SQLEnum(AttendanceStatus), nullable=False)
    check_in = Column(DateTime(timezone=True), nullable=True)
    check_out = Column(DateTime(timezone=True), nullable=True)
    notes = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    employee = relationship("Employee", back_populates="attendance_records")
    
    def __repr__(self):
        return f"<Attendance {self.date} - {self.employee_id}: {self.status}>"

# Payroll Model (for monthly salary calculation)
class Payroll(Base):
    __tablename__ = "payroll"
    
    id = Column(String, primary_key=True, default=lambda: f"P{uuid.uuid4().hex[:8].upper()}")
    employee_id = Column(String, ForeignKey("employees.id"), nullable=False)
    month = Column(String, nullable=False, index=True)  # Format: "YYYY-MM"
    year = Column(Integer, nullable=False)
    
    base_salary = Column(Float, nullable=False)
    allowances = Column(Float, default=0.0)
    deductions = Column(Float, default=0.0)
    bonus = Column(Float, default=0.0)
    overtime_pay = Column(Float, default=0.0)
    
    gross_salary = Column(Float, nullable=False)
    net_salary = Column(Float, nullable=False)
    
    payment_status = Column(String, default="pending")  # pending, paid, cancelled
    payment_date = Column(Date, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<Payroll {self.month}/{self.year} for {self.employee_id}>"
    
# ============ Project Models ============

class ProjectStatus(str, enum.Enum):
    PLANNING = "planning"
    IN_PROGRESS = "in_progress"
    ON_HOLD = "on_hold"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class TaskStatus(str, enum.Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    REVIEW = "review"
    DONE = "done"
    BLOCKED = "blocked"

class Priority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(String, primary_key=True, default=lambda: f"P{uuid.uuid4().hex[:8].upper()}")
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(SQLEnum(ProjectStatus), default=ProjectStatus.PLANNING)
    start_date = Column(Date, nullable=False)
    deadline = Column(Date, nullable=False)
    budget = Column(Float, nullable=True)
    actual_cost = Column(Float, default=0.0)
    progress_percent = Column(Float, default=0.0)
    manager_id = Column(String, ForeignKey("employees.id"), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")
    members = relationship("ProjectMember", back_populates="project", cascade="all, delete-orphan")
    milestones = relationship("Milestone", back_populates="project", cascade="all, delete-orphan")
    invoices = relationship("Invoice", back_populates="project", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Project {self.name}>"

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(String, primary_key=True, default=lambda: f"T{uuid.uuid4().hex[:8].upper()}")
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(SQLEnum(TaskStatus), default=TaskStatus.TODO)
    priority = Column(SQLEnum(Priority), default=Priority.MEDIUM)
    assigned_to = Column(String, ForeignKey("employees.id"), nullable=True)
    estimated_hours = Column(Float, nullable=True)
    actual_hours = Column(Float, default=0.0)
    due_date = Column(Date, nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="tasks")
    assignee = relationship("Employee", foreign_keys=[assigned_to])
    
    def __repr__(self):
        return f"<Task {self.title}>"

class ProjectMember(Base):
    __tablename__ = "project_members"
    
    id = Column(String, primary_key=True, default=lambda: f"M{uuid.uuid4().hex[:8].upper()}")
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    employee_id = Column(String, ForeignKey("employees.id"), nullable=False)
    role = Column(String, nullable=False)  # manager, developer, designer, etc.
    allocation_percent = Column(Float, default=100.0)  # نسبة التخصيص (100% = دوام كامل)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="members")
    employee = relationship("Employee")
    
    def __repr__(self):
        return f"<ProjectMember {self.employee_id} in {self.project_id}>"

class Milestone(Base):
    __tablename__ = "milestones"
    
    id = Column(String, primary_key=True, default=lambda: f"MS{uuid.uuid4().hex[:8].upper()}")
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    target_date = Column(Date, nullable=False)
    completed_date = Column(Date, nullable=True)
    status = Column(SQLEnum(TaskStatus), default=TaskStatus.TODO)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="milestones")
    
    def __repr__(self):
        return f"<Milestone {self.title}>"

# ============ Billing Models ============

class InvoiceStatus(str, enum.Enum):
    DRAFT = "draft"
    SENT = "sent"
    PAID = "paid"
    OVERDUE = "overdue"
    CANCELLED = "cancelled"

class PaymentMethod(str, enum.Enum):
    BANK_TRANSFER = "bank_transfer"
    CREDIT_CARD = "credit_card"
    CASH = "cash"
    CHECK = "check"
    DIGITAL_WALLET = "digital_wallet"

class ExpenseCategory(str, enum.Enum):
    SALARY = "salary"
    EQUIPMENT = "equipment"
    SOFTWARE = "software"
    TRAVEL = "travel"
    MARKETING = "marketing"
    OFFICE = "office"
    OTHER = "other"

class Invoice(Base):
    __tablename__ = "invoices"
    
    id = Column(String, primary_key=True, default=lambda: f"INV{uuid.uuid4().hex[:8].upper()}")
    invoice_number = Column(String, unique=True, index=True, nullable=False)  # مثل: INV-2024-001
    project_id = Column(String, ForeignKey("projects.id"), nullable=True)  # يمكن أن تكون فاتورة عامة
    client_name = Column(String, nullable=False)
    client_email = Column(String, nullable=True)
    
    # Financial details
    subtotal = Column(Float, nullable=False)
    tax_rate = Column(Float, default=15.0)  # نسبة الضريبة المئوية
    tax_amount = Column(Float, default=0.0)
    discount = Column(Float, default=0.0)
    total_amount = Column(Float, nullable=False)
    
    # Dates
    issue_date = Column(Date, nullable=False)
    due_date = Column(Date, nullable=False)
    paid_date = Column(Date, nullable=True)
    
    # Status
    status = Column(SQLEnum(InvoiceStatus), default=InvoiceStatus.DRAFT)
    notes = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="invoices")
    payments = relationship("Payment", back_populates="invoice", cascade="all, delete-orphan")
    invoice_items = relationship("InvoiceItem", back_populates="invoice", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Invoice {self.invoice_number}>"

class InvoiceItem(Base):
    __tablename__ = "invoice_items"
    
    id = Column(String, primary_key=True, default=lambda: f"II{uuid.uuid4().hex[:8].upper()}")
    invoice_id = Column(String, ForeignKey("invoices.id"), nullable=False)
    description = Column(String, nullable=False)
    quantity = Column(Float, default=1.0)
    unit_price = Column(Float, nullable=False)
    total = Column(Float, nullable=False)  # quantity * unit_price
    
    # Relationships
    invoice = relationship("Invoice", back_populates="invoice_items")
    
    def __repr__(self):
        return f"<InvoiceItem {self.description}>"

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(String, primary_key=True, default=lambda: f"PAY{uuid.uuid4().hex[:8].upper()}")
    invoice_id = Column(String, ForeignKey("invoices.id"), nullable=False)
    amount = Column(Float, nullable=False)
    payment_method = Column(SQLEnum(PaymentMethod), nullable=False)
    transaction_reference = Column(String, nullable=True)  # رقم المعاملة البنكية
    payment_date = Column(DateTime(timezone=True), nullable=False)
    notes = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    invoice = relationship("Invoice", back_populates="payments")
    
    def __repr__(self):
        return f"<Payment {self.id} for {self.invoice_id}>"

class Expense(Base):
    __tablename__ = "expenses"
    
    id = Column(String, primary_key=True, default=lambda: f"EXP{uuid.uuid4().hex[:8].upper()}")
    project_id = Column(String, ForeignKey("projects.id"), nullable=True)  # يمكن أن تكون مصاريف عامة
    employee_id = Column(String, ForeignKey("employees.id"), nullable=True)  # من صرف المصروف
    category = Column(SQLEnum(ExpenseCategory), nullable=False)
    description = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    expense_date = Column(Date, nullable=False)
    receipt_url = Column(String, nullable=True)  # رابط صورة الإيصال
    approved = Column(Boolean, default=False)
    approved_by = Column(String, ForeignKey("employees.id"), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    project = relationship("Project")
    employee = relationship("Employee", foreign_keys=[employee_id])
    approver = relationship("Employee", foreign_keys=[approved_by])
    
    def __repr__(self):
        return f"<Expense {self.category}: {self.amount}>"

# ============ تحديث العلاقات في النماذج الموجودة ============

# أضف هذا في كلاس Project (داخل تعريف الـ class):
# invoices = relationship("Invoice", back_populates="project", cascade="all, delete-orphan")

# مثال لكيفية إضافته (إذا لم يكن موجوداً):
"""
class Project(Base):
    # ... (الحقول الأخرى)
    
    # Relationships
    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")
    members = relationship("ProjectMember", back_populates="project", cascade="all, delete-orphan")
    milestones = relationship("Milestone", back_populates="project", cascade="all, delete-orphan")
    invoices = relationship("Invoice", back_populates="project", cascade="all, delete-orphan")  # ← أضف هذا
"""

# ============ CRM Models ============

class CustomerStatus(str, enum.Enum):
    ACTIVE = "active"
    AT_RISK = "at_risk"
    CHURNED = "churned"
    VIP = "vip"

class Customer(Base):
    __tablename__ = "customers"
    
    id = Column(String, primary_key=True, default=lambda: f"CUST{uuid.uuid4().hex[:8].upper()}")
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    company = Column(String, nullable=False)
    status = Column(SQLEnum(CustomerStatus), default=CustomerStatus.ACTIVE)
    satisfaction_score = Column(Float, nullable=True)  # 0-100
    last_contact = Column(DateTime(timezone=True), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    interactions = relationship("Interaction", back_populates="customer", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Customer {self.name} ({self.company})>"

class Interaction(Base):
    __tablename__ = "interactions"
    
    id = Column(String, primary_key=True, default=lambda: f"INT{uuid.uuid4().hex[:8].upper()}")
    customer_id = Column(String, ForeignKey("customers.id"), nullable=False)
    channel = Column(String, nullable=False)  # email, call, meeting, support_ticket
    content = Column(Text, nullable=False)
    sentiment_score = Column(Float, nullable=True)  # -1.0 to 1.0
    
    # Timestamps
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    customer = relationship("Customer", back_populates="interactions")
    
    def __repr__(self):
        return f"<Interaction {self.channel} for {self.customer_id}>"
    
# ============ Notification Models ============

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(String, primary_key=True, default=lambda: f"NOTIF{uuid.uuid4().hex[:8].upper()}")
    recipient_id = Column(String, ForeignKey("employees.id"), nullable=False)
    recipient_email = Column(String, nullable=True)
    
    channel = Column(String, nullable=False)  # email, slack, in_app
    template = Column(String, nullable=False)  # template identifier
    priority = Column(String, default="medium")  # low, medium, high, urgent
    
    subject = Column(String, nullable=True)
    message = Column(Text, nullable=False)
    data = Column(JSON, nullable=True)  # Template variables
    extra_metadata = Column(JSON, nullable=True)  # Tracking context
    
    status = Column(String, default="pending")  # pending, sent, failed, read
    sent_at = Column(DateTime(timezone=True), nullable=True)
    read_at = Column(DateTime(timezone=True), nullable=True)
    
    scheduled_at = Column(DateTime(timezone=True), nullable=True)  # For delayed sending
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    recipient = relationship("Employee", foreign_keys=[recipient_id])
    
    def __repr__(self):
        return f"<Notification {self.id} to {self.recipient_id} via {self.channel}>"

class NotificationPreference(Base):
    __tablename__ = "notification_preferences"
    
    id = Column(String, primary_key=True, default=lambda: f"NP{uuid.uuid4().hex[:8].upper()}")
    user_id = Column(String, ForeignKey("employees.id"), unique=True, nullable=False)
    
    email_enabled = Column(Boolean, default=True)
    slack_enabled = Column(Boolean, default=False)
    in_app_enabled = Column(Boolean, default=True)
    sms_enabled = Column(Boolean, default=False)
    
    quiet_hours_start = Column(String, nullable=True)  # "22:00"
    quiet_hours_end = Column(String, nullable=True)    # "08:00"
    
    preferred_channels = Column(JSON, default=["in_app"])  # List of channel strings
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("Employee", foreign_keys=[user_id])
    
    def __repr__(self):
        return f"<NotificationPreference for {self.user_id}>"