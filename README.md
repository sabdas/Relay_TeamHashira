# Relay — Founder Deal Memory System

Relay automatically reconstructs deal activity from Gmail, Calendar, and Notion,
turning scattered signals into a daily action surface called **Today View**.

## Quick Start

### 1. Clone & configure

```bash
cp .env.example .env
# Edit .env with your credentials
```

### 2. Docker Compose (recommended)

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API docs: http://localhost:8000/docs

### 3. Try Demo Mode

Click **Try Demo** on the landing page — no credentials required.
Uses mock data for "Not So Pareshan Founder" at "Demo Startup".

---

## Local Development

### Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Start PostgreSQL, then:
alembic upgrade head
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Architecture

- **Frontend**: Next.js 14 App Router + TypeScript + Tailwind CSS
- **Backend**: FastAPI + SQLAlchemy + PostgreSQL
- **Auth**: Google OAuth2 + JWT
- **Privacy**: Gmail body NEVER read — metadata only (sender, subject, timestamps)

## Privacy Principles

1. Email body content is never requested, stored, or processed
2. Notion writes are append-only — existing content is never overwritten
3. All OAuth tokens are encrypted at rest (Fernet)
4. All inferred actions require explicit user approval before saving
