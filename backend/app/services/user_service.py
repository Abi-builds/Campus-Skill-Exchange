from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.user import User
from app.repositories.user_repo import UserRepository


class UserService:
    def __init__(self, db: Session):
        self.repo = UserRepository(db)

    def get_user(self, user_id: int) -> User:
        user = self.repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user

    def update_profile(self, user_id: int, name: str = None, bio: str = None, department: str = None, year: int = None) -> User:
        user = self.repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        if name is not None:
            user.name = name
        if bio is not None:
            user.bio = bio
        if department is not None:
            user.department = department
        if year is not None:
            user.year = year
        return self.repo.update(user)

    def list_users(self) -> list[User]:
        return self.repo.list_all()

    def search_users(self, name: str = None, department: str = None, year: int = None) -> list[User]:
        query = self.repo.db.query(User)
        if name:
            query = query.filter(User.name.ilike(f"%{name}%"))
        if department:
            query = query.filter(User.department == department)
        if year:
            query = query.filter(User.year == year)
        return query.all()
