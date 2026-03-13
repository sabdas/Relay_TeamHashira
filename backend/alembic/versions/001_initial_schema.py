"""Initial schema

Revision ID: 001
Revises:
Create Date: 2024-01-01 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSON

revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'users',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('company', sa.String(255), nullable=False),
        sa.Column('unique_key', sa.String(512), unique=True, nullable=False),
        sa.Column('google_id', sa.String(255), unique=True, nullable=True),
        sa.Column('email', sa.String(255), unique=True, nullable=True),
        sa.Column('is_demo_user', sa.Boolean(), default=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
    )

    op.create_table(
        'integrations',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('provider', sa.String(50), nullable=False),
        sa.Column('access_token', sa.Text(), nullable=True),
        sa.Column('refresh_token', sa.Text(), nullable=True),
        sa.Column('expires_at', sa.DateTime(), nullable=True),
        sa.Column('notion_token', sa.Text(), nullable=True),
        sa.Column('notion_database_id', sa.String(255), nullable=True),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
    )

    op.create_table(
        'contacts',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('email', sa.String(255), nullable=True),
        sa.Column('company', sa.String(255), nullable=True),
        sa.Column('role', sa.String(255), nullable=True),
        sa.Column('phone', sa.String(50), nullable=True),
        sa.Column('linkedin_url', sa.String(500), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
    )

    op.create_table(
        'deals',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('contact_id', sa.String(36), sa.ForeignKey('contacts.id'), nullable=True),
        sa.Column('title', sa.String(255), nullable=True),
        sa.Column('stage', sa.String(100), default='On Radar'),
        sa.Column('warmth', sa.String(50), default='Warm'),
        sa.Column('silence_days', sa.Integer(), default=0),
        sa.Column('last_activity', sa.DateTime(), nullable=True),
        sa.Column('deal_size', sa.String(100), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('next_action', sa.Text(), nullable=True),
        sa.Column('is_inferred', sa.Boolean(), default=False),
        sa.Column('confidence', sa.Integer(), nullable=True),
        sa.Column('notion_page_id', sa.String(255), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
    )

    op.create_table(
        'emails',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('thread_id', sa.String(255), nullable=False),
        sa.Column('message_id', sa.String(255), unique=True, nullable=True),
        sa.Column('sender', sa.String(500), nullable=True),
        sa.Column('recipients', JSON, nullable=True),
        sa.Column('subject', sa.String(1000), nullable=True),
        sa.Column('timestamp', sa.DateTime(), nullable=True),
        sa.Column('reply_latency_hours', sa.Float(), nullable=True),
        sa.Column('thread_count', sa.Integer(), default=1),
        sa.Column('is_inbound', sa.Boolean(), default=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )

    op.create_table(
        'meetings',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('calendar_event_id', sa.String(255), unique=True, nullable=True),
        sa.Column('title', sa.String(500), nullable=False),
        sa.Column('participants', JSON, nullable=True),
        sa.Column('start_time', sa.DateTime(), nullable=False),
        sa.Column('end_time', sa.DateTime(), nullable=True),
        sa.Column('duration_mins', sa.Integer(), nullable=True),
        sa.Column('location', sa.String(500), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )

    op.create_table(
        'pending_actions',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('action_type', sa.String(50), nullable=False),
        sa.Column('contact_name', sa.String(255), nullable=True),
        sa.Column('company', sa.String(255), nullable=True),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('payload', JSON, nullable=True),
        sa.Column('requires_approval', sa.Boolean(), default=True),
        sa.Column('approved', sa.Boolean(), default=False),
        sa.Column('rejected', sa.Boolean(), default=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('resolved_at', sa.DateTime(), nullable=True),
    )

    op.create_table(
        'activity_logs',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('entity_type', sa.String(50), nullable=False),
        sa.Column('entity_id', sa.String(36), nullable=True),
        sa.Column('action', sa.String(255), nullable=False),
        sa.Column('metadata', JSON, nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )


def downgrade() -> None:
    op.drop_table('activity_logs')
    op.drop_table('pending_actions')
    op.drop_table('meetings')
    op.drop_table('emails')
    op.drop_table('deals')
    op.drop_table('contacts')
    op.drop_table('integrations')
    op.drop_table('users')
