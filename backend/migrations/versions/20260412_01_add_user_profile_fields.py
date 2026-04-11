"""add user profile fields

Revision ID: 20260412_01
Revises: 20260411_01
Create Date: 2026-04-12 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


revision = "20260412_01"
down_revision = "20260411_01"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("users", sa.Column("first_name", sa.String(length=120), nullable=True))
    op.add_column("users", sa.Column("last_name", sa.String(length=120), nullable=True))
    op.add_column("users", sa.Column("phone", sa.String(length=40), nullable=True))
    op.add_column("users", sa.Column("avatar_url", sa.Text(), nullable=True))


def downgrade():
    op.drop_column("users", "avatar_url")
    op.drop_column("users", "phone")
    op.drop_column("users", "last_name")
    op.drop_column("users", "first_name")
