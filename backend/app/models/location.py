from datetime import datetime, timezone

from app.extensions import db


class Location(db.Model):
    __tablename__ = "locations"

    id = db.Column(db.Integer, primary_key=True)
    address = db.Column(db.Text, nullable=False)
    city = db.Column(db.String(100), nullable=True)
    country = db.Column(db.String(100), nullable=True)
    latitude = db.Column(db.Numeric(10, 7), nullable=False)
    longitude = db.Column(db.Numeric(10, 7), nullable=False)
    created_at = db.Column(
        db.DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    def to_dict(self):
        return {
            "id": self.id,
            "address": self.address,
            "city": self.city,
            "country": self.country,
            "latitude": float(self.latitude),
            "longitude": float(self.longitude),
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
