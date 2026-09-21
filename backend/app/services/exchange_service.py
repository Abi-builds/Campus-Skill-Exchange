from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.exchange_request import ExchangeRequest, RequestStatus
from app.models.notification import Notification, NotificationType
from app.repositories.exchange_request_repo import ExchangeRequestRepository
from app.repositories.user_repo import UserRepository
from app.repositories.notification_repo import NotificationRepository


class ExchangeService:
    def __init__(self, db: Session):
        self.repo = ExchangeRequestRepository(db)
        self.user_repo = UserRepository(db)
        self.notif_repo = NotificationRepository(db)

    def send_request(self, sender_id: int, receiver_id: int, message: str = "") -> ExchangeRequest:
        if sender_id == receiver_id:
            raise HTTPException(status_code=400, detail="Cannot send request to yourself")
        receiver = self.user_repo.get_by_id(receiver_id)
        if not receiver:
            raise HTTPException(status_code=404, detail="Receiver not found")
        existing = self.repo.get_pending_between(sender_id, receiver_id)
        if existing:
            raise HTTPException(status_code=400, detail="Pending request already exists")
        reverse = self.repo.get_pending_between(receiver_id, sender_id)
        if reverse:
            raise HTTPException(status_code=400, detail="They already sent you a request")
        er = ExchangeRequest(sender_id=sender_id, receiver_id=receiver_id, message=message)
        created = self.repo.create(er)
        sender = self.user_repo.get_by_id(sender_id)
        self.notif_repo.create(Notification(
            user_id=receiver_id,
            type=NotificationType.EXCHANGE_REQUEST,
            title="New Exchange Request",
            message=f"{sender.name} wants to exchange skills with you",
        ))
        return created

    def accept_request(self, request_id: int, user_id: int) -> ExchangeRequest:
        er = self.repo.get_by_id(request_id)
        if not er:
            raise HTTPException(status_code=404, detail="Request not found")
        if er.receiver_id != user_id:
            raise HTTPException(status_code=403, detail="Only receiver can accept")
        if er.status != RequestStatus.PENDING:
            raise HTTPException(status_code=400, detail="Request is not pending")
        er.status = RequestStatus.ACCEPTED
        updated = self.repo.update(er)
        sender = self.user_repo.get_by_id(er.sender_id)
        self.notif_repo.create(Notification(
            user_id=er.sender_id,
            type=NotificationType.REQUEST_ACCEPTED,
            title="Request Accepted",
            message=f"{sender.name} accepted your exchange request",
        ))
        return updated

    def reject_request(self, request_id: int, user_id: int) -> ExchangeRequest:
        er = self.repo.get_by_id(request_id)
        if not er:
            raise HTTPException(status_code=404, detail="Request not found")
        if er.receiver_id != user_id:
            raise HTTPException(status_code=403, detail="Only receiver can reject")
        if er.status != RequestStatus.PENDING:
            raise HTTPException(status_code=400, detail="Request is not pending")
        er.status = RequestStatus.REJECTED
        updated = self.repo.update(er)
        sender = self.user_repo.get_by_id(er.sender_id)
        self.notif_repo.create(Notification(
            user_id=er.sender_id,
            type=NotificationType.REQUEST_REJECTED,
            title="Request Rejected",
            message=f"{sender.name} rejected your exchange request",
        ))
        return updated

    def cancel_request(self, request_id: int, user_id: int) -> ExchangeRequest:
        er = self.repo.get_by_id(request_id)
        if not er:
            raise HTTPException(status_code=404, detail="Request not found")
        if er.sender_id != user_id:
            raise HTTPException(status_code=403, detail="Only sender can cancel")
        if er.status != RequestStatus.PENDING:
            raise HTTPException(status_code=400, detail="Request is not pending")
        er.status = RequestStatus.CANCELLED
        return self.repo.update(er)

    def get_user_requests(self, user_id: int) -> list[ExchangeRequest]:
        return self.repo.get_user_requests(user_id)
