"""
Intelligence Service — warmth scoring and deal momentum calculation.
Uses email metadata signals (frequency, latency, recency) to calculate warmth.
"""
from datetime import datetime, timedelta
from typing import Optional


def calculate_warmth(
    silence_days: int,
    reply_latency_hours: Optional[float],
    thread_count: int,
    last_meeting_days_ago: Optional[int] = None,
) -> str:
    """
    Calculate deal warmth based on activity signals.

    Signals:
    - silence_days: days since last interaction
    - reply_latency_hours: average reply time in last thread
    - thread_count: total email threads
    - last_meeting_days_ago: days since last meeting

    Returns: "Hot" | "Warm" | "Cooling" | "Cold"
    """
    score = 0

    # Recency score (0-40 points)
    if silence_days <= 2:
        score += 40
    elif silence_days <= 5:
        score += 30
    elif silence_days <= 10:
        score += 20
    elif silence_days <= 14:
        score += 10
    else:
        score += 0

    # Reply latency score (0-30 points) — faster = better
    if reply_latency_hours is not None:
        if reply_latency_hours <= 2:
            score += 30
        elif reply_latency_hours <= 8:
            score += 20
        elif reply_latency_hours <= 24:
            score += 10
        elif reply_latency_hours <= 48:
            score += 5
    else:
        score += 5  # No reply data

    # Thread volume score (0-15 points)
    if thread_count >= 10:
        score += 15
    elif thread_count >= 5:
        score += 10
    elif thread_count >= 2:
        score += 5

    # Meeting recency (0-15 points)
    if last_meeting_days_ago is not None:
        if last_meeting_days_ago <= 7:
            score += 15
        elif last_meeting_days_ago <= 14:
            score += 10
        elif last_meeting_days_ago <= 30:
            score += 5

    # Convert score to warmth level
    if score >= 70:
        return "Hot"
    elif score >= 45:
        return "Warm"
    elif score >= 20:
        return "Cooling"
    else:
        return "Cold"


def calculate_deal_score(deal_data: dict) -> int:
    """
    Calculate overall deal health score (0-100).
    Used for sorting and prioritization.
    """
    score = 0

    stage_scores = {
        "Closing": 90,
        "Proposal Out": 70,
        "Qualified": 50,
        "In Conversation": 30,
        "On Radar": 10,
    }
    score += stage_scores.get(deal_data.get("stage", "On Radar"), 10)

    warmth_bonus = {"Hot": 10, "Warm": 5, "Cooling": -5, "Cold": -10}
    score += warmth_bonus.get(deal_data.get("warmth", "Warm"), 0)

    # Recency penalty
    silence_days = deal_data.get("silence_days", 0)
    if silence_days > 14:
        score -= 20
    elif silence_days > 7:
        score -= 10

    return max(0, min(100, score))


def infer_stage_from_signals(
    thread_count: int,
    has_meeting: bool,
    has_proposal_keyword: bool,
    reply_latency_hours: float,
    silence_days: int,
) -> tuple[str, int]:
    """
    Infer likely deal stage from email/calendar signals.
    Returns (stage, confidence_pct).
    """
    if has_proposal_keyword and thread_count >= 5:
        if reply_latency_hours <= 8:
            return "Proposal Out", 85
        return "Proposal Out", 70

    if has_meeting and thread_count >= 3:
        return "Qualified", 75

    if thread_count >= 3 and silence_days <= 7:
        return "In Conversation", 65

    if thread_count >= 1:
        return "On Radar", 50

    return "On Radar", 30


def calculate_confidence(
    signal_count: int,
    data_sources: list,
    has_explicit_record: bool,
) -> int:
    """
    Calculate confidence score for an inferred action.
    signal_count: number of supporting signals
    data_sources: list of sources (e.g. ['gmail', 'calendar'])
    has_explicit_record: whether there's a manually-entered record
    """
    if has_explicit_record:
        return 100

    base = 40
    base += min(signal_count * 10, 30)  # up to 30 from signals
    base += len(data_sources) * 10  # 10 per source (max 20 for gmail + calendar)

    return min(95, base)
