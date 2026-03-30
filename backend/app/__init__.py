import os

from flask import Flask

from .config import config_by_name
from .errors.handlers import register_error_handlers
from .extensions import cors, db, migrate
from .routes.auth import auth_bp
from .routes.docs import docs_bp
from .routes.health import health_bp


def create_app(config_name: str | None = None) -> Flask:
    if config_name is None:
        config_name = os.getenv("APP_ENV") or os.getenv("FLASK_ENV", "development")

    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])

    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(
        app,
        resources={r"/api/*": {"origins": app.config["CLIENT_ORIGIN"]}},
    )

    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(docs_bp, url_prefix="/api/docs")
    register_error_handlers(app)

    return app
