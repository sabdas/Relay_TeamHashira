"""
Google Calendar Service — reads event metadata only.
Extracts participant emails and meeting times to map to contacts.
"""
import httpx
from typing import List, Dict, Any
from datetime import datetime, timezone
from sqlalchemy.orm import Session


async def fetch_calendar_events(
    access_token: str,
    user_id: str,
    db: Session,
    days_back: int = 30,
    days_ahead: int = 14,
) -> int:
    """
    Fetch calendar events and extract participant data.
    Returns number of events processed.
    """
    from datetime import timedelta

    headers = {"Authorization": f"Bearer {access_token}"}
    now = datetime.utcnow()
    time_min = (now - timedelta(days=days_back)).isoformat() + "Z"
    time_max = (now + timedelta(days=days_ahead)).isoformat() + "Z"

    async with httpx.AsyncClient() as client:
        res = await client.get(
            "https://www.googleapis.com/calendar/v3/calendars/primary/events",
            headers=headers,
            params={
                "timeMin": time_min,
                "timeMax": time_max,
                "singleEvents": "true",
                "orderBy": "startTime",
                "maxResults": 100,
                "fields": "items(id,summary,start,end,attendees,description)",
            },
        )
        if res.status_code != 200:
            raise Exception(f"Calendar API error: {res.status_code}")

        data = res.json()
        events = data.get("items", [])
        synced = 0

        for event in events:
            event_id = event.get("id")
            title = event.get("summary", "Meeting")

            start_raw = event.get("start", {})
            end_raw = event.get("end", {})

            # Parse times
            try:
                start_time = datetime.fromisoformat(
                    start_raw.get("dateTime", start_raw.get("date", "")).replace("Z", "+00:00")
                )
                end_time = datetime.fromisoformat(
                    end_raw.get("dateTime", end_raw.get("date", "")).replace("Z", "+00:00")
                )
            except Exception:
                continue

            # Extract attendee emails
            attendees = event.get("attendees", [])
            participant_emails = [a.get("email", "") for a in attendees if a.get("email")]

            # Calculate duration
            duration_mins = int((end_time - start_time).total_seconds() / 60)

            # Store meeting
            from ..models import Meeting
            existing = db.query(Meeting).filter(
                Meeting.calendar_event_id == event_id
            ).first()

            if not existing:
                meeting = Meeting(
                    user_id=user_id,
                    calendar_event_id=event_id,
                    title=title,
                    participants=participant_emails,
                    start_time=start_time.replace(tzinfo=None),
                    end_time=end_time.replace(tzinfo=None),
                    duration_mins=duration_mins,
                )
                db.add(meeting)
                synced += 1

        db.commit()
        return synced


def extract_deal_participants(participants: List[str], user_email: str) -> List[str]:
    """Extract external participants (not the user) from a meeting"""
    return [p for p in participants if p and p != user_email]
