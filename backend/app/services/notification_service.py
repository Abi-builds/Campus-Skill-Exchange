from sqlalchemy.orm import Session
from app.repositories.notification_repo import NotificationRepository


class NotificationService:
    def __init__(self, db: Session):
        self.repo = NotificationRepository(db)

    def get_user_notifications(self, user_id: int):
        return self.repo.get_user_notifications(user_id)

    def get_unread_count(self, user_id: int) -> int:
        return self.repo.get_unread_count(user_id)

    def mark_read(self, notification_id: int, user_id: int) -> None:
        self.repo.mark_read(notification_id, user_id)
