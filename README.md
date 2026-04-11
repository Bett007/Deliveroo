# Deliveroo

Deliveroo is a team capstone project for a courier delivery platform. This repo currently contains the basic frontend and backend setup so the team can start building on a clean shared foundation.

## Stack

- Frontend: React, Vite, React Router, Redux Toolkit
- Backend: Flask, Flask-SQLAlchemy, Flask-Migrate
- Database: PostgreSQL
- Testing: Pytest now, frontend testing can be added once the first real UI behavior needs coverage

## Repo Structure

```text
Deliveroo/
├── frontend/
├── backend/
└── README.md
```

## Branch Workflow

- `main` should stay stable.
- Active team development should happen on `dev` unless the team is told otherwise.
- Create feature branches from `dev` and open pull requests back into `dev`.
- Merge into `main` only when the team is ready for a stable milestone.

## Run The Project Locally

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python run.py
```

The backend runs on `http://127.0.0.1:5001` by default. The starter API check is available at `GET /api/health`.

## Environment Notes

- Frontend values should go in `frontend/.env`.
- Backend values should go in `backend/.env`.
- Do not commit real environment files or secrets.

## Current Scope

This setup only covers the project foundation:

- basic React app shell and routing
- Redux store wiring
- Flask app factory and health endpoint
- PostgreSQL-ready environment configuration
- basic backend test setup

Feature work like auth, parcel flows, Swagger, SendGrid, Cloudinary, deployment, and CI/CD is intentionally left for later.
