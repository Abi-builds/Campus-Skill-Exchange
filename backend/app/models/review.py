from sqlalchemy import Column, Integer, Text, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship

from app.db.base import Base


class Review(Base):
    __tablename__ = "reviews"

    review_id = Column(Integer, primary_key=True, index=True)

    session_id = Column(
        Integer,
        ForeignKey("sessions.session_id", ondelete="CASCADE"),
        nullable=False
    )

    reviewer_id = Column(
        Integer,
        ForeignKey("profiles.profile_id", ondelete="CASCADE"),
        nullable=False
    )

    reviewed_user_id = Column(
        Integer,
        ForeignKey("profiles.profile_id", ondelete="CASCADE"),
        nullable=False
    )

    rating = Column(Integer, nullable=False)

    comment = Column(Text, nullable=True)

    __table_args__ = (
        CheckConstraint(
            "rating >= 1 AND rating <= 5",
            name="check_review_rating"
        ),
    )