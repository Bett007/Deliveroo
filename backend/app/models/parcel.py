from datetime import datetime, timezone

from app.extensions import db


class Parcel(db.Model):
    __tablename__ = "parcels"

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.Text, nullable=False)
    weight = db.Column(db.Numeric(10, 2), nullable=False)
    weight_category_id = db.Column(db.Integer, db.ForeignKey("weight_categories.id"), nullable=False, index=True)
    image_url = db.Column(db.Text, nullable=True)
    special_instructions = db.Column(db.Text, nullable=True)
    created_at = db.Column(
        db.DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc)
    )

    weight_category = db.relationship("WeightCategory", back_populates="parcels")
    orders = db.relationship("Order", back_populates="parcel", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "description": self.description,
            "weight": float(self.weight),
            "weight_category_id": self.weight_category_id,
            "image_url": self.image_url,
            "special_instructions": self.special_instructions,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
