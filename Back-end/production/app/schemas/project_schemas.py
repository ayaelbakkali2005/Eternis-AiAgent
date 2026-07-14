# app/schemas/project_schemas.py
from pydantic import BaseModel, Field, ConfigDict
from datetime import date, datetime
from typing import Optional, List
from enum import Enum
from decimal import Decimal

class ProjectStatus(str, Enum):
    PLANNING = "planning"
    DEVELOPMENT = "development"
    TESTING = "testing"
    REVIEW = "review"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    ON_HOLD = "on_hold"

class TaskStatus(str, Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    REVIEW = "review"
    DONE = "done"
    BLOCKED = "blocked"

class Priority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=255)
    description: Optional[str] = None
    status: ProjectStatus = ProjectStatus.PLANNING
    priority: Priority = Priority.MEDIUM
    start_date: Optional[date] = None
    deadline: Optional[date] = None
    budget: Decimal = Field(..., ge=0)
    progress: int = Field(default=0, ge=0, le=100)
    client_name: Optional[str] = Field(None, max_length=255)
    project_id: Optional[str] = Field(None, pattern=r"^[A-Z0-9]{5,20}$")

class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=3, max_length=255)
    description: Optional[str] = None
    status: Optional[ProjectStatus] = None
    priority: Optional[Priority] = None
    start_date: Optional[date] = None
    deadline: Optional[date] = None
    budget: Optional[Decimal] = Field(None, ge=0)
    progress: Optional[int] = Field(None, ge=0, le=100)
    client_name: Optional[str] = None

class ProjectResponse(BaseModel):
    id: int
    project_id: str
    name: str
    description: Optional[str]
    status: ProjectStatus
    priority: Priority
    start_date: Optional[date]
    deadline: Optional[date]
    budget: Decimal
    progress: int
    client_name: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]
    model_config = ConfigDict(from_attributes=True)

class ProjectsList(BaseModel):
    projects: List[ProjectResponse]
    total: int

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    description: Optional[str] = None
    status: TaskStatus = TaskStatus.TODO
    priority: Priority = Priority.MEDIUM
    due_date: Optional[date] = None
    project_id: int
    assigned_to: Optional[int] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[Priority] = None
    assigned_to: Optional[int] = None
    due_date: Optional[date] = None

class TaskResponse(BaseModel):
    id: int
    project_id: int
    task_id: str
    title: str
    description: Optional[str]
    status: TaskStatus
    priority: Priority
    assigned_to: Optional[int]
    due_date: Optional[date]
    completed_at: Optional[datetime]
    created_at: datetime
    updated_at: Optional[datetime]
    model_config = ConfigDict(from_attributes=True)

class ProjectMemberCreate(BaseModel):
    employee_id: int
    role: str = Field(..., min_length=2)
    allocation_percent: float = Field(default=100.0, ge=0, le=100)

class ProjectMemberResponse(BaseModel):
    id: int
    project_id: int
    employee_id: int
    role: str
    allocation_percent: float
    assigned_date: date
    model_config = ConfigDict(from_attributes=True)

class MilestoneCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    description: Optional[str] = None
    target_date: date

class MilestoneResponse(BaseModel):
    id: int
    project_id: int
    title: str
    description: Optional[str]
    target_date: date
    completed_date: Optional[date]
    status: TaskStatus
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)