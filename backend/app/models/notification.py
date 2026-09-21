import enum
from datetime import datetime, timezone
from sqlalchemy import String, Text, ForeignKey, DateTime, Boolean, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class NotificationType(str, enum.Enum):
    EXCHANGE_REQUEST = "EXCHANGE_REQUEST"
    REQUEST_ACCEPTED = "REQUEST_ACCEPTED"
    REQUEST_REJECTED = "REQUEST_REJECTED"
    SESSION_SCHEDULED = "SESSION_SCHEDULED"
    SESSION_COMPLETED = "SESSION_COMPLETED"
    SESSION_CANCELLED = "SESSION_CANCELLED"
    NEW_REVIEW = "NEW_REVIEW"
    NEW_MESSAGE = "NEW_MESSAGE"


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    type: Mapped[NotificationType] = mapped_column(Enum(NotificationType))
    title: Mapped[str] = mapped_column(String(200))
    message: Mapped[str] = mapped_column(Text)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )

    user = relationship("User", back_populates="notifications")
