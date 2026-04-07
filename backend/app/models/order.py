from datetime import datetime, timezone

from app.extensions import db


class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    parcel_id = db.Column(db.Integer, db.ForeignKey("parcels.id"), nullable=False, index=True)
    pickup_location_id = db.Column(db.Integer, db.ForeignKey("locations.id"), nullable=False, index=True)
    delivery_location_id = db.Column(db.Integer, db.ForeignKey("locations.id"), nullable=False, index=True)
    current_location_id = db.Column(db.Integer, db.ForeignKey("locations.id"), nullable=True, index=True)
    quoted_price = db.Column(db.Numeric(10, 2), nullable=False)
    distance_km = db.Column(db.Numeric(10, 2), nullable=True)
    estimated_duration_minutes = db.Column(db.Integer, nullable=True)
    status = db.Column(db.String(30), nullable=False, default="pending")
    created_at = db.Column(
        db.DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc)
    )

    user = db.relationship("User", back_populates="orders")
    parcel = db.relationship("Parcel", back_populates="orders")
    pickup_location = db.relationship("Location", foreign_keys=[pickup_location_id])
    delivery_location = db.relationship("Location", foreign_keys=[delivery_location_id])
    current_location = db.relationship("Location", foreign_keys=[current_location_id])
    tracking_updates = db.relationship("TrackingUpdate", back_populates="order", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "parcel_id": self.parcel_id,
            "pickup_location_id": self.pickup_location_id,
            "delivery_location_id": self.delivery_location_id,
            "current_location_id": self.current_location_id,
            "quoted_price": float(self.quoted_price),
            "distance_km": float(self.distance_km) if self.distance_km is not None else None,
            "estimated_duration_minutes": self.estimated_duration_minutes,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
