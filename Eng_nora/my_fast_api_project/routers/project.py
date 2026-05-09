from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db

from models import project as model
from schemas import project as schema

router = APIRouter(prefix="/projects", tags=["Projects"])


#  Read all
@router.get("/", response_model=List[schema.ProjectResponse])
def get_all_projects(db: Session = Depends(get_db)):
    projects = db.query(model.Project).all()
    return projects


#  Read by id
@router.get("/{project_id}", response_model=schema.ProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(model.Project).filter(model.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


# Create
@router.post("/", response_model=schema.ProjectResponse)
def create_project(project: schema.ProjectCreate, db: Session = Depends(get_db)):
    new_project = model.Project(
        title=project.title, description=project.description, owner_id=project.owner_id
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project


#  Update
@router.put("/{project_id}", response_model=schema.ProjectResponse)
def update_project(
    project_id: int, project: schema.ProjectUpdate, db: Session = Depends(get_db)
):
    db_project = db.query(model.Project).filter(model.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    for key, value in project.dict(exclude_unset=True).items():
        setattr(db_project, key, value)
    db.commit()
    db.refresh(db_project)
    return db_project


# Delete
@router.delete("/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db)):
    db_project = db.query(model.Project).filter(model.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(db_project)
    db.commit()
    return {"detail": "Project deleted"}
