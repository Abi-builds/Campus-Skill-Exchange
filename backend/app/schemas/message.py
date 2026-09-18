from pydantic import BaseModel


class MessageCreate(BaseModel):
    receiver_id: int
    content: str


class MessageResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    content: str
    is_read: bool
    created_at: str

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm_model(cls, obj):
        return cls(
            id=obj.id,
            sender_id=obj.sender_id,
            receiver_id=obj.receiver_id,
            content=obj.content,
            is_read=obj.is_read,
            created_at=str(obj.created_at),
        )
