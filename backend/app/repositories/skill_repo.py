from sqlalchemy.orm import Session
from app.models.skill import Skill


class SkillRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, skill_id: int) -> Skill | None:
        return self.db.query(Skill).filter(Skill.id == skill_id).first()

    def get_by_name(self, name: str) -> Skill | None:
        return self.db.query(Skill).filter(Skill.name == name).first()

    def create(self, skill: Skill) -> Skill:
        self.db.add(skill)
        self.db.commit()
        self.db.refresh(skill)
        return skill

    def list_all(self) -> list[Skill]:
        return self.db.query(Skill).all()

    def search(self, query: str) -> list[Skill]:
        return self.db.query(Skill).filter(Skill.name.ilike(f"%{query}%")).all()
