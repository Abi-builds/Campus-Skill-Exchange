from pydantic import BaseModel, EmailStr
from typing import Optional


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    department: str = "IT"
    year: int = 1


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    department: str
    year: int
    bio: str
    profile_image: str

    model_config = {"from_attributes": True}
