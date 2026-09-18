from sqlalchemy.orm import Session
from app.models.user_skill import UserSkill


class UserSkillRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, user_skill: UserSkill) -> UserSkill:
        self.db.add(user_skill)
        self.db.commit()
        self.db.refresh(user_skill)
        return user_skill

    def delete(self, user_skill_id: int) -> None:
        self.db.query(UserSkill).filter(UserSkill.id == user_skill_id).delete()
        self.db.commit()

    def get_by_user(self, user_id: int) -> list[UserSkill]:
        return self.db.query(UserSkill).filter(UserSkill.user_id == user_id).all()

    def get_by_user_and_skill(self, user_id: int, skill_id: int, skill_type: str) -> UserSkill | None:
        return (
            self.db.query(UserSkill)
            .filter(
                UserSkill.user_id == user_id,
                UserSkill.skill_id == skill_id,
                UserSkill.skill_type == skill_type,
            )
            .first()
        )
