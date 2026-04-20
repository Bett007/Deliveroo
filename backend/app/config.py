import os
import re
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()


def _parse_client_origins(value: str):
    origins = []

    for origin in value.split(","):
        parsed = origin.strip()
        if not parsed:
            continue

        # Allow wildcard entries such as https://*.vercel.app
        if "*" in parsed:
            wildcard_pattern = re.escape(parsed).replace(r"\*", r"[^/]+")
            origins.append(re.compile(rf"^{wildcard_pattern}$"))
            continue

        # Optional escape hatch for fully custom regex values.
        # Example: regex:^https://preview-[a-z0-9-]+\.example\.com$
        if parsed.startswith("regex:"):
            pattern = parsed.removeprefix("regex:").strip()
            if pattern:
                origins.append(re.compile(pattern))
            continue

        origins.append(parsed)

    return origins


def _as_bool(value: str, default: bool = False) -> bool:
    if value is None:
        return default

    return value.strip().lower() in {"1", "true", "yes", "on"}


def _resolve_dev_local_sqlite_uri() -> str:
    default_db_path = Path(__file__).resolve().parents[1] / "instance" / "deliveroo_dev.sqlite3"
    configured_path = os.getenv("LOCAL_DATABASE_PATH", str(default_db_path))
    db_path = Path(configured_path).expanduser()

    # Resolve relative paths against backend/app to keep behavior deterministic across callers.
    if not db_path.is_absolute():
        db_path = (Path(__file__).resolve().parents[1] / db_path).resolve()

    return f"sqlite:///{db_path}"


def _resolve_database_uri() -> str:
    app_env = (os.getenv("APP_ENV") or os.getenv("FLASK_ENV", "development")).strip().lower()
    configured_database_url = (os.getenv("DATABASE_URL") or "").strip()

    if app_env == "development":
        # Safety-first default for local development: use a local SQLite DB unless explicitly disabled.
        use_local_db = _as_bool(os.getenv("USE_LOCAL_DB"), default=True)
        if use_local_db:
            return _resolve_dev_local_sqlite_uri()

    if configured_database_url:
        return configured_database_url

    return "postgresql://postgres:postgres@localhost:5432/deliveroo_dev"


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "change-me")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", SECRET_KEY)
    JWT_ACCESS_TOKEN_EXPIRES_MINUTES = int(
        os.getenv("JWT_ACCESS_TOKEN_EXPIRES_MINUTES", "60")
    )
    SQLALCHEMY_DATABASE_URI = _resolve_database_uri()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CLIENT_ORIGIN = os.getenv("CLIENT_ORIGIN", "http://localhost:5173")
    CLIENT_ORIGINS = _parse_client_origins(CLIENT_ORIGIN)
    TESTING = False
    DEBUG = False


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    DEBUG = True


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False


config_by_name = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "testing": TestingConfig,
}
