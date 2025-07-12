import uuid
from datetime import timezone, datetime

from sqlalchemy import Column, DateTime, String, ForeignKey, text, select
from sqlalchemy.orm import Session, relationship

from src.database import Base


class Employee(Base):
    __tablename__ = "employee"

    id = Column(String, primary_key=True, default=str(uuid.uuid4))
    name = Column(String, nullable=False)
    surname = Column(String, nullable=False)
    position = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False)
    start_date = Column(DateTime(timezone=True), nullable=True)
    end_date = Column(DateTime(timezone=True), nullable=True)
    team_id = Column(String, ForeignKey("team.id"), nullable=False)

    team = relationship("Team", foreign_keys=[team_id])
    #team = relationship("Team", back_populates="employees", foreign_keys=[team_id])


class EmployeeService:
    def __init__(self, session: Session):
        self.model = Employee
        self.session = session

    def create(self, **values):
        created_at = datetime.now(timezone.utc)
        employee = self.model(created_at=created_at, **values)
        self.session.add(employee)
        self.session.commit()
        self.session.refresh(employee)
        return employee

    def read(self, employee_id):
        query = f"SELECT * FROM {self.model.__tablename__} WHERE id = '{employee_id}';"
        return self.session.execute(text(query)).fetchone()

    def read_all(self):
        return self.session.query(self.model).all()

    def read_all_by_team_id(self, team_id):
        # Returns ORM objects instead of raw db tuples
        return self.session.scalars(select(self.model).where(self.model.team_id == team_id)).all()

    def update(self):
        pass

    def delete(self):
        pass
