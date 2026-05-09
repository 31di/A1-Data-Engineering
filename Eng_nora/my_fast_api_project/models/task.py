from sqlalchemy import String, Integer, Column, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Task(Base):
    __tablename__ = "Tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(String, index=True, nullable=False)
    status = Column(String, default="pending")
    # سويت CASCADE عشان لما ينحذف مشروع تنحذف معاه التاسك
    project_id = Column(
        Integer, ForeignKey("Projects.id", ondelete="CASCADE"), nullable=False
    )
    # سويتset null عشان لما ينحذف اليوزر ماتنحذف بل ترجع NULL
    assignee_id = Column(
        Integer, ForeignKey("Users.id", ondelete="SET NULL"), nullable=True
    )

    project = relationship("Project")
    assignee = relationship("User")

    @property
    def assigned_to(self):
        return self.assignee_id

    @assigned_to.setter
    def assigned_to(self, value):
        self.assignee_id = value
