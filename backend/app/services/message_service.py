from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.message import Message
from app.repositories.message_repo import MessageRepository
from app.repositories.user_repo import UserRepository
from app.repositories.notification_repo import NotificationRepository
from app.models.notification import Notification, NotificationType


class MessageService:
    def __init__(self, db: Session):
        self.repo = MessageRepository(db)
        self.user_repo = UserRepository(db)
        self.notif_repo = NotificationRepository(db)

    def send_message(self, sender_id: int, receiver_id: int, content: str) -> Message:
        if sender_id == receiver_id:
            raise HTTPException(status_code=400, detail="Cannot message yourself")
        receiver = self.user_repo.get_by_id(receiver_id)
        if not receiver:
            raise HTTPException(status_code=404, detail="Receiver not found")
        msg = Message(sender_id=sender_id, receiver_id=receiver_id, content=content)
        created = self.repo.create(msg)
        sender = self.user_repo.get_by_id(sender_id)
        self.notif_repo.create(Notification(
            user_id=receiver_id,
            type=NotificationType.NEW_MESSAGE,
            title="New Message",
            message=f"{sender.name} sent you a message",
        ))
        return created

    def get_conversation(self, user1_id: int, user2_id: int) -> list[Message]:
        self.repo.mark_read(user2_id, user1_id)
        return self.repo.get_conversation(user1_id, user2_id)

    def get_user_conversations(self, user_id: int) -> list[dict]:
        return self.repo.get_user_conversations(user_id)

    def get_unread_count(self, user_id: int) -> int:
        conversations = self.repo.get_user_conversations(user_id)
        total = 0
        for conv in conversations:
            last = self.repo.get_last_message(conv["other_user_id"], user_id)
            if last and not last.is_read and last.sender_id != user_id:
                total += 1
        return total
