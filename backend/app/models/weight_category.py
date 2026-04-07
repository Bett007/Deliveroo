from datetime import datetime, timezone

from app.extensions import db


class WeightCategory(db.Model):
    __tablename__ = "weight_categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    min_weight = db.Column(db.Numeric(10, 2), nullable=False)
    max_weight = db.Column(db.Numeric(10, 2), nullable=False)
    base_price = db.Column(db.Numeric(10, 2), nullable=False)
    created_at = db.Column(
        db.DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    parcels = db.relationship("Parcel", back_populates="weight_category", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "min_weight": float(self.min_weight),
            "max_weight": float(self.max_weight),
            "base_price": float(self.base_price),
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
