from pydantic import BaseModel
from typing import Optional


class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    owner_id: int

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    title: Optional[str] = None
    description: Optional[str] = None
    owner_id: Optional[int] = None

class ProjectResponse(ProjectBase):
    id: int

    class Config:
        orm_mode = True