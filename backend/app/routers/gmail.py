from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..auth import get_current_user
from ..models import User, Integration, Email, Contact
from ..schemas import EmailDigestItem
from ..services.gmail_service import fetch_gmail_metadata
from ..services.intelligence_service import calculate_warmth, calculate_confidence
from ..encryption import decrypt_token

router = APIRouter()

_WARMTH_TO_SENTIMENT = {
    "Hot": "positive",
    "Warm": "neutral",
    "Cooling": "negative",
    "Cold": "negative",
}


def _build_signal(warmth: str, silence_days: int, thread_count: int, reply_latency_hours: Optional[float]) -> str:
    if warmth == "Hot":
        latency = f"{reply_latency_hours:.0f}h avg reply" if reply_latency_hours else "fast engagement"
        return f"High velocity — {thread_count} replies, {latency}"
    elif warmth == "Warm":
        return f"Active — {thread_count} replies in thread"
    elif warmth == "Cooling":
        return f"Slowing — {silence_days} day gap since last reply"
    else:
        return f"No reply in {silence_days} days — at risk"


def _build_digest_item(email: Email, contact: Optional[Contact]) -> EmailDigestItem:
    now = datetime.utcnow()
    silence_days = (now - email.timestamp).days if email.timestamp else 0

    warmth = calculate_warmth(
        silence_days=silence_days,
        reply_latency_hours=email.reply_latency_hours,
        thread_count=email.thread_count,
    )
    sentiment = _WARMTH_TO_SENTIMENT[warmth]
    signal = _build_signal(warmth, silence_days, email.thread_count, email.reply_latency_hours)
    confidence = calculate_confidence(
        signal_count=email.thread_count,
        data_sources=["gmail"],
        has_explicit_record=contact is not None,
    )

    return EmailDigestItem(
        id=email.id,
        thread_id=email.thread_id,
        contact_name=contact.name if contact else email.sender,
        company=contact.company if contact else None,
        subject=email.subject,
        thread_count=email.thread_count,
        last_message=email.timestamp,
        reply_latency_hours=email.reply_latency_hours,
        signal=signal,
        sentiment=sentiment,
        is_inferred=True,
        confidence=confidence,
    )


@router.get("/digest", response_model=List[EmailDigestItem])
async def get_email_digest(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return enriched email thread metadata for the digest view"""
    if current_user.is_demo_user:
        from ..services.demo_service import get_demo_email_digest
        return get_demo_email_digest()

    integration = db.query(Integration).filter(
        Integration.user_id == current_user.id,
        Integration.provider == "gmail",
        Integration.is_active == True
    ).first()

    if not integration:
        raise HTTPException(status_code=404, detail="Gmail not connected")

    emails = db.query(Email).filter(
        Email.user_id == current_user.id
    ).order_by(Email.timestamp.desc()).limit(50).all()

    # Build a sender → contact lookup for this user
    contacts = db.query(Contact).filter(Contact.user_id == current_user.id).all()
    contact_by_email = {c.email.lower(): c for c in contacts if c.email}

    return [
        _build_digest_item(email, contact_by_email.get(email.sender.lower()) if email.sender else None)
        for email in emails
    ]


@router.post("/sync")
async def sync_gmail(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Trigger Gmail metadata sync"""
    if current_user.is_demo_user:
        return {"message": "Demo mode — using mock data", "synced": 0}

    integration = db.query(Integration).filter(
        Integration.user_id == current_user.id,
        Integration.provider == "gmail",
        Integration.is_active == True
    ).first()

    if not integration:
        raise HTTPException(status_code=404, detail="Gmail not connected")

    try:
        access_token = decrypt_token(integration.access_token)
        synced = await fetch_gmail_metadata(access_token, current_user.id, db)
        return {"message": "Sync complete", "synced": synced}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sync failed: {str(e)}")
