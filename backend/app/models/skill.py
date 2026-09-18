from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    category: Mapped[str] = mapped_column(String(50))
    description: Mapped[str] = mapped_column(Text, default="")

    user_skills = relationship("UserSkill", back_populates="skill", cascade="all, delete-orphan")
