# app/routers/projects.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date, datetime
from app.db.database import get_db
from app.core.security import get_current_user, TokenData
from app.models.erp_models import (
    Project, Task, ProjectMember, Milestone,
    ProjectStatus, TaskStatus, Priority, Employee
)
from app.schemas.project_schemas import (
    ProjectCreate, ProjectUpdate, ProjectResponse,
    TaskCreate, TaskUpdate, TaskResponse,
    ProjectMemberCreate, ProjectMemberResponse,
    MilestoneCreate, MilestoneResponse
)

router = APIRouter(prefix="/api/projects", tags=["Project Management"])

# ============ Project Endpoints ============

@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Create a new project."""
    # Verify manager exists if provided
    if project.manager_id:
        manager = db.query(Employee).filter(Employee.id == project.manager_id).first()
        if not manager:
            raise HTTPException(status_code=404, detail="Manager (employee) not found")
    
    db_project = Project(
        name=project.name,
        description=project.description,
        start_date=project.start_date,
        deadline=project.deadline,
        budget=project.budget,
        manager_id=project.manager_id,
        status=ProjectStatus.PLANNING
    )
    
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    
    return db_project

@router.get("", response_model=List[ProjectResponse])
def get_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status_filter: Optional[ProjectStatus] = Query(None, alias="status"),
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Get all projects with optional filters."""
    query = db.query(Project)
    
    if status_filter:
        query = query.filter(Project.status == status_filter)
    
    projects = query.offset(skip).limit(limit).all()
    return projects

@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Get project by ID."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: str,
    project_update: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Update project information."""
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Update only provided fields
    update_data = project_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_project, field, value)
    
    db.commit()
    db.refresh(db_project)
    return db_project

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Delete a project."""
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(db_project)
    db.commit()
    return None

# ============ Task Endpoints ============

@router.post("/{project_id}/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    project_id: str,
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Create a new task in a project."""
    # Verify project exists
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Verify assignee exists if provided
    if task.assigned_to:
        employee = db.query(Employee).filter(Employee.id == task.assigned_to).first()
        if not employee:
            raise HTTPException(status_code=404, detail="Assigned employee not found")
    
    db_task = Task(
        project_id=project_id,
        title=task.title,
        description=task.description,
        priority=task.priority,
        assigned_to=task.assigned_to,
        estimated_hours=task.estimated_hours,
        due_date=task.due_date,
        status=TaskStatus.TODO
    )
    
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    
    return db_task

@router.get("/{project_id}/tasks", response_model=List[TaskResponse])
def get_project_tasks(
    project_id: str,
    status_filter: Optional[TaskStatus] = Query(None, alias="status"),
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Get all tasks for a project."""
    query = db.query(Task).filter(Task.project_id == project_id)
    
    if status_filter:
        query = query.filter(Task.status == status_filter)
    
    return query.order_by(Task.due_date.asc()).all()

@router.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: str,
    task_update: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Update task information."""
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Update fields
    update_data = task_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)
    
    # Auto-set completed_at if status is DONE
    if task_update.status == TaskStatus.DONE and not db_task.completed_at:
        db_task.completed_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_task)
    return db_task

# ============ Project Member Endpoints ============

@router.post("/{project_id}/members", response_model=ProjectMemberResponse, status_code=status.HTTP_201_CREATED)
def add_project_member(
    project_id: str,
    member: ProjectMemberCreate,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Add a member to a project."""
    # Verify project and employee exist
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    employee = db.query(Employee).filter(Employee.id == member.employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Check if already a member
    existing = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.employee_id == member.employee_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Employee already a member of this project")
    
    db_member = ProjectMember(
        project_id=project_id,
        employee_id=member.employee_id,
        role=member.role,
        allocation_percent=member.allocation_percent
    )
    
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    
    return db_member

@router.get("/{project_id}/members", response_model=List[ProjectMemberResponse])
def get_project_members(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Get all members of a project."""
    return db.query(ProjectMember).filter(ProjectMember.project_id == project_id).all()

# ============ Milestone Endpoints ============

@router.post("/{project_id}/milestones", response_model=MilestoneResponse, status_code=status.HTTP_201_CREATED)
def create_milestone(
    project_id: str,
    milestone: MilestoneCreate,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Create a new milestone for a project."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db_milestone = Milestone(
        project_id=project_id,
        title=milestone.title,
        description=milestone.description,
        target_date=milestone.target_date,
        status=TaskStatus.TODO
    )
    
    db.add(db_milestone)
    db.commit()
    db.refresh(db_milestone)
    
    return db_milestone

@router.get("/{project_id}/milestones", response_model=List[MilestoneResponse])
def get_project_milestones(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Get all milestones for a project."""
    return db.query(Milestone).filter(Milestone.project_id == project_id).all()

# ============ Progress & Reports ============

@router.get("/{project_id}/progress")
def get_project_progress(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Calculate and return project progress."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Calculate progress based on tasks
    tasks = db.query(Task).filter(Task.project_id == project_id).all()
    total_tasks = len(tasks)
    completed_tasks = sum(1 for t in tasks if t.status == TaskStatus.DONE)
    
    progress_percent = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
    
    # Calculate total hours
    total_estimated_hours = sum(t.estimated_hours or 0 for t in tasks)
    total_actual_hours = sum(t.actual_hours or 0 for t in tasks)
    
    return {
        "project_id": project_id,
        "project_name": project.name,
        "status": project.status,
        "progress_percent": round(progress_percent, 2),
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "pending_tasks": total_tasks - completed_tasks,
        "total_estimated_hours": total_estimated_hours,
        "total_actual_hours": total_actual_hours,
        "budget": project.budget,
        "actual_cost": project.actual_cost
    }