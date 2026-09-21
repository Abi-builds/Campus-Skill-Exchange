from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.engine import get_db
from app.api.auth import get_current_user_id
from app.schemas.review import ReviewCreate, ReviewResponse
from app.services.review_service import ReviewService

router = APIRouter(prefix="/api/reviews", tags=["reviews"])


@router.post("")
def create_review(
    req: ReviewCreate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    service = ReviewService(db)
    review = service.create_review(req.session_id, user_id, req.reviewed_user_id, req.rating, req.comment)
    return ReviewResponse.from_orm_model(review)


@router.get("/user/{user_id}")
def get_user_reviews(user_id: int, db: Session = Depends(get_db)):
    service = ReviewService(db)
    return [ReviewResponse.from_orm_model(r) for r in service.get_user_reviews(user_id)]
