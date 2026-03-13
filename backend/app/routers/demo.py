from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import re

from ..database import get_db
from ..auth import create_access_token
from ..models import User
from ..services.demo_service import (
    get_demo_today_data,
    get_demo_pipeline_data,
    get_demo_contacts_data,
    get_demo_pending_data,
    get_demo_email_digest,
)

router = APIRouter()

DEMO_USER_NAME = "Not So Pareshan Founder"
DEMO_USER_COMPANY = "Demo Startup"


def make_unique_key(name: str, company: str) -> str:
    combined = f"{name}_{company}".lower()
    return re.sub(r'[^a-z0-9_]', '_', combined)


@router.post("/login")
async def demo_login(db: Session = Depends(get_db)):
    """Create/return demo user and issue JWT"""
    unique_key = make_unique_key(DEMO_USER_NAME, DEMO_USER_COMPANY)

    # Find or create demo user
    user = db.query(User).filter(User.unique_key == unique_key).first()
    if not user:
        user = User(
            name=DEMO_USER_NAME,
            company=DEMO_USER_COMPANY,
            unique_key=unique_key,
            is_demo_user=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    access_token = create_access_token({"sub": user.id})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "company": user.company,
            "unique_key": user.unique_key,
            "is_demo_user": user.is_demo_user,
            "created_at": user.created_at.isoformat(),
        }
    }


@router.get("/today")
async def demo_today():
    return get_demo_today_data()


@router.get("/pipeline")
async def demo_pipeline():
    return get_demo_pipeline_data()


@router.get("/contacts")
async def demo_contacts():
    return get_demo_contacts_data()


@router.get("/pending")
async def demo_pending():
    return get_demo_pending_data()


@router.get("/email-digest")
async def demo_email_digest():
    return get_demo_email_digest()
