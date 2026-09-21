import os
from dataclasses import dataclass


@dataclass
class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./app.db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    APP_NAME: str = "Campus Skill Exchange Platform"


settings = Settings()
