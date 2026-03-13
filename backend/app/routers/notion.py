from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..auth import get_current_user
from ..models import User, Integration
from ..encryption import decrypt_token

router = APIRouter()


@router.get("/databases")
async def list_notion_databases(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List Notion databases accessible to the user"""
    if current_user.is_demo_user:
        return [{"id": "demo-db-1", "title": "Deal Pipeline (Demo)"}]

    integration = db.query(Integration).filter(
        Integration.user_id == current_user.id,
        Integration.provider == "notion",
        Integration.is_active == True
    ).first()

    if not integration:
        raise HTTPException(status_code=404, detail="Notion not connected")

    from ..services.notion_service import list_databases
    token = decrypt_token(integration.notion_token)
    return await list_databases(token)


@router.post("/append/{database_id}")
async def append_to_notion(
    database_id: str,
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Append a note/update to a Notion database (append-only)"""
    if current_user.is_demo_user:
        return {"message": "Demo mode — append simulated", "page_id": "demo-page-1"}

    integration = db.query(Integration).filter(
        Integration.user_id == current_user.id,
        Integration.provider == "notion",
        Integration.is_active == True
    ).first()

    if not integration:
        raise HTTPException(status_code=404, detail="Notion not connected")

    from ..services.notion_service import append_to_database
    token = decrypt_token(integration.notion_token)
    result = await append_to_database(token, database_id, data)
    return result
