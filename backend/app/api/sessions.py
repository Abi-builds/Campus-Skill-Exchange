from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from app.db.engine import get_db
from app.api.auth import get_current_user_id
from app.schemas.session import SessionCreate, SessionResponse
from app.services.session_service import SessionService

router = APIRouter(prefix="/api/sessions", tags=["sessions"])


@router.post("")
def schedule_session(
    req: SessionCreate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    service = SessionService(db)
    scheduled_at = datetime.fromisoformat(req.scheduled_at)
    session = service.schedule_session(
        req.exchange_request_id, user_id, scheduled_at, req.duration_minutes, req.meeting_link
    )
    return SessionResponse.from_orm_model(session)


@router.get("")
def get_sessions(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    service = SessionService(db)
    return [SessionResponse.from_orm_model(s) for s in service.get_user_sessions(user_id)]


@router.patch("/{session_id}/complete")
def complete_session(session_id: int, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    service = SessionService(db)
    return SessionResponse.from_orm_model(service.complete_session(session_id, user_id))


@router.patch("/{session_id}/cancel")
def cancel_session(session_id: int, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    service = SessionService(db)
    return SessionResponse.from_orm_model(service.cancel_session(session_id, user_id))
