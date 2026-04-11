import click
from sqlalchemy import text

from app.extensions import db
from app.seed_data import seed_reference_data


def register_cli_commands(app):
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
