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
- `JWT_SECRET_KEY` for signing JWT access tokens
- `JWT_ACCESS_TOKEN_EXPIRES_MINUTES` for auth token lifetime
- `DATABASE_URL` for the PostgreSQL connection string
- `CLIENT_ORIGIN` for frontend CORS access. You can provide a comma-separated list for multiple frontend origins.

## PostgreSQL Setup

The app reads the database connection from `DATABASE_URL`.

Example format:

```text
postgresql://username:password@localhost:5432/deliveroo_dev
```

For Supabase migrations, prefer the direct database connection string instead of the pooled connection string and include `sslmode=require`.

Example format:

```text
postgresql://postgres.<project-ref>:<password>@db.<project-ref>.supabase.co:5432/postgres?sslmode=require
```

### Run Migrations

With your virtualenv active and `.env` configured:

```bash
flask db upgrade
```

This applies the initial schema and creates:

- `users`
- `locations`
- `weight_categories`
- `parcels`
- `orders`
- `tracking_updates`

### Verify The Database Connection

```bash
flask verify-db
```

### Seed Initial Reference Data

```bash
flask seed-reference-data
```

The seed command is idempotent and inserts starter:

- locations
- weight categories (`light`, `medium`, `heavy`)

### Recommended Section 1 Flow For Supabase

1. Copy `.env.example` to `.env`.
2. Paste your Supabase direct Postgres URL into `DATABASE_URL`.
3. If you are working from an NTFS external drive on macOS, run Flask commands through the cleanup wrapper so AppleDouble sidecar files do not break Alembic:

```bash
./scripts/run_clean.sh flask verify-db
./scripts/run_clean.sh flask db upgrade
./scripts/run_clean.sh flask seed-reference-data
```

4. Otherwise run `flask verify-db`.
5. Run `flask db upgrade`.
6. Run `flask seed-reference-data`.
7. In Supabase Table Editor or SQL, confirm the six tables exist and that `locations` and `weight_categories` contain starter rows.

## Run The Backend

```bash
python run.py
```

Current implemented endpoints:

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/auth/admin-check`
- `GET /api/docs/swagger.json`

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

Example with local and deployed frontend origins:

```text
CLIENT_ORIGIN=http://localhost:5173,https://deliveroo-tan.vercel.app
```

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

## Auth API Reference

### Register

`POST /api/auth/register`

Request body:

```json
{
  "email": "user@example.com",
  "password": "Password123",
  "role": "customer"
}
```

Success response:

```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "customer",
      "created_at": "2026-03-30T12:00:00+00:00"
    }
  }
}
```

### Login

`POST /api/auth/login`

Request body:

```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

Success response:

```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "access_token": "<jwt>",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "customer",
      "created_at": "2026-03-30T12:00:00+00:00"
    }
  }
}
```

### Protected Routes

Use the access token in the `Authorization` header:

```text
Authorization: Bearer <jwt>
```

- `GET /api/auth/me` returns the authenticated user.
- `GET /api/auth/admin-check` verifies admin-only access.

### Error Format

Validation and auth errors return predictable JSON:

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": {
    "email": ["A user with this email already exists."]
  }
}
```

Swagger-compatible documentation for the implemented endpoints is available at `GET /api/docs/swagger.json`.
