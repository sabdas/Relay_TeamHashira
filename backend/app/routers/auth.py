from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
import httpx
import re

from ..database import get_db
from ..config import settings
from ..auth import create_access_token
from ..models import User
from ..schemas import TokenResponse, UserResponse

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


@router.get("/google/callback")
async def google_callback(code: str, db: Session = Depends(get_db)):
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

    # Create JWT
    access_token = create_access_token({"sub": user.id})

    # Redirect to frontend with token
    return RedirectResponse(
        f"{settings.FRONTEND_URL}/app/today?token={access_token}"
    )


@router.post("/logout")
async def logout():
    return {"message": "Logged out"}
