from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.skill import Skill
from app.models.user_skill import UserSkill, SkillType, ProficiencyLevel
from app.repositories.skill_repo import SkillRepository
from app.repositories.user_skill_repo import UserSkillRepository


class SkillService:
    def __init__(self, db: Session):
        self.skill_repo = SkillRepository(db)
        self.user_skill_repo = UserSkillRepository(db)

    def list_skills(self) -> list[Skill]:
        return self.skill_repo.list_all()

    def search_skills(self, query: str) -> list[Skill]:
        return self.skill_repo.search(query)

    def add_user_skill(self, user_id: int, skill_id: int, skill_type: str, proficiency_level: str) -> UserSkill:
        skill = self.skill_repo.get_by_id(skill_id)
        if not skill:
            raise HTTPException(status_code=404, detail="Skill not found")
        existing = self.user_skill_repo.get_by_user_and_skill(user_id, skill_id, skill_type)
        if existing:
            raise HTTPException(status_code=400, detail="Skill already added with this type")
        user_skill = UserSkill(
            user_id=user_id,
            skill_id=skill_id,
            skill_type=SkillType(skill_type),
            proficiency_level=ProficiencyLevel(proficiency_level),
        )
        return self.user_skill_repo.create(user_skill)

    def remove_user_skill(self, user_id: int, user_skill_id: int) -> None:
        user_skills = self.user_skill_repo.get_by_user(user_id)
        target = next((us for us in user_skills if us.id == user_skill_id), None)
        if not target:
            raise HTTPException(status_code=404, detail="User skill not found")
        self.user_skill_repo.delete(user_skill_id)

    def get_user_skills(self, user_id: int) -> list[UserSkill]:
        return self.user_skill_repo.get_by_user(user_id)
