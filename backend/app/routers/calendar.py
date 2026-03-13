from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta

from ..database import get_db
from ..auth import get_current_user
from ..models import User, Integration, Meeting
from ..schemas import MeetingResponse

router = APIRouter()


@router.get("/events", response_model=List[MeetingResponse])
async def get_calendar_events(
    days_ahead: int = 7,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.is_demo_user:
        from ..services.demo_service import get_demo_meetings
        return get_demo_meetings()

    now = datetime.utcnow()
    meetings = db.query(Meeting).filter(
        Meeting.user_id == current_user.id,
        Meeting.start_time >= now,
        Meeting.start_time <= now + timedelta(days=days_ahead)
    ).order_by(Meeting.start_time).all()

    return meetings


@router.post("/sync")
async def sync_calendar(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.is_demo_user:
        return {"message": "Demo mode — using mock data", "synced": 0}

    integration = db.query(Integration).filter(
        Integration.user_id == current_user.id,
        Integration.provider == "google_calendar",
        Integration.is_active == True
    ).first()

    if not integration:
        raise HTTPException(status_code=404, detail="Google Calendar not connected")

    return {"message": "Calendar sync queued", "synced": 0}
