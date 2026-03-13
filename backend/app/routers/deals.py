from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..auth import get_current_user
from ..models import User, Deal
from ..schemas import DealResponse, DealCreate, DealUpdate

router = APIRouter()


@router.get("/", response_model=List[DealResponse])
async def list_deals(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(Deal).filter(Deal.user_id == current_user.id).all()


@router.get("/{deal_id}", response_model=DealResponse)
async def get_deal(
    deal_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    deal = db.query(Deal).filter(
        Deal.id == deal_id,
        Deal.user_id == current_user.id
    ).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    return deal


@router.post("/", response_model=DealResponse)
async def create_deal(
    data: DealCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    deal = Deal(user_id=current_user.id, **data.model_dump())
    db.add(deal)
    db.commit()
    db.refresh(deal)
    return deal


@router.patch("/{deal_id}", response_model=DealResponse)
async def update_deal(
    deal_id: str,
    data: DealUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    deal = db.query(Deal).filter(
        Deal.id == deal_id,
        Deal.user_id == current_user.id
    ).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")

    for key, value in data.model_dump(exclude_none=True).items():
        setattr(deal, key, value)

    db.commit()
    db.refresh(deal)
    return deal


@router.delete("/{deal_id}")
async def delete_deal(
    deal_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    deal = db.query(Deal).filter(
        Deal.id == deal_id,
        Deal.user_id == current_user.id
    ).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    db.delete(deal)
    db.commit()
    return {"message": "Deal deleted"}


@router.get("/pipeline/kanban")
async def get_pipeline_kanban(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return deals grouped by stage for Kanban view"""
    stages = ["On Radar", "In Conversation", "Qualified", "Proposal Out", "Closing"]
    deals = db.query(Deal).filter(Deal.user_id == current_user.id).all()

    columns = []
    for stage in stages:
        stage_deals = [d for d in deals if d.stage == stage]
        columns.append({
            "id": stage,
            "title": stage,
            "deals": [
                {
                    "id": d.id,
                    "contact_name": d.contact.name if d.contact else "Unknown",
                    "company": d.contact.company if d.contact else "",
                    "warmth": d.warmth,
                    "silence_days": d.silence_days,
                    "deal_size": d.deal_size,
                    "stage": d.stage,
                    "last_activity": d.last_activity.isoformat() if d.last_activity else None,
                    "next_action": d.next_action,
                }
                for d in stage_deals
            ]
        })
    return columns
