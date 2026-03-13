import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Boolean, DateTime, Integer, Float,
    ForeignKey, JSON, Text
)
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from .database import Base


def gen_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    name = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False)
    unique_key = Column(String(512), unique=True, nullable=False)  # name_company snake_case
    google_id = Column(String(255), unique=True, nullable=True)
    email = Column(String(255), unique=True, nullable=True)
    is_demo_user = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    integrations = relationship("Integration", back_populates="user", cascade="all, delete-orphan")
    contacts = relationship("Contact", back_populates="user", cascade="all, delete-orphan")
    deals = relationship("Deal", back_populates="user", cascade="all, delete-orphan")
    emails = relationship("Email", back_populates="user", cascade="all, delete-orphan")
    meetings = relationship("Meeting", back_populates="user", cascade="all, delete-orphan")
    pending_actions = relationship("PendingAction", back_populates="user", cascade="all, delete-orphan")
    activity_logs = relationship("ActivityLog", back_populates="user", cascade="all, delete-orphan")


class Integration(Base):
    __tablename__ = "integrations"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    provider = Column(String(50), nullable=False)  # gmail, google_calendar, notion
    access_token = Column(Text, nullable=True)   # encrypted
    refresh_token = Column(Text, nullable=True)  # encrypted
    expires_at = Column(DateTime, nullable=True)
    notion_token = Column(Text, nullable=True)   # encrypted (Notion-specific)
    notion_database_id = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="integrations")


class Contact(Base):
    __tablename__ = "contacts"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=True)
    company = Column(String(255), nullable=True)
    role = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    linkedin_url = Column(String(500), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="contacts")
    deals = relationship("Deal", back_populates="contact", cascade="all, delete-orphan")


class Deal(Base):
    __tablename__ = "deals"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    contact_id = Column(UUID(as_uuid=False), ForeignKey("contacts.id"), nullable=True)
    title = Column(String(255), nullable=True)
    stage = Column(String(100), default="On Radar")  # On Radar, In Conversation, Qualified, Proposal Out, Closing
    warmth = Column(String(50), default="Warm")  # Hot, Warm, Cooling, Cold
    silence_days = Column(Integer, default=0)
    last_activity = Column(DateTime, default=datetime.utcnow)
    deal_size = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    next_action = Column(Text, nullable=True)
    is_inferred = Column(Boolean, default=False)
    confidence = Column(Integer, nullable=True)
    notion_page_id = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="deals")
    contact = relationship("Contact", back_populates="deals")


class Email(Base):
    __tablename__ = "emails"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    thread_id = Column(String(255), nullable=False)
    message_id = Column(String(255), unique=True, nullable=True)
    sender = Column(String(500), nullable=True)
    recipients = Column(JSON, nullable=True)  # list of email addresses
    subject = Column(String(1000), nullable=True)
    timestamp = Column(DateTime, nullable=True)
    reply_latency_hours = Column(Float, nullable=True)
    thread_count = Column(Integer, default=1)
    is_inbound = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="emails")


class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    calendar_event_id = Column(String(255), unique=True, nullable=True)
    title = Column(String(500), nullable=False)
    participants = Column(JSON, nullable=True)  # list of email addresses
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=True)
    duration_mins = Column(Integer, nullable=True)
    location = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="meetings")


class PendingAction(Base):
    __tablename__ = "pending_actions"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    action_type = Column(String(50), nullable=False)  # stage_change, note, contact, follow_up
    contact_name = Column(String(255), nullable=True)
    company = Column(String(255), nullable=True)
    description = Column(Text, nullable=False)
    payload = Column(JSON, nullable=True)
    requires_approval = Column(Boolean, default=True)
    approved = Column(Boolean, default=False)
    rejected = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="pending_actions")


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    entity_type = Column(String(50), nullable=False)  # deal, contact, email, meeting
    entity_id = Column(UUID(as_uuid=False), nullable=True)
    action = Column(String(255), nullable=False)
    metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="activity_logs")
