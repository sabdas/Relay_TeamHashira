"""
Demo data service — generates realistic mock data for the demo user.
Demo user: "Not So Pareshan Founder" at "Demo Startup"
"""
from datetime import datetime, timedelta
from typing import List, Dict, Any

NOW = datetime.utcnow()


def _days_ago(n: int) -> datetime:
    return NOW - timedelta(days=n)


def _hours_ago(n: float) -> datetime:
    return NOW - timedelta(hours=n)


def _hours_from_now(n: float) -> datetime:
    return NOW + timedelta(hours=n)


# ---- Contacts ----
DEMO_CONTACTS = [
    {
        "id": "c1",
        "name": "Arjun Malhotra",
        "email": "arjun@kirahealth.in",
        "company": "Kira Health",
        "role": "CEO",
        "warmth": "Hot",
        "silence_days": 3,
        "stage": "Proposal Out",
        "deal_id": "d1",
    },
    {
        "id": "c2",
        "name": "Sneha Kapoor",
        "email": "sneha.kapoor@groww.in",
        "company": "Groww",
        "role": "VP Engineering",
        "warmth": "Warm",
        "silence_days": 7,
        "stage": "In Conversation",
        "deal_id": "d2",
    },
    {
        "id": "c3",
        "name": "Vikram Nair",
        "email": "vikram@razorpay.com",
        "company": "Razorpay",
        "role": "Head of Partnerships",
        "warmth": "Warm",
        "silence_days": 5,
        "stage": "Qualified",
        "deal_id": "d3",
    },
    {
        "id": "c4",
        "name": "Priya Sharma",
        "email": "priya.sharma@meesho.com",
        "company": "Meesho",
        "role": "CTO",
        "warmth": "Hot",
        "silence_days": 1,
        "stage": "Closing",
        "deal_id": "d4",
    },
    {
        "id": "c5",
        "name": "Rohan Verma",
        "email": "rohan.verma@swiggy.in",
        "company": "Swiggy",
        "role": "Head of Product",
        "warmth": "Warm",
        "silence_days": 2,
        "stage": "On Radar",
        "deal_id": "d5",
    },
    {
        "id": "c6",
        "name": "Neha Joshi",
        "email": "neha@cred.club",
        "company": "CRED",
        "role": "Director of Finance",
        "warmth": "Hot",
        "silence_days": 0,
        "stage": "In Conversation",
        "deal_id": "d6",
    },
    {
        "id": "c7",
        "name": "Amit Patel",
        "email": "amit.patel@pharmeasy.in",
        "company": "PharmEasy",
        "role": "COO",
        "warmth": "Cooling",
        "silence_days": 18,
        "stage": "Proposal Out",
        "deal_id": "d7",
    },
]

# ---- Deals ----
DEMO_DEALS = [
    {
        "id": "d1",
        "contact_name": "Arjun Malhotra",
        "company": "Kira Health",
        "warmth": "Hot",
        "silence_days": 3,
        "deal_size": "₹12L ARR",
        "stage": "Proposal Out",
        "last_activity": _days_ago(3).isoformat(),
        "next_action": "Follow up on pilot proposal",
        "is_inferred": True,
        "confidence": 87,
    },
    {
        "id": "d2",
        "contact_name": "Sneha Kapoor",
        "company": "Groww",
        "warmth": "Warm",
        "silence_days": 7,
        "deal_size": "₹8L ARR",
        "stage": "In Conversation",
        "last_activity": _days_ago(7).isoformat(),
        "next_action": "Check security review timeline",
        "is_inferred": False,
        "confidence": 92,
    },
    {
        "id": "d3",
        "contact_name": "Vikram Nair",
        "company": "Razorpay",
        "warmth": "Warm",
        "silence_days": 5,
        "deal_size": "₹25L ARR",
        "stage": "Qualified",
        "last_activity": _days_ago(5).isoformat(),
        "next_action": "Loop in CTO",
        "is_inferred": True,
        "confidence": 74,
    },
    {
        "id": "d4",
        "contact_name": "Priya Sharma",
        "company": "Meesho",
        "warmth": "Hot",
        "silence_days": 1,
        "deal_size": "₹18L ARR",
        "stage": "Closing",
        "last_activity": _days_ago(1).isoformat(),
        "next_action": "Send final contract",
        "is_inferred": True,
        "confidence": 95,
    },
    {
        "id": "d5",
        "contact_name": "Rohan Verma",
        "company": "Swiggy",
        "warmth": "Warm",
        "silence_days": 2,
        "deal_size": "TBD",
        "stage": "On Radar",
        "last_activity": _days_ago(2).isoformat(),
        "next_action": "Schedule intro call",
        "is_inferred": False,
        "confidence": 80,
    },
    {
        "id": "d6",
        "contact_name": "Neha Joshi",
        "company": "CRED",
        "warmth": "Hot",
        "silence_days": 0,
        "deal_size": "₹30L ARR",
        "stage": "In Conversation",
        "last_activity": NOW.isoformat(),
        "next_action": "Prepare ROI deck for team demo",
        "is_inferred": True,
        "confidence": 91,
    },
    {
        "id": "d7",
        "contact_name": "Amit Patel",
        "company": "PharmEasy",
        "warmth": "Cooling",
        "silence_days": 18,
        "deal_size": "₹15L ARR",
        "stage": "Proposal Out",
        "last_activity": _days_ago(18).isoformat(),
        "next_action": "Re-engage — no response to proposal",
        "is_inferred": True,
        "confidence": 82,
    },
    {
        "id": "d8",
        "contact_name": "Rahul Gupta",
        "company": "Zepto",
        "warmth": "Warm",
        "silence_days": 4,
        "deal_size": "₹10L ARR",
        "stage": "Qualified",
        "last_activity": _days_ago(4).isoformat(),
        "next_action": "Send enterprise pricing",
        "is_inferred": False,
        "confidence": 88,
    },
    {
        "id": "d9",
        "contact_name": "Kavya Reddy",
        "company": "Urban Company",
        "warmth": "Cold",
        "silence_days": 30,
        "deal_size": None,
        "stage": "On Radar",
        "last_activity": _days_ago(30).isoformat(),
        "next_action": None,
        "is_inferred": True,
        "confidence": 45,
    },
]


def get_demo_contacts_data() -> List[Dict[str, Any]]:
    return DEMO_CONTACTS


def get_demo_pipeline_data() -> List[Dict[str, Any]]:
    stages = ["On Radar", "In Conversation", "Qualified", "Proposal Out", "Closing"]
    columns = []
    for stage in stages:
        columns.append({
            "id": stage,
            "title": stage,
            "color": "",
            "deals": [d for d in DEMO_DEALS if d["stage"] == stage],
        })
    return columns


def get_demo_today_data() -> Dict[str, Any]:
    followups = [
        {
            "id": "f1",
            "contact_name": "Arjun Malhotra",
            "company": "Kira Health",
            "warmth": "Hot",
            "silence_days": 3,
            "last_activity": _days_ago(3),
            "suggestion": "Send follow-up on the pilot proposal you sent last Tuesday.",
            "thread_count": 12,
            "is_inferred": True,
            "confidence": 87,
            "contact_id": "c1",
        },
        {
            "id": "f2",
            "contact_name": "Sneha Kapoor",
            "company": "Groww",
            "warmth": "Warm",
            "silence_days": 7,
            "last_activity": _days_ago(7),
            "suggestion": "Check in on the security review timeline — last meeting was a week ago.",
            "thread_count": 6,
            "is_inferred": False,
            "confidence": 92,
            "contact_id": "c2",
        },
        {
            "id": "f3",
            "contact_name": "Vikram Nair",
            "company": "Razorpay",
            "warmth": "Warm",
            "silence_days": 5,
            "last_activity": _days_ago(5),
            "suggestion": "Loop in their CTO as discussed in the last call.",
            "thread_count": 9,
            "is_inferred": True,
            "confidence": 74,
            "contact_id": "c3",
        },
    ]

    drafts = [
        {
            "id": "dr1",
            "contact_name": "Priya Sharma",
            "company": "Meesho",
            "subject": "Re: Integration timeline & next steps",
            "snippet": "Hi Priya, following up on our discussion about the Q3 integration...",
            "created_at": _hours_ago(2),
        },
        {
            "id": "dr2",
            "contact_name": "Rahul Gupta",
            "company": "Zepto",
            "subject": "Proposal: Enterprise plan for 50-100 users",
            "snippet": "Hi Rahul, as promised here's the breakdown of pricing for your team...",
            "created_at": _hours_ago(5),
        },
    ]

    upcoming = [
        {
            "id": "u1",
            "title": "Intro call with Rohan Verma",
            "company": "Swiggy",
            "start_time": _hours_from_now(2),
            "duration_mins": 30,
            "prep_note": "New inbound — referred by Vikram. First call, discovery focus.",
        },
        {
            "id": "u2",
            "title": "Demo: Neha Joshi & team",
            "company": "CRED",
            "start_time": _hours_from_now(5),
            "duration_mins": 60,
            "prep_note": "3 stakeholders joining. Prepare ROI calculator slide.",
        },
    ]

    offtrack = [
        {
            "id": "o1",
            "contact_name": "Amit Patel",
            "company": "PharmEasy",
            "warmth": "Cooling",
            "silence_days": 18,
            "last_activity": _days_ago(18),
            "stage": "Proposal Out",
            "risk": "No response to proposal sent 18 days ago. Deal is cooling.",
        },
    ]

    return {
        "followups": followups,
        "drafts": drafts,
        "upcoming": upcoming,
        "offtrack": offtrack,
    }


def get_demo_pending_data() -> List[Dict[str, Any]]:
    return [
        {
            "id": "p1",
            "action_type": "stage_change",
            "contact_name": "Arjun Malhotra",
            "company": "Kira Health",
            "description": "Relay detected 3 positive reply signals and a demo scheduled. Suggested move from Qualified → Proposal Out.",
            "payload": {"from_stage": "Qualified", "to_stage": "Proposal Out", "confidence": 89},
            "requires_approval": True,
            "approved": False,
            "created_at": _hours_ago(2),
        },
        {
            "id": "p2",
            "action_type": "stage_change",
            "contact_name": "Priya Sharma",
            "company": "Meesho",
            "description": "Contract reviewed + legal sign-off email detected. Suggested move from Proposal Out → Closing.",
            "payload": {"from_stage": "Proposal Out", "to_stage": "Closing", "confidence": 94},
            "requires_approval": True,
            "approved": False,
            "created_at": _hours_ago(4),
        },
        {
            "id": "p3",
            "action_type": "note",
            "contact_name": "Vikram Nair",
            "company": "Razorpay",
            "description": "New note inferred from calendar: 'Team alignment call — 4 participants, 45 min. Key topic: enterprise security requirements.'",
            "payload": {"note": "Team alignment call. Enterprise security requirements discussed.", "source": "calendar"},
            "requires_approval": True,
            "approved": False,
            "created_at": _hours_ago(6),
        },
        {
            "id": "p4",
            "action_type": "note",
            "contact_name": "Sneha Kapoor",
            "company": "Groww",
            "description": "Note inferred from email thread: 'Replied to security questionnaire. Mentioned 2-week legal review process.'",
            "payload": {"note": "Replied to security questionnaire. 2-week legal review in progress.", "source": "gmail"},
            "requires_approval": True,
            "approved": False,
            "created_at": _hours_ago(8),
        },
        {
            "id": "p5",
            "action_type": "contact",
            "contact_name": "Rohan Verma",
            "company": "Swiggy",
            "description": "New contact detected via calendar invite from Vikram Nair. Rohan Verma — Head of Product, Swiggy.",
            "payload": {"email": "rohan.verma@swiggy.in", "role": "Head of Product", "referred_by": "Vikram Nair"},
            "requires_approval": True,
            "approved": False,
            "created_at": _hours_ago(12),
        },
    ]


def get_demo_email_digest() -> List[Dict[str, Any]]:
    return [
        {
            "id": "e1",
            "thread_id": "thread_001",
            "contact_name": "Arjun Malhotra",
            "company": "Kira Health",
            "subject": "Re: Pilot proposal — week 2 check-in",
            "thread_count": 6,
            "last_message": _days_ago(3),
            "reply_latency_hours": 4.2,
            "signal": "Positive momentum — 6 replies in 5 days",
            "sentiment": "positive",
            "is_inferred": True,
            "confidence": 87,
        },
        {
            "id": "e2",
            "thread_id": "thread_002",
            "contact_name": "Sneha Kapoor",
            "company": "Groww",
            "subject": "Security & compliance questionnaire",
            "thread_count": 4,
            "last_message": _days_ago(7),
            "reply_latency_hours": 18.5,
            "signal": "Slowing — 7 day gap since last reply",
            "sentiment": "neutral",
            "is_inferred": True,
            "confidence": 72,
        },
        {
            "id": "e3",
            "thread_id": "thread_003",
            "contact_name": "Priya Sharma",
            "company": "Meesho",
            "subject": "Re: Contract review — final terms",
            "thread_count": 9,
            "last_message": _days_ago(1),
            "reply_latency_hours": 1.8,
            "signal": "High velocity — fast replies, close to closing",
            "sentiment": "positive",
            "is_inferred": True,
            "confidence": 95,
        },
        {
            "id": "e4",
            "thread_id": "thread_004",
            "contact_name": "Vikram Nair",
            "company": "Razorpay",
            "subject": "Intro: Platform partnership discussion",
            "thread_count": 3,
            "last_message": _days_ago(5),
            "reply_latency_hours": 24.0,
            "signal": "Active — waiting on CTO introduction",
            "sentiment": "neutral",
            "is_inferred": False,
            "confidence": 90,
        },
        {
            "id": "e5",
            "thread_id": "thread_005",
            "contact_name": "Amit Patel",
            "company": "PharmEasy",
            "subject": "Proposal: Q3 enterprise rollout",
            "thread_count": 2,
            "last_message": _days_ago(18),
            "reply_latency_hours": None,
            "signal": "No reply to proposal in 18 days — at risk",
            "sentiment": "negative",
            "is_inferred": True,
            "confidence": 82,
        },
    ]


def get_demo_meetings() -> List[Dict[str, Any]]:
    return [
        {
            "id": "m1",
            "title": "Intro call with Rohan Verma (Swiggy)",
            "participants": ["rohan.verma@swiggy.in", "founder@demostartup.in"],
            "start_time": _hours_from_now(2),
            "end_time": _hours_from_now(2.5),
            "duration_mins": 30,
        },
        {
            "id": "m2",
            "title": "Demo: Neha Joshi & CRED team",
            "participants": ["neha@cred.club", "cto@cred.club", "cfo@cred.club", "founder@demostartup.in"],
            "start_time": _hours_from_now(5),
            "end_time": _hours_from_now(6),
            "duration_mins": 60,
        },
    ]
