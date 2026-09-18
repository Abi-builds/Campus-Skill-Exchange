from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.engine import get_db
from app.api.auth import get_current_user_id
from app.schemas.message import MessageCreate, MessageResponse
from app.services.message_service import MessageService
from app.repositories.user_repo import UserRepository

router = APIRouter(prefix="/api/messages", tags=["messages"])


@router.post("")
def send_message(
    req: MessageCreate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    service = MessageService(db)
    msg = service.send_message(user_id, req.receiver_id, req.content)
    return MessageResponse.from_orm_model(msg)


@router.get("/conversations")
def get_conversations(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    service = MessageService(db)
    user_repo = UserRepository(db)
    conversations = service.get_user_conversations(user_id)
    result = []
    for conv in conversations:
        user = user_repo.get_by_id(conv["other_user_id"])
        if user:
            last = service.repo.get_last_message(user_id, user.id)
            result.append({
                "user": {"id": user.id, "name": user.name},
                "last_message": last.content if last else "",
                "last_message_at": str(last.created_at) if last else "",
            })
    return result


@router.get("/conversation/{other_user_id}")
def get_conversation(
    other_user_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    service = MessageService(db)
    return [MessageResponse.from_orm_model(m) for m in service.get_conversation(user_id, other_user_id)]
