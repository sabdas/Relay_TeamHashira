from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..auth import get_current_user
from ..models import User, Integration
from ..schemas import IntegrationResponse, ConnectGoogleRequest, ConnectNotionRequest
from ..encryption import encrypt_token

router = APIRouter()


@router.get("/", response_model=List[IntegrationResponse])
async def list_integrations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(Integration).filter(
        Integration.user_id == current_user.id,
        Integration.is_active == True
    ).all()


@router.post("/gmail/connect", response_model=IntegrationResponse)
async def connect_gmail(
    request: ConnectGoogleRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing = db.query(Integration).filter(
        Integration.user_id == current_user.id,
        Integration.provider == "gmail"
    ).first()

    if existing:
        existing.access_token = encrypt_token(request.access_token)
        if request.refresh_token:
            existing.refresh_token = encrypt_token(request.refresh_token)
        existing.expires_at = request.expires_at
        existing.is_active = True
        db.commit()
        db.refresh(existing)
        return existing

    integration = Integration(
        user_id=current_user.id,
        provider="gmail",
        access_token=encrypt_token(request.access_token),
        refresh_token=encrypt_token(request.refresh_token) if request.refresh_token else None,
        expires_at=request.expires_at,
    )
    db.add(integration)
    db.commit()
    db.refresh(integration)
    return integration


@router.post("/google_calendar/connect", response_model=IntegrationResponse)
async def connect_calendar(
    request: ConnectGoogleRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing = db.query(Integration).filter(
        Integration.user_id == current_user.id,
        Integration.provider == "google_calendar"
    ).first()

    if existing:
        existing.access_token = encrypt_token(request.access_token)
        existing.is_active = True
        db.commit()
        db.refresh(existing)
        return existing

    integration = Integration(
        user_id=current_user.id,
        provider="google_calendar",
        access_token=encrypt_token(request.access_token),
        refresh_token=encrypt_token(request.refresh_token) if request.refresh_token else None,
        expires_at=request.expires_at,
    )
    db.add(integration)
    db.commit()
    db.refresh(integration)
    return integration


@router.post("/notion/connect", response_model=IntegrationResponse)
async def connect_notion(
    request: ConnectNotionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing = db.query(Integration).filter(
        Integration.user_id == current_user.id,
        Integration.provider == "notion"
    ).first()

    if existing:
        existing.notion_token = encrypt_token(request.notion_token)
        existing.notion_database_id = request.notion_database_id
        existing.is_active = True
        db.commit()
        db.refresh(existing)
        return existing

    integration = Integration(
        user_id=current_user.id,
        provider="notion",
        notion_token=encrypt_token(request.notion_token),
        notion_database_id=request.notion_database_id,
    )
    db.add(integration)
    db.commit()
    db.refresh(integration)
    return integration


@router.delete("/{provider}")
async def disconnect_integration(
    provider: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    integration = db.query(Integration).filter(
        Integration.user_id == current_user.id,
        Integration.provider == provider
    ).first()

    if not integration:
        raise HTTPException(status_code=404, detail="Integration not found")

    integration.is_active = False
    integration.access_token = None
    integration.refresh_token = None
    integration.notion_token = None
    db.commit()
    return {"message": f"{provider} disconnected"}
