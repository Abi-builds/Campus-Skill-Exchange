from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.review import Review
from app.models.session import Session as SessionModel, SessionStatus
from app.models.notification import Notification, NotificationType
from app.repositories.review_repo import ReviewRepository
from app.repositories.session_repo import SessionRepository
from app.repositories.notification_repo import NotificationRepository


class ReviewService:
    def __init__(self, db: Session):
        self.repo = ReviewRepository(db)
        self.session_repo = SessionRepository(db)
        self.notif_repo = NotificationRepository(db)

    def create_review(
        self, session_id: int, reviewer_id: int, reviewed_user_id: int, rating: int, comment: str = ""
    ) -> Review:
        if rating < 1 or rating > 5:
            raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
        session = self.session_repo.get_by_id(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        if session.status != SessionStatus.COMPLETED:
            raise HTTPException(status_code=400, detail="Can only review completed sessions")
        if reviewer_id not in (session.teacher_id, session.learner_id):
            raise HTTPException(status_code=403, detail="Not a participant")
        if reviewed_user_id not in (session.teacher_id, session.learner_id):
            raise HTTPException(status_code=403, detail="Reviewed user is not a participant")
        if reviewer_id == reviewed_user_id:
            raise HTTPException(status_code=400, detail="Cannot review yourself")
        existing = self.repo.get_by_session_and_reviewer(session_id, reviewer_id)
        if existing:
            raise HTTPException(status_code=400, detail="Already reviewed this session")
        review = Review(
            session_id=session_id,
            reviewer_id=reviewer_id,
            reviewed_user_id=reviewed_user_id,
            rating=rating,
            comment=comment,
        )
        created = self.repo.create(review)
        self.notif_repo.create(Notification(
            user_id=reviewed_user_id,
            type=NotificationType.NEW_REVIEW,
            title="New Review",
            message=f"You received a {rating}-star review",
        ))
        return created

    def get_user_reviews(self, user_id: int) -> list[Review]:
        return self.repo.get_user_reviews(user_id)
