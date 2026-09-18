import enum
from datetime import datetime, timezone
from sqlalchemy import String, ForeignKey, DateTime, Integer, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class SessionStatus(str, enum.Enum):
    SCHEDULED = "SCHEDULED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class Session(Base):
    __tablename__ = "sessions"

    id: Mapped[int] = mapped_column(primary_key=True)
    exchange_request_id: Mapped[int] = mapped_column(
        ForeignKey("exchange_requests.id", ondelete="CASCADE")
    )
    teacher_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    learner_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    skill_id: Mapped[int] = mapped_column(ForeignKey("skills.id", ondelete="CASCADE"))
    scheduled_at: Mapped[datetime] = mapped_column(DateTime)
    duration_minutes: Mapped[int] = mapped_column(Integer, default=60)
    meeting_link: Mapped[str] = mapped_column(String(500), default="")
    status: Mapped[SessionStatus] = mapped_column(
        Enum(SessionStatus), default=SessionStatus.SCHEDULED
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )

    exchange_request = relationship("ExchangeRequest", back_populates="sessions")
    teacher = relationship("User", foreign_keys=[teacher_id], back_populates="teacher_sessions")
    learner = relationship("User", foreign_keys=[learner_id], back_populates="learner_sessions")
    skill = relationship("Skill")
    reviews = relationship("Review", back_populates="session", cascade="all, delete-orphan")
