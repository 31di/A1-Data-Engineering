from sqlalchemy import String,Integer,Column,ForeignKey
from database import Base
from sqlalchemy.orm import relationship

class Project(Base):
    __tablename__='Projects'
    id=Column(Integer,primary_key=True,index=True)
    title=Column(String,index=True,nullable=False)
    description=Column(String,index=True,nullable=False)
    #سويت set null عشان لما ينحذف اليوزر ماتنحذف بل ترجع NULL
    owner_id=Column(Integer,ForeignKey('Users.id',ondelete="SET NULL"),nullable=True)
    
    
    owner = relationship("User")