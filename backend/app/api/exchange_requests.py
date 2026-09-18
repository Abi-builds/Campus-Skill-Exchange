from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.engine import get_db
from app.api.auth import get_current_user_id
from app.schemas.exchange import ExchangeRequestCreate, ExchangeRequestResponse
from app.services.exchange_service import ExchangeService

router = APIRouter(prefix="/api/exchange-requests", tags=["exchange_requests"])


@router.post("")
def send_request(
    req: ExchangeRequestCreate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    service = ExchangeService(db)
    er = service.send_request(user_id, req.receiver_id, req.message)
    return ExchangeRequestResponse.from_orm_model(er)


@router.get("")
def get_requests(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    service = ExchangeService(db)
    return [ExchangeRequestResponse.from_orm_model(er) for er in service.get_user_requests(user_id)]


@router.patch("/{request_id}/accept")
def accept_request(request_id: int, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    service = ExchangeService(db)
    return ExchangeRequestResponse.from_orm_model(service.accept_request(request_id, user_id))


@router.patch("/{request_id}/reject")
def reject_request(request_id: int, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    service = ExchangeService(db)
    return ExchangeRequestResponse.from_orm_model(service.reject_request(request_id, user_id))


@router.patch("/{request_id}/cancel")
def cancel_request(request_id: int, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    service = ExchangeService(db)
    return ExchangeRequestResponse.from_orm_model(service.cancel_request(request_id, user_id))
