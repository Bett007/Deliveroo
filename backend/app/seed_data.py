from decimal import Decimal

from app.extensions import db
from app.models import Location, WeightCategory

DEFAULT_LOCATIONS = [
    {
        "address": "Westlands Pickup Hub, Waiyaki Way",
        "city": "Nairobi",
        "country": "Kenya",
        "latitude": Decimal("-1.2676000"),
        "longitude": Decimal("36.8108000"),
    },
    {
        "address": "Kilimani Dispatch Point, Ngong Road",
        "city": "Nairobi",
        "country": "Kenya",
        "latitude": Decimal("-1.2921000"),
        "longitude": Decimal("36.7831000"),
    },
    {
        "address": "CBD Customer Desk, Kenyatta Avenue",
        "city": "Nairobi",
        "country": "Kenya",
        "latitude": Decimal("-1.2864000"),
        "longitude": Decimal("36.8172000"),
    },
    {
        "address": "Mombasa Town Office, Nkrumah Road",
        "city": "Mombasa",
        "country": "Kenya",
        "latitude": Decimal("-4.0435000"),
        "longitude": Decimal("39.6682000"),
    },
    {
        "address": "Kisumu Collection Point, Oginga Odinga Street",
        "city": "Kisumu",
        "country": "Kenya",
        "latitude": Decimal("-0.0917000"),
        "longitude": Decimal("34.7680000"),
    },
]

DEFAULT_WEIGHT_CATEGORIES = [
    {
        "name": "light",
        "min_weight": Decimal("0.00"),
        "max_weight": Decimal("2.00"),
        "base_price": Decimal("250.00"),
    },
    {
        "name": "medium",
        "min_weight": Decimal("2.01"),
        "max_weight": Decimal("10.00"),
        "base_price": Decimal("450.00"),
    },
    {
        "name": "heavy",
        "min_weight": Decimal("10.01"),
        "max_weight": Decimal("25.00"),
        "base_price": Decimal("900.00"),
    },
]


def seed_reference_data():
    created_locations = 0
    created_weight_categories = 0

    for payload in DEFAULT_LOCATIONS:
        location = Location.query.filter_by(address=payload["address"]).first()
        if location is None:
            db.session.add(Location(**payload))
            created_locations += 1

    for payload in DEFAULT_WEIGHT_CATEGORIES:
        category = WeightCategory.query.filter_by(name=payload["name"]).first()
        if category is None:
            db.session.add(WeightCategory(**payload))
            created_weight_categories += 1

    db.session.commit()

    return {
        "locations_created": created_locations,
        "weight_categories_created": created_weight_categories,
        "total_locations": Location.query.count(),
        "total_weight_categories": WeightCategory.query.count(),
    }
