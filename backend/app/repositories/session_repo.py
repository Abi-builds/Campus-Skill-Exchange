from sqlalchemy.orm import Session
from app.models.session import Session as SessionModel, SessionStatus


class SessionRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, session: SessionModel) -> SessionModel:
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)
        return session

    def get_by_id(self, session_id: int) -> SessionModel | None:
        return self.db.query(SessionModel).filter(SessionModel.id == session_id).first()

    def get_user_sessions(self, user_id: int) -> list[SessionModel]:
        return (
            self.db.query(SessionModel)
            .filter(
                (SessionModel.teacher_id == user_id) | (SessionModel.learner_id == user_id)
            )
            .order_by(SessionModel.scheduled_at.desc())
            .all()
        )

    def update(self, session: SessionModel) -> SessionModel:
        self.db.commit()
        self.db.refresh(session)
        return session
