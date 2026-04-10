"""initial schema

Revision ID: 20260408_01
Revises:
Create Date: 2026-04-08 12:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "20260408_01"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "locations",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("address", sa.Text(), nullable=False),
        sa.Column("city", sa.String(length=100), nullable=True),
        sa.Column("country", sa.String(length=100), nullable=True),
        sa.Column("latitude", sa.Numeric(precision=10, scale=7), nullable=False),
        sa.Column("longitude", sa.Numeric(precision=10, scale=7), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("role", sa.String(length=50), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)

    op.create_table(
        "weight_categories",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=50), nullable=False),
        sa.Column("min_weight", sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column("max_weight", sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column("base_price", sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "parcels",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("weight", sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column("weight_category_id", sa.Integer(), nullable=False),
        sa.Column("image_url", sa.Text(), nullable=True),
        sa.Column("special_instructions", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["weight_category_id"], ["weight_categories.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_parcels_weight_category_id"), "parcels", ["weight_category_id"], unique=False)

    op.create_table(
        "orders",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("parcel_id", sa.Integer(), nullable=False),
        sa.Column("pickup_location_id", sa.Integer(), nullable=False),
        sa.Column("delivery_location_id", sa.Integer(), nullable=False),
        sa.Column("current_location_id", sa.Integer(), nullable=True),
        sa.Column("quoted_price", sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column("distance_km", sa.Numeric(precision=10, scale=2), nullable=True),
        sa.Column("estimated_duration_minutes", sa.Integer(), nullable=True),
        sa.Column("status", sa.String(length=30), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["current_location_id"], ["locations.id"]),
        sa.ForeignKeyConstraint(["delivery_location_id"], ["locations.id"]),
        sa.ForeignKeyConstraint(["parcel_id"], ["parcels.id"]),
        sa.ForeignKeyConstraint(["pickup_location_id"], ["locations.id"]),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_orders_current_location_id"), "orders", ["current_location_id"], unique=False)
    op.create_index(op.f("ix_orders_delivery_location_id"), "orders", ["delivery_location_id"], unique=False)
    op.create_index(op.f("ix_orders_parcel_id"), "orders", ["parcel_id"], unique=False)
    op.create_index(op.f("ix_orders_pickup_location_id"), "orders", ["pickup_location_id"], unique=False)
    op.create_index(op.f("ix_orders_user_id"), "orders", ["user_id"], unique=False)

    op.create_table(
        "tracking_updates",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("order_id", sa.Integer(), nullable=False),
        sa.Column("location_id", sa.Integer(), nullable=True),
        sa.Column("status", sa.String(length=30), nullable=False),
        sa.Column("note", sa.Text(), nullable=True),
        sa.Column("updated_by", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["location_id"], ["locations.id"]),
        sa.ForeignKeyConstraint(["order_id"], ["orders.id"]),
        sa.ForeignKeyConstraint(["updated_by"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_tracking_updates_location_id"), "tracking_updates", ["location_id"], unique=False)
    op.create_index(op.f("ix_tracking_updates_order_id"), "tracking_updates", ["order_id"], unique=False)
    op.create_index(op.f("ix_tracking_updates_updated_by"), "tracking_updates", ["updated_by"], unique=False)


def downgrade():
    op.drop_index(op.f("ix_tracking_updates_updated_by"), table_name="tracking_updates")
    op.drop_index(op.f("ix_tracking_updates_order_id"), table_name="tracking_updates")
    op.drop_index(op.f("ix_tracking_updates_location_id"), table_name="tracking_updates")
    op.drop_table("tracking_updates")

    op.drop_index(op.f("ix_orders_user_id"), table_name="orders")
    op.drop_index(op.f("ix_orders_pickup_location_id"), table_name="orders")
    op.drop_index(op.f("ix_orders_parcel_id"), table_name="orders")
    op.drop_index(op.f("ix_orders_delivery_location_id"), table_name="orders")
    op.drop_index(op.f("ix_orders_current_location_id"), table_name="orders")
    op.drop_table("orders")

    op.drop_index(op.f("ix_parcels_weight_category_id"), table_name="parcels")
    op.drop_table("parcels")

    op.drop_table("weight_categories")

    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.drop_table("users")

    op.drop_table("locations")
