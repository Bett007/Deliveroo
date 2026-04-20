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

If `python` is not found because of `pyenv`, set and verify your global version first:

```bash
pyenv global 3.10.14
python --version
which python
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
- `USE_LOCAL_DB` when `true` (default in development), uses a local SQLite DB instead of `DATABASE_URL`
- `LOCAL_DATABASE_PATH` optional path for the local SQLite DB file
- `DATABASE_URL` for PostgreSQL (used when `USE_LOCAL_DB=false` in development, or in production)
- `CLIENT_ORIGIN` for frontend CORS access. You can provide a comma-separated list for multiple frontend origins.
  Wildcards are supported (for example `https://*.vercel.app`).

## Local Development Database (Recommended)

By default, development uses a local SQLite file so no one accidentally writes to Supabase.

1. Copy `.env.example` to `.env`.
2. Keep `USE_LOCAL_DB=true`.
3. Initialize local DB file and schema:

```bash
flask ensure-local-db
```

4. Seed reference data:

```bash
flask seed-reference-data
```

5. Seed demo accounts and orders:

```bash
flask seed-demo-data
```

This command checks whether the local DB file exists, creates it if missing, and initializes tables.

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

### Run Migrations (PostgreSQL)

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

### Seed Demo Users And Orders

Run:

```bash
flask seed-demo-data
```

This command is idempotent and seeds:

- 3 customer users
- 2 rider users
- 1 admin user
- sample orders tied to the seeded customer accounts (with mixed statuses)

Demo credentials:

| Role | Email | Password |
|---|---|---|
| Customer | `customer.one@deliveroo.demo` | `Customer123!` |
| Customer | `customer.two@deliveroo.demo` | `Customer123!` |
| Customer | `customer.three@deliveroo.demo` | `Customer123!` |
| Rider | `rider.one@deliveroo.demo` | `Rider123!` |
| Rider | `rider.two@deliveroo.demo` | `Rider123!` |
| Admin | `admin@deliveroo.demo` | `Admin123!` |

Admin access note:

- Admin account creation is not exposed on frontend sign-up.
- Use the seeded admin account to sign in, then open admin URLs directly (for example `/admin/dashboard`).

### Recommended Section 1 Flow For Supabase

1. Copy `.env.example` to `.env`.
2. Set `USE_LOCAL_DB=false`.
3. Paste your Supabase direct Postgres URL into `DATABASE_URL`.
4. If you are working from an NTFS external drive on macOS, run Flask commands through the cleanup wrapper so AppleDouble sidecar files do not break Alembic:

```bash
./scripts/run_clean.sh flask verify-db
./scripts/run_clean.sh flask db upgrade
./scripts/run_clean.sh flask seed-reference-data
```

5. Otherwise run `flask verify-db`.
6. Run `flask db upgrade`.
7. Run `flask seed-reference-data`.
8. In Supabase Table Editor or SQL, confirm the six tables exist and that `locations` and `weight_categories` contain starter rows.

## Run The Backend

```bash
python run.py
```

Current implemented endpoints:

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/verify`
- `POST /api/auth/resend-verification`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/auth/admin-check`
- `GET /api/orders/`
- `POST /api/orders/`
- `GET /api/orders/<order_id>`
- `PATCH /api/orders/<order_id>/destination`
- `PATCH /api/orders/<order_id>/cancel`
- `PATCH /api/orders/<order_id>/status`
- `PATCH /api/orders/<order_id>/location`
- `GET /api/tracking/<order_id>`
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
CLIENT_ORIGIN=http://localhost:5173,https://*.vercel.app
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
- role-based auth and JWT protection
- email verification demo endpoints
- orders and tracking endpoints
- Swagger JSON docs endpoint
- pytest setup for backend tests

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
