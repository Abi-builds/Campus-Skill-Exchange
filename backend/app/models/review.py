from sqlalchemy import Column, Integer, Text, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship

from app.db.base import Base


class Review(Base):
    __tablename__ = "reviews"

    review_id = Column(Integer, primary_key=True, index=True)

    session_id = Column(
        Integer,
        ForeignKey("sessions.id", ondelete="CASCADE"),
        nullable=False
    )

    reviewer_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    reviewed_user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    rating = Column(Integer, nullable=False)

    comment = Column(Text, nullable=True)

    # Relationship with Session
    session = relationship(
        "Session",
        back_populates="reviews"
    )

    # Relationship with User who gave the review
    reviewer = relationship(
        "User",
        foreign_keys=[reviewer_id],
        back_populates="reviews_given"
    )

    # Relationship with User who received the review
    reviewed_user = relationship(
        "User",
        foreign_keys=[reviewed_user_id],
        back_populates="reviews_received"
    )

    __table_args__ = (
        CheckConstraint(
            "rating >= 1 AND rating <= 5",
            name="check_review_rating"
        ),
    )