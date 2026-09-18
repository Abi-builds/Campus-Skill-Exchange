from datetime import datetime, timezone
from sqlalchemy import String, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    department: Mapped[str] = mapped_column(String(50))
    year: Mapped[int] = mapped_column()
    bio: Mapped[str] = mapped_column(Text, default="")
    profile_image: Mapped[str] = mapped_column(String(500), default="")
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    user_skills = relationship("UserSkill", back_populates="user", cascade="all, delete-orphan")
    sent_requests = relationship(
        "ExchangeRequest", foreign_keys="ExchangeRequest.sender_id", back_populates="sender"
    )
    received_requests = relationship(
        "ExchangeRequest", foreign_keys="ExchangeRequest.receiver_id", back_populates="receiver"
    )
    teacher_sessions = relationship(
        "Session", foreign_keys="Session.teacher_id", back_populates="teacher"
    )
    learner_sessions = relationship(
        "Session", foreign_keys="Session.learner_id", back_populates="learner"
    )
    reviews_given = relationship(
        "Review", foreign_keys="Review.reviewer_id", back_populates="reviewer"
    )
    reviews_received = relationship(
        "Review", foreign_keys="Review.reviewed_user_id", back_populates="reviewed_user"
    )
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
