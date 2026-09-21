from pydantic import BaseModel
from typing import Optional


class SkillResponse(BaseModel):
    id: int
    name: str
    category: str
    description: str

    model_config = {"from_attributes": True}


class UserSkillCreate(BaseModel):
    skill_id: int
    skill_type: str
    proficiency_level: str


class UserSkillResponse(BaseModel):
    id: int
    skill_id: int
    skill_name: str
    skill_type: str
    proficiency_level: str

    model_config = {"from_attributes": True}


class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    department: Optional[str] = None
    year: Optional[int] = None
