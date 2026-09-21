from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.engine import get_db
from app.api.auth import get_current_user_id
from app.services.matching_service import MatchingService
from app.schemas.auth import UserResponse

router = APIRouter(prefix="/api/matches", tags=["matches"])


@router.get("")
def get_matches(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    service = MatchingService(db)
    matches = service.find_matches(user_id)
    return [
        {
            "user": {
                "id": m["user"].id,
                "name": m["user"].name,
                "department": m["user"].department,
                "year": m["user"].year,
            },
            "score": m["score"],
            "reasons": m["reasons"],
            "has_pending_request": m["has_pending_request"],
        }
        for m in matches
    ]
