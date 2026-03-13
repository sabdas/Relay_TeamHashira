from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from ..database import get_db
from ..auth import get_current_user
from ..models import User, PendingAction
from ..schemas import PendingActionResponse

router = APIRouter()


@router.get("/", response_model=List[PendingActionResponse])
async def list_pending(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.is_demo_user:
        from ..services.demo_service import get_demo_pending_data
        return get_demo_pending_data()

    return db.query(PendingAction).filter(
        PendingAction.user_id == current_user.id,
        PendingAction.approved == False,
        PendingAction.rejected == False,
    ).order_by(PendingAction.created_at.desc()).all()


@router.post("/{action_id}/approve", response_model=PendingActionResponse)
async def approve_action(
    action_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    action = db.query(PendingAction).filter(
        PendingAction.id == action_id,
        PendingAction.user_id == current_user.id
    ).first()
    if not action:
        raise HTTPException(status_code=404, detail="Action not found")

    action.approved = True
    action.resolved_at = datetime.utcnow()
    db.commit()
    db.refresh(action)
    return action


@router.post("/{action_id}/reject")
async def reject_action(
    action_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    action = db.query(PendingAction).filter(
        PendingAction.id == action_id,
        PendingAction.user_id == current_user.id
    ).first()
    if not action:
        raise HTTPException(status_code=404, detail="Action not found")

    action.rejected = True
    action.resolved_at = datetime.utcnow()
    db.commit()
    return {"message": "Action rejected"}
