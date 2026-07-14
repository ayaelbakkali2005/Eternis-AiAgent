# app/services/erp_tools.py
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.erp_models import Employee, Project, Task
from datetime import datetime

def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_projects_summary() -> dict:
    """Retrieve all projects with status and progress."""
    db = next(get_db())
    projects = db.query(Project).all()
    return {
        "projects": [
            {"id": p.id, "name": p.name, "status": p.status, "progress": p.progress_percent, "budget": p.budget}
            for p in projects
        ]
    }

def create_task(project_id: str, title: str, description: str, assigned_to: str, priority: str = "medium") -> dict:
    """Create a new task in a project."""
    db = next(get_db())
    new_task = Task(
        id=f"TASK-{datetime.now().strftime('%Y%m%d%H%M')}",
        project_id=project_id,
        title=title,
        description=description,
        assigned_to=assigned_to,
        priority=priority,
        status="todo",
        created_at=datetime.utcnow()
    )
    db.add(new_task)
    db.commit()
    return {"success": True, "task_id": new_task.id, "message": "Task created successfully"}

def get_employee_info(employee_id: str) -> dict:
    """Fetch employee details and current workload."""
    db = next(get_db())
    emp = db.query(Employee).filter(Employee.id == employee_id).first()
    if not emp:
        return {"error": "Employee not found"}
    tasks = db.query(Task).filter(Task.assigned_to == employee_id, Task.status != "done").count()
    return {
        "id": emp.id,
        "name": emp.full_name,
        "department": emp.department,
        "position": emp.position,
        "active_tasks": tasks
    }

def update_project_status(project_id: str, new_status: str) -> dict:
    """Update project status (planning, active, on_hold, completed)."""
    db = next(get_db())
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        return {"error": "Project not found"}
    project.status = new_status
    project.updated_at = datetime.utcnow()
    db.commit()
    return {"success": True, "project_id": project_id, "new_status": new_status}

# 🔑 قائمة الأدوات المتاحة للذكاء الاصطناعي
AVAILABLE_TOOLS = {
    "get_projects_summary": get_projects_summary,
    "create_task": create_task,
    "get_employee_info": get_employee_info,
    "update_project_status": update_project_status
}