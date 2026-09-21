from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.engine import get_db
from app.api.auth import get_current_user_id
from app.schemas.notification import NotificationResponse
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


@router.get("")
def get_notifications(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    service = NotificationService(db)
    return [NotificationResponse.from_orm_model(n) for n in service.get_user_notifications(user_id)]


@router.get("/unread-count")
def get_unread_count(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    service = NotificationService(db)
    return {"count": service.get_unread_count(user_id)}


@router.patch("/{notification_id}/read")
def mark_read(notification_id: int, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    service = NotificationService(db)
    service.mark_read(notification_id, user_id)
    return {"detail": "Marked as read"}
