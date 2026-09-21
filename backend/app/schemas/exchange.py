from pydantic import BaseModel


class ExchangeRequestCreate(BaseModel):
    receiver_id: int
    message: str = ""


class ExchangeRequestResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    message: str
    status: str
    created_at: str

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm_model(cls, obj):
        return cls(
            id=obj.id,
            sender_id=obj.sender_id,
            receiver_id=obj.receiver_id,
            message=obj.message,
            status=obj.status.value if hasattr(obj.status, 'value') else obj.status,
            created_at=str(obj.created_at),
        )
