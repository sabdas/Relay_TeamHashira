from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.database import engine, Base
from app.routers import auth, users, integrations, gmail, calendar, notion, deals, contacts, today, pending, demo


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Relay API",
    description="Founder deal memory system — reconstructs deal activity from Gmail, Calendar, and Notion",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://relay.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(integrations.router, prefix="/api/integrations", tags=["integrations"])
app.include_router(gmail.router, prefix="/api/gmail", tags=["gmail"])
app.include_router(calendar.router, prefix="/api/calendar", tags=["calendar"])
app.include_router(notion.router, prefix="/api/notion", tags=["notion"])
app.include_router(deals.router, prefix="/api/deals", tags=["deals"])
app.include_router(contacts.router, prefix="/api/contacts", tags=["contacts"])
app.include_router(today.router, prefix="/api/today", tags=["today"])
app.include_router(pending.router, prefix="/api/pending", tags=["pending"])
app.include_router(demo.router, prefix="/api/demo", tags=["demo"])


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "relay-api"}


@app.get("/")
async def root():
    return {"message": "Relay API — Founder Deal Memory System", "docs": "/docs"}
