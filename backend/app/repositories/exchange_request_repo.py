from sqlalchemy.orm import Session
from app.models.exchange_request import ExchangeRequest, RequestStatus
from app.models.user_skill import UserSkill, SkillType


class ExchangeRequestRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, exchange_request: ExchangeRequest) -> ExchangeRequest:
        self.db.add(exchange_request)
        self.db.commit()
        self.db.refresh(exchange_request)
        return exchange_request

    def get_by_id(self, request_id: int) -> ExchangeRequest | None:
        return self.db.query(ExchangeRequest).filter(ExchangeRequest.id == request_id).first()

    def get_pending_between(self, sender_id: int, receiver_id: int) -> ExchangeRequest | None:
        return (
            self.db.query(ExchangeRequest)
            .filter(
                ExchangeRequest.sender_id == sender_id,
                ExchangeRequest.receiver_id == receiver_id,
                ExchangeRequest.status == RequestStatus.PENDING,
            )
            .first()
        )

    def get_user_requests(self, user_id: int) -> list[ExchangeRequest]:
        return (
            self.db.query(ExchangeRequest)
            .filter(
                (ExchangeRequest.sender_id == user_id) | (ExchangeRequest.receiver_id == user_id)
            )
            .order_by(ExchangeRequest.created_at.desc())
            .all()
        )

    def update(self, exchange_request: ExchangeRequest) -> ExchangeRequest:
        self.db.commit()
        self.db.refresh(exchange_request)
        return exchange_request
