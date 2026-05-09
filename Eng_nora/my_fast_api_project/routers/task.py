from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db

from models import task as model
from schemas import task as schema

router = APIRouter(prefix="/tasks",tags=["Tasks"])

#  Read all
@router.get("/",response_model=List[schema.TaskResponse])
def get_all_tasks(db:Session=Depends(get_db)):  
    tasks=db.query(model.Task).all()
    return tasks
 

#  Read by id
@router.get("/{task_id}",response_model=schema.TaskResponse)
def get_task(task_id:int,db:Session=Depends(get_db)):
    task=db.query(model.Task).filter(model.Task.id==task_id).first()
    if not task:
        raise HTTPException(status_code=404,detail="Task not found")
    return task

# Create
@router.post("/",response_model=schema.TaskResponse)
def create_task(task:schema.TaskCreate,db:Session=Depends(get_db)):
    new_task=model.Task(title=task.title,description=task.description,status=task.status,project_id=task.project_id,assignee_id=task.assigned_to)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task




#  Update 
@router.put("/{task_id}",response_model=schema.TaskResponse)
def update_task(task_id:int,task:schema.TaskUpdate,db:Session=Depends(get_db)):
    db_task=db.query(model.Task).filter(model.Task.id==task_id).first()
    if not db_task:
        raise HTTPException(status_code=404,detail="Task not found")
    for key,value in task.dict(exclude_unset=True).items():
        setattr(db_task,key,value)
    db.commit()
    db.refresh(db_task)
    return db_task



# Delete
@router.delete("/{task_id}")
def delete_task(task_id:int,db:Session=Depends(get_db)):
    db_task=db.query(model.Task).filter(model.Task.id==task_id).first()
    if not db_task:
        raise HTTPException(status_code=404,detail="Task not found")
    db.delete(db_task)
    db.commit()
    return {"detail": "Task deleted"}