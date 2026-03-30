# Backend

This folder contains the Flask backend starter for Deliveroo. The goal at this stage is just to give the team a clean structure, PostgreSQL-ready config, and a simple API check.

## Create And Activate A Virtual Environment

```bash
python -m venv .venv
source .venv/bin/activate
```

On Windows PowerShell:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

## Install Dependencies

```bash
pip install -r requirements.txt
```

## Set Environment Variables

Copy the example file and update values for your machine:

```bash
cp .env.example .env
```

Main variables used right now:

- `APP_ENV` sets the app config (`development` or `production`)
- `SECRET_KEY` for Flask config
- `DATABASE_URL` for the PostgreSQL connection string
- `CLIENT_ORIGIN` for frontend CORS access

## PostgreSQL Setup

The app reads the database connection from `DATABASE_URL`.

Example format:

```text
postgresql://username:password@localhost:5432/deliveroo_dev
```

The starter backend is ready to point at PostgreSQL through that variable, but it does not create application tables yet because schema work is outside this setup task.

If you use Supabase or another hosted PostgreSQL service, make sure the connection string includes the provider's required SSL settings.

## Run The Backend

```bash
python run.py
```

The starter health endpoint is available at `GET /api/health`.

## Render Notes

If you deploy this backend on Render as a web service, use:

```text
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: gunicorn run:app
```

Recommended Render environment variables:

- `APP_ENV=production`
- `SECRET_KEY=<your secret>`
- `DATABASE_URL=<your hosted postgres url>`
- `CLIENT_ORIGIN=<your frontend url>`

## Run Tests

```bash
pytest
```

## Folder Structure

```text
app/
├── __init__.py   # app factory
├── config.py     # environment-based settings
├── extensions.py # Flask extensions
├── routes/       # API routes
├── models/       # SQLAlchemy models later
├── services/     # business logic later
├── utils/        # helper utilities later
└── errors/       # custom error handling later
```

## Current Status

The backend currently includes:

- Flask app factory setup
- Flask-SQLAlchemy and Flask-Migrate wiring
- CORS setup for the frontend
- one health-check route
- one basic pytest test

Authentication, parcel logic, and other application features are still intentionally out of scope.
