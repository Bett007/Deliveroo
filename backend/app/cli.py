from pathlib import Path

import click
from sqlalchemy import inspect, text
from sqlalchemy.engine import make_url

from app.extensions import db
from app.seed_data import seed_reference_data


def register_cli_commands(app):
    @app.cli.command("ensure-local-db")
    def ensure_local_db_command():
        """Check local SQLite DB file, create it if missing, and initialize tables."""
        database_uri = app.config.get("SQLALCHEMY_DATABASE_URI")

        if not database_uri:
            raise click.ClickException("SQLALCHEMY_DATABASE_URI is not configured.")

        parsed = make_url(database_uri)
        if parsed.drivername != "sqlite" or parsed.database in (None, "", ":memory:"):
            click.echo(
                "Configured database is not a file-based local SQLite database. "
                "Nothing to create."
            )
            return

        path_obj = Path(parsed.database)
        file_created = False

        if path_obj.exists():
            click.echo(f"Local database already exists at: {path_obj}")
        else:
            path_obj.parent.mkdir(parents=True, exist_ok=True)
            path_obj.touch()
            file_created = True
            click.echo(f"Created local database file at: {path_obj}")

        db.create_all()
        current_tables = inspect(db.engine).get_table_names()
        click.echo(f"Local schema ready. Tables available: {len(current_tables)}")

        if not file_created:
            click.echo("No new DB file was created in this run.")

    @app.cli.command("verify-db")
    def verify_db_command():
        """Check that the configured database is reachable."""
        db.session.execute(text("SELECT 1"))
        click.echo("Database connection verified successfully.")

    @app.cli.command("seed-reference-data")
    def seed_reference_data_command():
        """Seed starter locations and weight categories."""
        stats = seed_reference_data()
        click.echo(
            "Seed completed. "
            f"Locations created: {stats['locations_created']}, "
            f"weight categories created: {stats['weight_categories_created']}, "
            f"total locations: {stats['total_locations']}, "
            f"total weight categories: {stats['total_weight_categories']}."
        )
