from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.engine import get_db
from app.api.auth import get_current_user_id
from app.schemas.skill import SkillResponse, UserSkillCreate, UserSkillResponse
from app.services.skill_service import SkillService

router = APIRouter(prefix="/api/skills", tags=["skills"])


@router.get("", response_model=list[SkillResponse])
def list_skills(db: Session = Depends(get_db)):
    service = SkillService(db)
    return service.list_skills()


@router.get("/search", response_model=list[SkillResponse])
def search_skills(q: str = "", db: Session = Depends(get_db)):
    service = SkillService(db)
    return service.search_skills(q)


@router.post("", response_model=UserSkillResponse)
def add_user_skill(req: UserSkillCreate, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    service = SkillService(db)
    us = service.add_user_skill(user_id, req.skill_id, req.skill_type, req.proficiency_level)
    return UserSkillResponse(
        id=us.id,
        skill_id=us.skill_id,
        skill_name=us.skill.name,
        skill_type=us.skill_type.value,
        proficiency_level=us.proficiency_level.value,
    )


@router.get("/me", response_model=list[UserSkillResponse])
def get_my_skills(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    service = SkillService(db)
    user_skills = service.get_user_skills(user_id)
    return [
        UserSkillResponse(
            id=us.id,
            skill_id=us.skill_id,
            skill_name=us.skill.name,
            skill_type=us.skill_type.value,
            proficiency_level=us.proficiency_level.value,
        )
        for us in user_skills
    ]


@router.delete("/{user_skill_id}")
def remove_user_skill(user_skill_id: int, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    service = SkillService(db)
    service.remove_user_skill(user_id, user_skill_id)
    return {"detail": "Skill removed"}
