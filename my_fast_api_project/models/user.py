from sqlalchemy import String,Integer,Column,Boolean
from database import Base

class User(Base):
    __tablename__='Users'
    id=Column(Integer,primary_key=True,index=True)
    name=Column(String,index=True,nullable=False)
    email=Column(String,unique=True,index=True,nullable=False)
    is_active=Column(Boolean,default=True,nullable=False)
