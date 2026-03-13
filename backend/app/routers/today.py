from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from ..database import get_db
from ..auth import get_current_user
from ..models import User, Deal, Contact, Meeting
from ..schemas import TodayViewResponse
from ..services.demo_service import get_demo_today_data

router = APIRouter()


@router.get("/", response_model=TodayViewResponse)
async def get_today_view(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.is_demo_user:
        return get_demo_today_data()

    now = datetime.utcnow()

    # Follow-ups: deals with silence > 5 days, not cold
    followups = []
    deals = db.query(Deal).filter(
        Deal.user_id == current_user.id,
        Deal.silence_days >= 5,
        Deal.warmth.in_(["Hot", "Warm"])
    ).order_by(Deal.silence_days.desc()).limit(10).all()

    for deal in deals:
        contact = deal.contact
        followups.append({
            "id": deal.id,
            "contact_name": contact.name if contact else "Unknown",
            "company": contact.company if contact else "",
            "warmth": deal.warmth,
            "silence_days": deal.silence_days,
            "last_activity": deal.last_activity or now,
            "suggestion": f"Follow up with {contact.name if contact else 'contact'} — {deal.silence_days} days of silence.",
            "thread_count": 0,
            "is_inferred": deal.is_inferred,
            "confidence": deal.confidence,
            "contact_id": deal.contact_id or deal.id,
        })

    # Upcoming meetings (next 24h)
    upcoming_meetings = db.query(Meeting).filter(
        Meeting.user_id == current_user.id,
        Meeting.start_time >= now,
        Meeting.start_time <= now + timedelta(hours=24)
    ).order_by(Meeting.start_time).all()

    upcoming = [
        {
            "id": m.id,
            "title": m.title,
            "company": "",
            "start_time": m.start_time,
            "duration_mins": m.duration_mins or 30,
            "prep_note": None,
        }
        for m in upcoming_meetings
    ]

    # Off track: silence > 14 days
    offtrack_deals = db.query(Deal).filter(
        Deal.user_id == current_user.id,
        Deal.silence_days >= 14,
    ).order_by(Deal.silence_days.desc()).limit(5).all()

    offtrack = [
        {
            "id": d.id,
            "contact_name": d.contact.name if d.contact else "Unknown",
            "company": d.contact.company if d.contact else "",
            "warmth": d.warmth,
            "silence_days": d.silence_days,
            "last_activity": d.last_activity or now,
            "stage": d.stage,
            "risk": f"No activity in {d.silence_days} days — deal at risk.",
        }
        for d in offtrack_deals
    ]

    return {
        "followups": followups,
        "drafts": [],
        "upcoming": upcoming,
        "offtrack": offtrack,
    }
