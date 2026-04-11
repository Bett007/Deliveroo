"""add rider assignment fields

Revision ID: 20260411_01
Revises: 20260409_01
Create Date: 2026-04-11 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


revision = "20260411_01"
down_revision = "20260409_01"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("orders", sa.Column("assigned_rider_id", sa.Integer(), nullable=True))
    op.add_column("orders", sa.Column("assigned_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("orders", sa.Column("picked_up_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("orders", sa.Column("delivered_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("orders", sa.Column("cancelled_at", sa.DateTime(timezone=True), nullable=True))
    op.create_foreign_key(
        "fk_orders_assigned_rider",
        "orders",
        "users",
        ["assigned_rider_id"],
        ["id"],
        ondelete="SET NULL",
    )
    op.create_index("ix_orders_assigned_rider_id", "orders", ["assigned_rider_id"])
    op.create_index("ix_orders_status_assigned_rider_id", "orders", ["status", "assigned_rider_id"])
    op.create_check_constraint(
        "ck_orders_status",
        "orders",
        "status IN ('pending', 'confirmed', 'in_transit', 'delivered', 'cancelled')",
    )

    op.execute(
        """
        CREATE OR REPLACE FUNCTION ensure_assigned_rider_role()
        RETURNS trigger AS $$
        BEGIN
          IF NEW.assigned_rider_id IS NOT NULL AND NOT EXISTS (
            SELECT 1 FROM users WHERE id = NEW.assigned_rider_id AND role = 'rider'
          ) THEN
            RAISE EXCEPTION 'assigned_rider_id must reference a user with role rider';
          END IF;

          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        """
    )
    op.execute(
        """
        CREATE TRIGGER trg_orders_assigned_rider_role
        BEFORE INSERT OR UPDATE OF assigned_rider_id ON orders
        FOR EACH ROW
        EXECUTE FUNCTION ensure_assigned_rider_role();
        """
    )


def downgrade():
    op.execute("DROP TRIGGER IF EXISTS trg_orders_assigned_rider_role ON orders;")
    op.execute("DROP FUNCTION IF EXISTS ensure_assigned_rider_role();")
    op.drop_constraint("ck_orders_status", "orders", type_="check")
    op.drop_index("ix_orders_status_assigned_rider_id", table_name="orders")
    op.drop_index("ix_orders_assigned_rider_id", table_name="orders")
    op.drop_constraint("fk_orders_assigned_rider", "orders", type_="foreignkey")
    op.drop_column("orders", "cancelled_at")
    op.drop_column("orders", "delivered_at")
    op.drop_column("orders", "picked_up_at")
    op.drop_column("orders", "assigned_at")
    op.drop_column("orders", "assigned_rider_id")
