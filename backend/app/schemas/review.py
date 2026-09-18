from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):
    session_id: int
    reviewed_user_id: int
    rating: int = Field(..., ge=1, le=5)
    comment: str = ""


class ReviewResponse(BaseModel):
    review_id: int
    session_id: int
    reviewer_id: int
    reviewed_user_id: int
    rating: int
    comment: str | None

    class Config:
        from_attributes = True

    @classmethod
    def from_orm_model(cls, review):
        return cls(
            review_id=review.review_id,
            session_id=review.session_id,
            reviewer_id=review.reviewer_id,
            reviewed_user_id=review.reviewed_user_id,
            rating=review.rating,
            comment=review.comment,
        )