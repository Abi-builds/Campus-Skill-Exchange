import enum
from sqlalchemy import String, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class SkillType(str, enum.Enum):
    TEACH = "TEACH"
    LEARN = "LEARN"


class ProficiencyLevel(str, enum.Enum):
    BEGINNER = "BEGINNER"
    INTERMEDIATE = "INTERMEDIATE"
    ADVANCED = "ADVANCED"
    EXPERT = "EXPERT"


class UserSkill(Base):
    __tablename__ = "user_skills"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    skill_id: Mapped[int] = mapped_column(ForeignKey("skills.id", ondelete="CASCADE"))
    skill_type: Mapped[SkillType] = mapped_column(Enum(SkillType))
    proficiency_level: Mapped[ProficiencyLevel] = mapped_column(Enum(ProficiencyLevel))

    user = relationship("User", back_populates="user_skills")
    skill = relationship("Skill", back_populates="user_skills")
