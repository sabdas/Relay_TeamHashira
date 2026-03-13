from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..auth import get_current_user
from ..models import User, Integration, Email
from ..schemas import EmailResponse
from ..services.gmail_service import fetch_gmail_metadata
from ..encryption import decrypt_token

router = APIRouter()


@router.get("/digest", response_model=List[EmailResponse])
async def get_email_digest(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return email thread metadata for the digest view"""
    if current_user.is_demo_user:
        from ..services.demo_service import get_demo_email_digest
        return get_demo_email_digest()

    # Get Gmail integration
    integration = db.query(Integration).filter(
        Integration.user_id == current_user.id,
        Integration.provider == "gmail",
        Integration.is_active == True
    ).first()

    if not integration:
        raise HTTPException(status_code=404, detail="Gmail not connected")

    # Fetch stored emails
    emails = db.query(Email).filter(
        Email.user_id == current_user.id
    ).order_by(Email.timestamp.desc()).limit(50).all()

    return emails


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
