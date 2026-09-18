from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.user import User
from app.repositories.user_repo import UserRepository
from app.core.security import hash_password, verify_password, create_access_token


class AuthService:
    def __init__(self, db: Session):
        self.repo = UserRepository(db)

    def register(self, name: str, email: str, password: str, department: str, year: int) -> dict:
        existing = self.repo.get_by_email(email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )
        user = User(
            name=name,
            email=email,
            password_hash=hash_password(password),
            department=department,
            year=year,
        )
        self.repo.create(user)
        token = create_access_token({"sub": str(user.id), "email": user.email})
        return {"access_token": token, "user": user}

    def login(self, email: str, password: str) -> dict:
        user = self.repo.get_by_email(email)
        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )
        token = create_access_token({"sub": str(user.id), "email": user.email})
        return {"access_token": token, "user": user}

    def get_current_user(self, user_id: int) -> User:
        user = self.repo.get_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        return user
