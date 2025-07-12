import uuid

from sqlalchemy import Column, String, ForeignKey, text
from sqlalchemy.orm import Session, relationship, selectinload, select

from src.database import Base


class Team(Base):
    __tablename__ = "team"

    id = Column(String, primary_key=True, default=str(uuid.uuid4))
    name = Column(String, nullable=False)
    parent_team_id = Column(String, ForeignKey("team.id"), nullable=True)
    parent_team = relationship("Team", foreign_keys=[parent_team_id])
    # parent_team = relationship("Team", remote_side=[id], back_populates="child_teams")
    # child_teams = relationship("Team", back_populates="parent_team", cascade="all, delete-orphan")
    # employees = relationship("Employee", back_populates="team")


class TeamService:
    def __init__(self, session: Session):
        self.model = Team
        self.session = session

    def create(self, **values):
        team = self.model(**values)
        self.session.add(team)
        self.session.commit()
        self.session.refresh(team)
        return team

    def read(self, team_id):
        query = f"SELECT * FROM {self.model.__tablename__} WHERE id = '{team_id}';"
        return self.session.execute(text(query)).fetchone()

    def read_all(self):
        # query = f"SELECT * FROM {self.model.__tablename__}"
        # return self.session.execute(text(query)).fetchall()
        return self.session.query(self.model).all()

    def read_all_with_children_and_employees(self):
        getChildrenAndEmployees = (
            select(self.model)
            .options(
                # Eager loads
                selectinload(self.model.child_teams),
                selectinload(self.model.employees)
            )
            .where(self.model.parent_team_id == None)
        )
        return self.session.scalars(getChildrenAndEmployees).all()

    def update(self):
        pass

    def delete(self):
        pass
