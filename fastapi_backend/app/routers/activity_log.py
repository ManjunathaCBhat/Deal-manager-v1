from fastapi import APIRouter
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from app.models.activity_log import ActivityLog

router = APIRouter(prefix="/activity-log", tags=["activity"])


class ActivityLogResponse(BaseModel):
    id: str
    action: str
    entity_type: str
    entity_id: Optional[str]
    details: Optional[str]
    user_id: Optional[str]
    timestamp: datetime


@router.get("/", response_model=List[ActivityLogResponse])
async def list_activity_logs(limit: int = 50):
    """Get recent activity logs."""
    logs = await ActivityLog.find_all().sort(-ActivityLog.timestamp).limit(limit).to_list()
    
    return [
        ActivityLogResponse(
            id=str(log.id),
            action=log.action,
            entity_type=log.entity_type,
            entity_id=str(log.entity_id) if log.entity_id else None,
            details=log.details,
            user_id=str(log.user_id) if log.user_id else None,
            timestamp=log.timestamp,
        )
        for log in logs
    ]
