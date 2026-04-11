"""add user verification fields

Revision ID: 20260409_01
Revises: 20260408_01
Create Date: 2026-04-09 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "20260409_01"
down_revision = "20260408_01"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "users",
        sa.Column("is_verified", sa.Boolean(), nullable=False, server_default=sa.false()),
    )
    op.add_column("users", sa.Column("verification_code", sa.String(length=6), nullable=True))
    op.add_column(
        "users",
        sa.Column("verification_code_expires_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.alter_column("users", "is_verified", server_default=None)


def downgrade():
    op.drop_column("users", "verification_code_expires_at")
    op.drop_column("users", "verification_code")
    op.drop_column("users", "is_verified")
