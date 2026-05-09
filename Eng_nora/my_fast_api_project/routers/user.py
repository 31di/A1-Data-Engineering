from fastapi import APIRouter, Depends ,HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import user as model
from schemas import user as schema


router =APIRouter(prefix="/users",tags=["Users"])

#  Read all
@router.get("/",response_model=List[schema.UserResponse])
def get_all_users(db:Session=Depends(get_db)):
    users=db.query(model.User).all()
    return users

 

#  Read by id
@router.get("/{user_id}",response_model=schema.UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user= db.query(model.User).filter(model.User.id==user_id).first()\
        or HTTPException(status_code=404,detail="User not found")
    return user




# Create
@router.post("/",response_model=schema.UserResponse)
def create_user(user:schema.UserCreate,db:Session=Depends(get_db)):
    db_user=model.User(name=user.name,email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user





#  Update 
@router.put("/{user_id}",response_model=schema.UserResponse)
def update_user(user_id:int,user:schema.updateUser,db:Session=Depends(get_db)):
    db_user=db.query(model.User).filter(model.User.id==user_id).first()
    if not db_user:
        raise HTTPException(status_code=404,detail="User not found")
    for key,value in user.dict(exclude_unset=True).items():
        setattr(db_user,key,value)
    db.commit()
    db.refresh(db_user)
    return db_user





# Delete
@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(model.User).filter(model.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()
    return {"detail": "User deleted"}