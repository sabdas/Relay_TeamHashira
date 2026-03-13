"""
Gmail Service — reads thread METADATA ONLY.
No email body content is ever accessed or stored.
"""
import httpx
from typing import List, Dict, Any
from datetime import datetime
from sqlalchemy.orm import Session


async def fetch_gmail_metadata(
    access_token: str,
    user_id: str,
    db: Session,
    max_results: int = 50,
) -> int:
    """
    Fetch Gmail thread metadata (subject, sender, timestamp).
    Email bodies are NEVER requested or stored.
    Returns number of threads processed.
    """
    headers = {"Authorization": f"Bearer {access_token}"}

    async with httpx.AsyncClient() as client:
        # List threads
        params = {
            "maxResults": max_results,
            "labelIds": "INBOX",
            "fields": "threads(id,snippet),nextPageToken",
        }
        res = await client.get(
            "https://gmail.googleapis.com/gmail/v1/users/me/threads",
            headers=headers,
            params=params,
        )
        if res.status_code != 200:
            raise Exception(f"Gmail API error: {res.status_code} — {res.text}")

        data = res.json()
        threads = data.get("threads", [])
        synced = 0

        for thread in threads:
            thread_id = thread["id"]
            # Get thread metadata only — NOT body
            thread_res = await client.get(
                f"https://gmail.googleapis.com/gmail/v1/users/me/threads/{thread_id}",
                headers=headers,
                params={
                    "format": "metadata",
                    "metadataHeaders": ["Subject", "From", "To", "Date"],
                },
            )
            if thread_res.status_code != 200:
                continue

            thread_data = thread_res.json()
            messages = thread_data.get("messages", [])
            if not messages:
                continue

            # Extract metadata from first message
            first_msg = messages[0]
            headers_list = first_msg.get("payload", {}).get("headers", [])
            header_map = {h["name"].lower(): h["value"] for h in headers_list}

            subject = header_map.get("subject", "(no subject)")
            sender = header_map.get("from", "")
            recipients = header_map.get("to", "").split(",")
            date_str = header_map.get("date", "")

            # Parse timestamp
            try:
                from email.utils import parsedate_to_datetime
                timestamp = parsedate_to_datetime(date_str)
            except Exception:
                timestamp = datetime.utcnow()

            # Store metadata only
            from ..models import Email
            existing = db.query(Email).filter(
                Email.user_id == user_id,
                Email.thread_id == thread_id,
            ).first()

            reply_latency = calculate_reply_latency(messages) or None

            if not existing:
                email = Email(
                    user_id=user_id,
                    thread_id=thread_id,
                    sender=sender,
                    recipients=[r.strip() for r in recipients if r.strip()],
                    subject=subject,
                    timestamp=timestamp,
                    thread_count=len(messages),
                    reply_latency_hours=reply_latency,
                )
                db.add(email)
                synced += 1
            else:
                # Update thread_count and latency in case thread has grown
                existing.thread_count = len(messages)
                if reply_latency:
                    existing.reply_latency_hours = reply_latency

        db.commit()
        return synced


def calculate_reply_latency(messages: List[Dict]) -> float:
    """Calculate average reply latency in hours from thread messages"""
    if len(messages) < 2:
        return 0.0

    latencies = []
    for i in range(1, len(messages)):
        prev_ts = messages[i - 1].get("internalDate", 0)
        curr_ts = messages[i].get("internalDate", 0)
        if prev_ts and curr_ts:
            diff_hours = (int(curr_ts) - int(prev_ts)) / (1000 * 3600)
            if 0 < diff_hours < 168:  # within a week
                latencies.append(diff_hours)

    return sum(latencies) / len(latencies) if latencies else 0.0
