from sqlalchemy.orm import Session
from app.models.review import Review


class ReviewRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, review: Review) -> Review:
        self.db.add(review)
        self.db.commit()
        self.db.refresh(review)
        return review

    def get_by_session_and_reviewer(self, session_id: int, reviewer_id: int) -> Review | None:
        return (
            self.db.query(Review)
            .filter(Review.session_id == session_id, Review.reviewer_id == reviewer_id)
            .first()
        )

    def get_user_reviews(self, user_id: int) -> list[Review]:
        return (
            self.db.query(Review)
            .filter(Review.reviewed_user_id == user_id)
            .order_by(Review.created_at.desc())
            .all()
        )
