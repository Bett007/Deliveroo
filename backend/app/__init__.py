from flask import Flask

from .config import config_by_name
from .extensions import cors, db, migrate
from .routes.health import health_bp


def create_app(config_name: str = "development") -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])

    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(
        app,
        resources={r"/api/*": {"origins": app.config["CLIENT_ORIGIN"]}},
    )

    app.register_blueprint(health_bp, url_prefix="/api")

    return app
