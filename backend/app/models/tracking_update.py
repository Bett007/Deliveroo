from datetime import datetime, timezone

from app.extensions import db


class TrackingUpdate(db.Model):
    __tablename__ = "tracking_updates"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False, index=True)
    location_id = db.Column(db.Integer, db.ForeignKey("locations.id"), nullable=True, index=True)
    status = db.Column(db.String(30), nullable=False)
    note = db.Column(db.Text, nullable=True)
    updated_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    created_at = db.Column(
        db.DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    order = db.relationship("Order", back_populates="tracking_updates")
    location = db.relationship("Location", foreign_keys=[location_id])
    updater = db.relationship("User", foreign_keys=[updated_by])

    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "location_id": self.location_id,
            "status": self.status,
            "note": self.note,
            "updated_by": self.updated_by,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
