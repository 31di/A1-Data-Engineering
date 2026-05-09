from pydantic import BaseModel ,EmailStr
from typing import Optional

class UserBase(BaseModel):
    name:str
    email:EmailStr
    isactive:Optional[bool]=True

class UserCreate(UserBase):
    pass

class updateUser(UserBase):
    name:Optional[str] = None
    email:Optional[EmailStr] = None
    isactive:Optional[bool]=True

class UserResponse(UserBase):
    id:int

    class config:
        orm_mode = True