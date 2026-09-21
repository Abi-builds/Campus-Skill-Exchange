from sqlalchemy.orm import Session
from app.models.message import Message


class MessageRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, message: Message) -> Message:
        self.db.add(message)
        self.db.commit()
        self.db.refresh(message)
        return message

    def get_conversation(self, user1_id: int, user2_id: int) -> list[Message]:
        return (
            self.db.query(Message)
            .filter(
                ((Message.sender_id == user1_id) & (Message.receiver_id == user2_id))
                | ((Message.sender_id == user2_id) & (Message.receiver_id == user1_id))
            )
            .order_by(Message.created_at.asc())
            .all()
        )

    def get_user_conversations(self, user_id: int) -> list[dict]:
        from sqlalchemy import text
        result = self.db.execute(
            text("""
                SELECT DISTINCT
                    CASE WHEN sender_id = :uid THEN receiver_id ELSE sender_id END as other_user_id,
                    MAX(created_at) as last_message_at
                FROM messages
                WHERE sender_id = :uid OR receiver_id = :uid
                GROUP BY other_user_id
                ORDER BY last_message_at DESC
            """),
            {"uid": user_id},
        )
        return [{"other_user_id": row[0], "last_message_at": row[1]} for row in result]

    def get_last_message(self, user1_id: int, user2_id: int) -> Message | None:
        return (
            self.db.query(Message)
            .filter(
                ((Message.sender_id == user1_id) & (Message.receiver_id == user2_id))
                | ((Message.sender_id == user2_id) & (Message.receiver_id == user1_id))
            )
            .order_by(Message.created_at.desc())
            .first()
        )

    def mark_read(self, sender_id: int, receiver_id: int) -> None:
        self.db.query(Message).filter(
            Message.sender_id == sender_id,
            Message.receiver_id == receiver_id,
            Message.is_read == False,
        ).update({"is_read": True})
        self.db.commit()
