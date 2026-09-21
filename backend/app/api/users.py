from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.db.engine import get_db
from app.api.auth import get_current_user_id
from app.schemas.auth import UserResponse
from app.schemas.skill import UserProfileUpdate
from app.services.user_service import UserService

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
def get_me(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    service = UserService(db)
    return service.get_user(user_id)


@router.patch("/me", response_model=UserResponse)
def update_me(
    req: UserProfileUpdate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    service = UserService(db)
    return service.update_profile(user_id, req.name, req.bio, req.department, req.year)


@router.get("", response_model=list[UserResponse])
def list_users(db: Session = Depends(get_db)):
    service = UserService(db)
    return service.list_users()


@router.get("/search", response_model=list[UserResponse])
def search_users(
    name: Optional[str] = Query(None),
    department: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    service = UserService(db)
    return service.search_users(name, department, year)


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    service = UserService(db)
    return service.get_user(user_id)
