# app/routers/projects_api.py
"""Projects CRUD API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional, List
import random
import string

from app.db.database import get_db
from app.models.project import Project
from app.schemas.project_schemas import ProjectCreate, ProjectUpdate, ProjectResponse
from app.core.security import get_current_user, TokenData

router = APIRouter(prefix="/api/projects", tags=["Projects"])

# Schema للقائمة
class ProjectsList(BaseModel):
    projects: List[ProjectResponse]
    total: int


@router.get("", response_model=ProjectsList)
def list_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status_filter: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """List projects with pagination and filtering."""
    query = db.query(Project)
    
    if status_filter:
        query = query.filter(Project.status == status_filter)
    
    total = query.count()
    projects = query.offset(skip).limit(limit).all()
    
    return ProjectsList(projects=projects, total=total)


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Get project by project_id (e.g., P41A05199)."""
    project = db.query(Project).filter(Project.project_id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")
    return project


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Create a new project."""
    # generate project_id if not existed
    generated_id = project.project_id or "P" + "".join(random.choices(string.ascii_uppercase + string.digits, k=10))
    
    # check repeats
    if db.query(Project).filter(Project.project_id == generated_id).first():
        raise HTTPException(status_code=400, detail="Project ID already exists")
    
    # transfoem data to be compatable with model
    db_project = Project(
        project_id=generated_id,
        name=project.name,
        description=project.description,
        status=project.status.value if hasattr(project.status, 'value') else project.status,
        priority=project.priority.value if hasattr(project.priority, 'value') else project.priority,
        start_date=project.start_date,
        deadline=project.deadline,
        budget=project.budget,
        progress=project.progress,
        client_name=project.client_name
    )
    
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: str,
    updates: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Update an existing project."""
    project = db.query(Project).filter(Project.project_id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")
    
    # update opening fields
    update_data = updates.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        # Automaticaly 
        if hasattr(value, 'value'):
            value = value.value
        setattr(project, field, value)
    
    db.commit()
    db.refresh(project)
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    """Delete a project (admin only)."""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    project = db.query(Project).filter(Project.project_id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")
    
    db.delete(project)
    db.commit()
    return None
