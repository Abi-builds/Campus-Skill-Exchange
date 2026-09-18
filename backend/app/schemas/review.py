from pydantic import BaseModel


class ReviewCreate(BaseModel):
    session_id: int
    reviewed_user_id: int
    rating: int
    comment: str = ""


class ReviewResponse(BaseModel):
    id: int
    session_id: int
    reviewer_id: int
    reviewed_user_id: int
    rating: int
    comment: str
    created_at: str

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm_model(cls, obj):
        return cls(
            id=obj.id,
            session_id=obj.session_id,
            reviewer_id=obj.reviewer_id,
            reviewed_user_id=obj.reviewed_user_id,
            rating=obj.rating,
            comment=obj.comment,
            created_at=str(obj.created_at),
        )
