import uuid

from sqlalchemy import Column, String, ForeignKey, text, select
from sqlalchemy.orm import Session, relationship

from src.database import Base


class Team(Base):
    __tablename__ = "team"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    parent_team_id = Column(String, ForeignKey("team.id"), nullable=True)
    parent_team = relationship("Team", remote_side=[id], back_populates="child_teams")
    child_teams = relationship("Team", back_populates="parent_team", cascade="all, delete-orphan")


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
        return self.session.scalars(select(self.model)).all()

    def read_all_with_children_and_employees(self, employee_service):
        teams = self.read_all()
        employees = employee_service.read_all()

        team_map = {team.id: team for team in teams}

        for team in teams:
            team.child_teams = []
            team.employees = []

        for employee in employees:
            team = team_map.get(employee.team_id)
            if team:
                team.employees.append(employee)

        root_teams = []
        # Creating tree structure in teams
        for team in teams:
            if team.parent_team_id:
                parent = team_map.get(team.parent_team_id)
                if parent:
                    parent.child_teams.append(team)
            else:
                root_teams.append(team)

        return root_teams

    def update(self):
        pass

    def get_team_by_id(self, team_id: str) -> Team | None:
        return self.session.get(Team, team_id)

    def delete(self, team: Team):
        self.session.delete(team)
        self.session.commit()
