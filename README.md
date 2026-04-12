# Deliveroo

Deliveroo is a team capstone courier-delivery platform with role-based workspaces for customers, riders, and admins.

## Stack

- Frontend: React, Vite, React Router, Redux Toolkit
- Backend: Flask, Flask-SQLAlchemy, Flask-Migrate
- Database: PostgreSQL
- Testing: Pytest (backend), frontend build verification with Vite

## Repo Structure

```text
Deliveroo/
├── frontend/
├── backend/
└── README.md
```

## Current Product Scope

- JWT auth with role-based routing (`customer`, `rider`, `admin`)
- Email verification demo flow (`register -> verify -> login`)
- Customer flow:
  - create order
  - view active orders
  - track order route/details
  - view order history
- Rider flow:
  - rider board for assignment and route updates
- Admin flow:
  - operations dashboard
  - dispatch queue and order controls
- Shared pages:
  - profile management
  - help/support center

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

If `python` is not available in your shell (common with `pyenv`), configure and confirm first:

```bash
pyenv global 3.10.14
python --version
which python
```

## Environment Notes

- Frontend values should go in `frontend/.env`.
- Backend values should go in `backend/.env`.
- Do not commit real environment files or secrets.
