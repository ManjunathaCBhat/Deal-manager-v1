from beanie import Document, PydanticObjectId
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum


class ActionType(str, Enum):
    create = "Create"
    edit = "Edit"
    delete = "Delete"


class ActivityLog(Document):
    user_id: PydanticObjectId
    user_name: str
    user_avatar: Optional[str] = None
    action_type: str
    object_repr: str
    model: str
    action_time: datetime = datetime.utcnow()

    class Settings:
        name = "activity_logs"


class ActivityLogResponse(BaseModel):
    id: str
    user: str
    user_avatar: str
    action_type: str
    object_repr: str
    model: str
    action_time: str

    class Config:
        from_attributes = True
