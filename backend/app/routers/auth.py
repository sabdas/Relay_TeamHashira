from datetime import datetime, timedelta

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
import httpx
import re

from ..database import get_db
from ..config import settings
from ..auth import create_access_token
from ..models import User, Integration
from ..encryption import encrypt_token

router = APIRouter()


def make_unique_key(name: str, company: str) -> str:
    """Convert name + company to snake_case unique key"""
    combined = f"{name}_{company}".lower()
    return re.sub(r'[^a-z0-9_]', '_', combined)


@router.get("/google")
async def google_login():
    """Redirect to Google OAuth"""
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile https://www.googleapis.com/auth/gmail.metadata https://www.googleapis.com/auth/calendar.readonly",
        "access_type": "offline",
        "prompt": "consent",
    }
    from urllib.parse import urlencode
    url = f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"
    return RedirectResponse(url)


def _upsert_integration(db: Session, user_id: str, provider: str, access_token: str, refresh_token: str | None, expires_at: datetime | None):
    existing = db.query(Integration).filter(
        Integration.user_id == user_id,
        Integration.provider == provider,
    ).first()
    if existing:
        existing.access_token = encrypt_token(access_token)
        if refresh_token:
            existing.refresh_token = encrypt_token(refresh_token)
        existing.expires_at = expires_at
        existing.is_active = True
    else:
        db.add(Integration(
            user_id=user_id,
            provider=provider,
            access_token=encrypt_token(access_token),
            refresh_token=encrypt_token(refresh_token) if refresh_token else None,
            expires_at=expires_at,
        ))
    db.commit()


async def _background_gmail_sync(user_id: str, access_token: str):
    """Kick off initial Gmail metadata sync after login."""
    import logging
    logger = logging.getLogger(__name__)
    from ..database import SessionLocal
    from ..services.gmail_service import fetch_gmail_metadata
    db = SessionLocal()
    try:
        synced = await fetch_gmail_metadata(access_token, user_id, db)
        logger.info(f"Background Gmail sync complete for user {user_id}: {synced} threads synced")
    except Exception as e:
        logger.error(f"Background Gmail sync failed for user {user_id}: {e}", exc_info=True)
    finally:
        db.close()


@router.get("/google/callback")
async def google_callback(code: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """Handle Google OAuth callback"""
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=400, detail="Google OAuth not configured")

    async with httpx.AsyncClient() as client:
        # Exchange code for tokens
        token_res = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code",
            },
        )
        if token_res.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to exchange code for tokens")

        tokens = token_res.json()

        # Get user info
        user_res = await client.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {tokens['access_token']}"},
        )
        if user_res.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to get user info")

        user_info = user_res.json()

    access_token = tokens["access_token"]
    refresh_token = tokens.get("refresh_token")
    expires_at = datetime.utcnow() + timedelta(seconds=tokens.get("expires_in", 3600))

    # Find or create user
    google_id = user_info.get("sub")
    email = user_info.get("email", "")
    name = user_info.get("name", email.split("@")[0] if email else "User")
    # Extract company from email domain
    company = email.split("@")[1].split(".")[0].title() if email and "@" in email else "My Company"

    user = db.query(User).filter(User.google_id == google_id).first()
    if not user:
        user = db.query(User).filter(User.email == email).first()

    if not user:
        unique_key = make_unique_key(name, company)
        # Ensure uniqueness
        existing = db.query(User).filter(User.unique_key == unique_key).first()
        if existing:
            unique_key = f"{unique_key}_{google_id[:6]}"

        user = User(
            name=name,
            company=company,
            email=email,
            google_id=google_id,
            unique_key=unique_key,
            is_demo_user=False,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Store OAuth tokens for Gmail and Calendar (same token set)
    _upsert_integration(db, user.id, "gmail", access_token, refresh_token, expires_at)
    _upsert_integration(db, user.id, "google_calendar", access_token, refresh_token, expires_at)

    # Kick off initial Gmail sync in the background
    background_tasks.add_task(_background_gmail_sync, user.id, access_token)

    # Create JWT
    jwt_token = create_access_token({"sub": user.id})

    # Redirect to frontend with token
    return RedirectResponse(
        f"{settings.FRONTEND_URL}/app/today?token={jwt_token}"
    )


@router.post("/logout")
async def logout():
    return {"message": "Logged out"}
