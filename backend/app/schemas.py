from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid


# ---- User ----
class UserBase(BaseModel):
    name: str
    company: str


class UserCreate(UserBase):
    google_id: Optional[str] = None
    email: Optional[str] = None


class UserResponse(UserBase):
    id: str
    unique_key: str
    is_demo_user: bool
    created_at: datetime
    email: Optional[str] = None

    class Config:
        from_attributes = True


# ---- Auth ----
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class GoogleCallbackRequest(BaseModel):
    code: str
    redirect_uri: Optional[str] = None


# ---- Integration ----
class IntegrationResponse(BaseModel):
    id: str
    provider: str
    is_active: bool
    created_at: datetime
    notion_database_id: Optional[str] = None

    class Config:
        from_attributes = True


class ConnectGoogleRequest(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    expires_at: Optional[datetime] = None


class ConnectNotionRequest(BaseModel):
    notion_token: str
    notion_database_id: Optional[str] = None


# ---- Contact ----
class ContactBase(BaseModel):
    name: str
    email: Optional[str] = None
    company: Optional[str] = None
    role: Optional[str] = None
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    notes: Optional[str] = None


class ContactCreate(ContactBase):
    pass


class ContactUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    company: Optional[str] = None
    role: Optional[str] = None
    notes: Optional[str] = None


class ContactResponse(ContactBase):
    id: str
    user_id: str
    created_at: datetime
    # Enriched from associated deal (optional)
    warmth: Optional[str] = None
    silence_days: Optional[int] = None
    stage: Optional[str] = None

    class Config:
        from_attributes = True


# ---- Deal ----
class DealBase(BaseModel):
    title: Optional[str] = None
    stage: str = "On Radar"
    warmth: str = "Warm"
    silence_days: int = 0
    deal_size: Optional[str] = None
    notes: Optional[str] = None
    next_action: Optional[str] = None


class DealCreate(DealBase):
    contact_id: Optional[str] = None


class DealUpdate(BaseModel):
    title: Optional[str] = None
    stage: Optional[str] = None
    warmth: Optional[str] = None
    silence_days: Optional[int] = None
    deal_size: Optional[str] = None
    notes: Optional[str] = None
    next_action: Optional[str] = None


class DealResponse(DealBase):
    id: str
    user_id: str
    contact_id: Optional[str] = None
    last_activity: datetime
    is_inferred: bool
    confidence: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ---- Email ----
class EmailResponse(BaseModel):
    id: str
    thread_id: str
    sender: Optional[str] = None
    recipients: Optional[List[str]] = None
    subject: Optional[str] = None
    timestamp: Optional[datetime] = None
    reply_latency_hours: Optional[float] = None
    thread_count: int

    class Config:
        from_attributes = True


class EmailDigestItem(BaseModel):
    id: str
    thread_id: str
    contact_name: Optional[str] = None
    company: Optional[str] = None
    subject: Optional[str] = None
    thread_count: int
    last_message: Optional[datetime] = None
    reply_latency_hours: Optional[float] = None
    signal: str
    sentiment: str  # "positive" | "neutral" | "negative"
    is_inferred: bool
    confidence: int

    class Config:
        from_attributes = True


# ---- Meeting ----
class MeetingResponse(BaseModel):
    id: str
    title: str
    participants: Optional[List[str]] = None
    start_time: datetime
    end_time: Optional[datetime] = None
    duration_mins: Optional[int] = None

    class Config:
        from_attributes = True


# ---- Pending Action ----
class PendingActionResponse(BaseModel):
    id: str
    action_type: str
    contact_name: Optional[str] = None
    company: Optional[str] = None
    description: str
    payload: Optional[Dict[str, Any]] = None
    requires_approval: bool
    approved: bool
    created_at: datetime

    class Config:
        from_attributes = True


class PendingActionApprove(BaseModel):
    approved: bool = True


# ---- Today View ----
class FollowUpItem(BaseModel):
    id: str
    contact_name: str
    company: Optional[str] = None
    warmth: str
    silence_days: int
    last_activity: datetime
    suggestion: str
    thread_count: int
    is_inferred: bool
    confidence: Optional[int] = None
    contact_id: str


class DraftItem(BaseModel):
    id: str
    contact_name: str
    company: Optional[str] = None
    subject: str
    snippet: str
    created_at: datetime


class UpcomingItem(BaseModel):
    id: str
    title: str
    company: Optional[str] = None
    start_time: datetime
    duration_mins: int
    prep_note: Optional[str] = None


class OffTrackItem(BaseModel):
    id: str
    contact_name: str
    company: Optional[str] = None
    warmth: str
    silence_days: int
    last_activity: datetime
    stage: str
    risk: str


class TodayViewResponse(BaseModel):
    followups: List[FollowUpItem]
    drafts: List[DraftItem]
    upcoming: List[UpcomingItem]
    offtrack: List[OffTrackItem]


# ---- Demo ----
class DemoLoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
