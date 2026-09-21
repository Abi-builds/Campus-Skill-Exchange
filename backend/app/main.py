import time
import uuid
import logging
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path

from app.core.config import settings
from app.db.engine import engine
from app.db.base import Base
from app.logging.config import setup_logging
from app.models import User, Skill, UserSkill, ExchangeRequest, Session, Review, Notification, Message
from app.api.auth import router as auth_router
from app.api.skills import router as skills_router
from app.api.users import router as users_router
from app.api.matches import router as matches_router
from app.api.exchange_requests import router as exchange_router
from app.api.sessions import router as sessions_router
from app.api.reviews import router as reviews_router
from app.api.notifications import router as notifications_router
from app.api.messages import router as messages_router

setup_logging()
logger = logging.getLogger(__name__)

app = FastAPI(title=settings.APP_NAME, environment=settings.ENVIRONMENT)
app.include_router(auth_router)
app.include_router(skills_router)
app.include_router(users_router)
app.include_router(matches_router)
app.include_router(exchange_router)
app.include_router(sessions_router)
app.include_router(reviews_router)
app.include_router(notifications_router)
app.include_router(messages_router)


@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    request_id = str(uuid.uuid4())
    start = time.time()
    response = await call_next(request)
    duration_ms = round((time.time() - start) * 1000, 2)
    logger.info(
        "request_completed",
        extra={
            "request_id": request_id,
            "method": request.method,
            "path": request.url.path,
            "status_code": response.status_code,
            "duration_ms": duration_ms,
        },
    )
    return response


@app.get("/health")
def health_check():
    return {"status": "healthy", "app": settings.APP_NAME, "environment": settings.ENVIRONMENT}


frontend_dir = Path(__file__).resolve().parent.parent.parent / "frontend"
app.mount("/css", StaticFiles(directory=str(frontend_dir / "css")), name="css")
app.mount("/js", StaticFiles(directory=str(frontend_dir / "js")), name="js")


@app.get("/")
@app.get("/{full_path:path}")
def serve_frontend(full_path: str = ""):
    file_path = frontend_dir / full_path
    if file_path.is_file():
        return FileResponse(str(file_path))
    return FileResponse(str(frontend_dir / "index.html"))


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    logger.info("application_started", extra={"event": "startup"})
