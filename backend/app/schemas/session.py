from pydantic import BaseModel


class SessionCreate(BaseModel):
    exchange_request_id: int
    scheduled_at: str
    duration_minutes: int = 60
    meeting_link: str = ""


class SessionResponse(BaseModel):
    id: int
    exchange_request_id: int
    teacher_id: int
    learner_id: int
    skill_id: int
    scheduled_at: str
    duration_minutes: int
    meeting_link: str
    status: str
    created_at: str

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm_model(cls, obj):
        return cls(
            id=obj.id,
            exchange_request_id=obj.exchange_request_id,
            teacher_id=obj.teacher_id,
            learner_id=obj.learner_id,
            skill_id=obj.skill_id,
            scheduled_at=str(obj.scheduled_at),
            duration_minutes=obj.duration_minutes,
            meeting_link=obj.meeting_link,
            status=obj.status.value if hasattr(obj.status, 'value') else obj.status,
            created_at=str(obj.created_at),
        )
