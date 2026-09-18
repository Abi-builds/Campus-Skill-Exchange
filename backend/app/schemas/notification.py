from pydantic import BaseModel


class NotificationResponse(BaseModel):
    id: int
    user_id: int
    type: str
    title: str
    message: str
    is_read: bool
    created_at: str

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm_model(cls, obj):
        return cls(
            id=obj.id,
            user_id=obj.user_id,
            type=obj.type.value if hasattr(obj.type, 'value') else obj.type,
            title=obj.title,
            message=obj.message,
            is_read=obj.is_read,
            created_at=str(obj.created_at),
        )
