from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.session import Session as SessionModel, SessionStatus
from app.models.exchange_request import ExchangeRequest, RequestStatus
from app.models.notification import Notification, NotificationType
from app.repositories.session_repo import SessionRepository
from app.repositories.exchange_request_repo import ExchangeRequestRepository
from app.repositories.user_repo import UserRepository
from app.repositories.notification_repo import NotificationRepository


class SessionService:
    def __init__(self, db: Session):
        self.repo = SessionRepository(db)
        self.exchange_repo = ExchangeRequestRepository(db)
        self.user_repo = UserRepository(db)
        self.notif_repo = NotificationRepository(db)

    def schedule_session(
        self, exchange_request_id: int, user_id: int,
        scheduled_at: datetime, duration_minutes: int, meeting_link: str = ""
    ) -> SessionModel:
        er = self.exchange_repo.get_by_id(exchange_request_id)
        if not er:
            raise HTTPException(status_code=404, detail="Exchange request not found")
        if er.status != RequestStatus.ACCEPTED:
            raise HTTPException(status_code=400, detail="Can only schedule from accepted request")
        if user_id not in (er.sender_id, er.receiver_id):
            raise HTTPException(status_code=403, detail="Not a participant")
        existing = self.repo.db.query(SessionModel).filter(
            SessionModel.exchange_request_id == exchange_request_id,
            SessionModel.status == SessionStatus.SCHEDULED,
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Session already scheduled")
        skill_id = self.repo.db.query(ExchangeRequest).filter(ExchangeRequest.id == exchange_request_id).first()
        session = SessionModel(
            exchange_request_id=exchange_request_id,
            teacher_id=er.receiver_id,
            learner_id=er.sender_id,
            skill_id=1,
            scheduled_at=scheduled_at,
            duration_minutes=duration_minutes,
            meeting_link=meeting_link,
        )
        created = self.repo.create(session)
        other_user = er.sender_id if user_id == er.receiver_id else er.receiver_id
        self.notif_repo.create(Notification(
            user_id=other_user,
            type=NotificationType.SESSION_SCHEDULED,
            title="Session Scheduled",
            message=f"A learning session has been scheduled",
        ))
        return created

    def get_user_sessions(self, user_id: int) -> list[SessionModel]:
        return self.repo.get_user_sessions(user_id)

    def complete_session(self, session_id: int, user_id: int) -> SessionModel:
        session = self.repo.get_by_id(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        if user_id not in (session.teacher_id, session.learner_id):
            raise HTTPException(status_code=403, detail="Not a participant")
        if session.status != SessionStatus.SCHEDULED:
            raise HTTPException(status_code=400, detail="Session is not scheduled")
        session.status = SessionStatus.COMPLETED
        updated = self.repo.update(session)
        other_user = session.learner_id if user_id == session.teacher_id else session.teacher_id
        self.notif_repo.create(Notification(
            user_id=other_user,
            type=NotificationType.SESSION_COMPLETED,
            title="Session Completed",
            message="A learning session has been completed. Leave a review!",
        ))
        return updated

    def cancel_session(self, session_id: int, user_id: int) -> SessionModel:
        session = self.repo.get_by_id(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        if user_id not in (session.teacher_id, session.learner_id):
            raise HTTPException(status_code=403, detail="Not a participant")
        if session.status != SessionStatus.SCHEDULED:
            raise HTTPException(status_code=400, detail="Session is not scheduled")
        session.status = SessionStatus.CANCELLED
        return self.repo.update(session)
