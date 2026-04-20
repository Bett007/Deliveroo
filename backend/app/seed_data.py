from datetime import datetime, timedelta, timezone
from decimal import Decimal

from app.extensions import db
from app.models import Location, Order, Parcel, User, WeightCategory

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
    {
        "address": "Karen Dispatch Stop, Langata Road",
        "city": "Nairobi",
        "country": "Kenya",
        "latitude": Decimal("-1.3200000"),
        "longitude": Decimal("36.6850000"),
    },
    {
        "address": "Upper Hill Operations Bay, Elgon Road",
        "city": "Nairobi",
        "country": "Kenya",
        "latitude": Decimal("-1.3024000"),
        "longitude": Decimal("36.8148000"),
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

DEMO_USERS = [
    {
        "email": "customer.one@deliveroo.demo",
        "password": "Customer123!",
        "role": "customer",
        "first_name": "Amina",
        "last_name": "Otieno",
    },
    {
        "email": "customer.two@deliveroo.demo",
        "password": "Customer123!",
        "role": "customer",
        "first_name": "Brian",
        "last_name": "Mwangi",
    },
    {
        "email": "customer.three@deliveroo.demo",
        "password": "Customer123!",
        "role": "customer",
        "first_name": "Caroline",
        "last_name": "Njeri",
    },
    {
        "email": "rider.one@deliveroo.demo",
        "password": "Rider123!",
        "role": "rider",
        "first_name": "David",
        "last_name": "Kiptoo",
    },
    {
        "email": "rider.two@deliveroo.demo",
        "password": "Rider123!",
        "role": "rider",
        "first_name": "Esther",
        "last_name": "Wambui",
    },
    {
        "email": "admin@deliveroo.demo",
        "password": "Admin123!",
        "role": "admin",
        "first_name": "Felix",
        "last_name": "Admin",
    },
]

DEMO_ORDERS = [
    {
        "slug": "cust-one-pending-books",
        "customer_email": "customer.one@deliveroo.demo",
        "rider_email": None,
        "parcel_description": "Books for office handoff",
        "special_instructions": "Handle with care",
        "weight": Decimal("1.50"),
        "weight_category": "light",
        "pickup_address": "Westlands Pickup Hub, Waiyaki Way",
        "delivery_address": "Kilimani Dispatch Point, Ngong Road",
        "current_address": "Westlands Pickup Hub, Waiyaki Way",
        "quoted_price": Decimal("768.60"),
        "distance_km": Decimal("27.24"),
        "estimated_duration_minutes": 35,
        "status": "pending",
    },
    {
        "slug": "cust-two-confirmed-medical-kit",
        "customer_email": "customer.two@deliveroo.demo",
        "rider_email": "rider.one@deliveroo.demo",
        "parcel_description": "Medical starter kit",
        "special_instructions": "Fragile, keep upright",
        "weight": Decimal("3.20"),
        "weight_category": "medium",
        "pickup_address": "CBD Customer Desk, Kenyatta Avenue",
        "delivery_address": "Upper Hill Operations Bay, Elgon Road",
        "current_address": "CBD Customer Desk, Kenyatta Avenue",
        "quoted_price": Decimal("915.00"),
        "distance_km": Decimal("9.80"),
        "estimated_duration_minutes": 24,
        "status": "confirmed",
    },
    {
        "slug": "cust-three-transit-fashion-box",
        "customer_email": "customer.three@deliveroo.demo",
        "rider_email": "rider.two@deliveroo.demo",
        "parcel_description": "Fashion sample box",
        "special_instructions": "Avoid moisture",
        "weight": Decimal("4.00"),
        "weight_category": "medium",
        "pickup_address": "Kilimani Dispatch Point, Ngong Road",
        "delivery_address": "Karen Dispatch Stop, Langata Road",
        "current_address": "Upper Hill Operations Bay, Elgon Road",
        "quoted_price": Decimal("860.00"),
        "distance_km": Decimal("13.50"),
        "estimated_duration_minutes": 29,
        "status": "in_transit",
    },
    {
        "slug": "cust-one-delivered-electronics",
        "customer_email": "customer.one@deliveroo.demo",
        "rider_email": "rider.one@deliveroo.demo",
        "parcel_description": "Electronics accessories",
        "special_instructions": "Signature required",
        "weight": Decimal("2.30"),
        "weight_category": "medium",
        "pickup_address": "CBD Customer Desk, Kenyatta Avenue",
        "delivery_address": "Westlands Pickup Hub, Waiyaki Way",
        "current_address": "Westlands Pickup Hub, Waiyaki Way",
        "quoted_price": Decimal("740.00"),
        "distance_km": Decimal("7.90"),
        "estimated_duration_minutes": 20,
        "status": "delivered",
    },
    {
        "slug": "cust-two-cancelled-docs",
        "customer_email": "customer.two@deliveroo.demo",
        "rider_email": None,
        "parcel_description": "Contract documents",
        "special_instructions": "Cancelled by sender",
        "weight": Decimal("1.20"),
        "weight_category": "light",
        "pickup_address": "Westlands Pickup Hub, Waiyaki Way",
        "delivery_address": "CBD Customer Desk, Kenyatta Avenue",
        "current_address": "Westlands Pickup Hub, Waiyaki Way",
        "quoted_price": Decimal("620.00"),
        "distance_km": Decimal("8.10"),
        "estimated_duration_minutes": 21,
        "status": "cancelled",
    },
    {
        "slug": "cust-three-confirmed-home-goods",
        "customer_email": "customer.three@deliveroo.demo",
        "rider_email": "rider.two@deliveroo.demo",
        "parcel_description": "Home goods package",
        "special_instructions": "Call on arrival",
        "weight": Decimal("8.40"),
        "weight_category": "medium",
        "pickup_address": "Upper Hill Operations Bay, Elgon Road",
        "delivery_address": "Kilimani Dispatch Point, Ngong Road",
        "current_address": "Upper Hill Operations Bay, Elgon Road",
        "quoted_price": Decimal("980.00"),
        "distance_km": Decimal("6.20"),
        "estimated_duration_minutes": 18,
        "status": "confirmed",
    },
]


def _get_or_create_location(payload):
    location = Location.query.filter_by(address=payload["address"]).first()
    if location:
        return location, False

    location = Location(**payload)
    db.session.add(location)
    return location, True


def seed_reference_data():
    created_locations = 0
    created_weight_categories = 0

    for payload in DEFAULT_LOCATIONS:
        _, created = _get_or_create_location(payload)
        if created:
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


def seed_demo_data():
    reference_stats = seed_reference_data()
    now = datetime.now(timezone.utc)

    users_created = 0
    users_updated = 0
    orders_created = 0

    users_by_email = {}

    for payload in DEMO_USERS:
        user = User.query.filter_by(email=payload["email"]).first()
        created = user is None

        if created:
            user = User(email=payload["email"], role=payload["role"])
            users_created += 1
            db.session.add(user)
        else:
            users_updated += 1

        user.role = payload["role"]
        user.first_name = payload["first_name"]
        user.last_name = payload["last_name"]
        user.is_verified = True
        user.verification_code = None
        user.verification_code_expires_at = None
        user.set_password(payload["password"])

        users_by_email[payload["email"]] = user

    db.session.flush()

    location_by_address = {location.address: location for location in Location.query.all()}
    weight_categories = {category.name: category for category in WeightCategory.query.all()}

    for index, spec in enumerate(DEMO_ORDERS):
        marker = f"demo-seed:{spec['slug']}"
        existing_order = (
            Order.query.join(Parcel, Order.parcel_id == Parcel.id)
            .filter(Parcel.special_instructions.ilike(f"%[{marker}]%"))
            .first()
        )
        if existing_order:
            continue

        customer = users_by_email[spec["customer_email"]]
        rider = users_by_email.get(spec["rider_email"]) if spec["rider_email"] else None
        weight_category = weight_categories[spec["weight_category"]]
        pickup_location = location_by_address[spec["pickup_address"]]
        delivery_location = location_by_address[spec["delivery_address"]]
        current_location = location_by_address.get(spec["current_address"]) or pickup_location
        created_at = now - timedelta(days=(len(DEMO_ORDERS) - index))

        parcel = Parcel(
            description=spec["parcel_description"],
            weight=spec["weight"],
            weight_category_id=weight_category.id,
            special_instructions=f"{spec['special_instructions']} [{marker}]",
            created_at=created_at,
            updated_at=created_at,
        )
        db.session.add(parcel)
        db.session.flush()

        order = Order(
            user_id=customer.id,
            parcel_id=parcel.id,
            pickup_location_id=pickup_location.id,
            delivery_location_id=delivery_location.id,
            current_location_id=current_location.id,
            assigned_rider_id=rider.id if rider else None,
            quoted_price=spec["quoted_price"],
            distance_km=spec["distance_km"],
            estimated_duration_minutes=spec["estimated_duration_minutes"],
            status=spec["status"],
            assigned_at=created_at + timedelta(minutes=12) if rider else None,
            picked_up_at=created_at + timedelta(minutes=24) if spec["status"] == "in_transit" else None,
            delivered_at=created_at + timedelta(minutes=52) if spec["status"] == "delivered" else None,
            cancelled_at=created_at + timedelta(minutes=18) if spec["status"] == "cancelled" else None,
            created_at=created_at,
            updated_at=created_at + timedelta(minutes=30),
        )
        db.session.add(order)
        orders_created += 1

    db.session.commit()

    return {
        "users_created": users_created,
        "users_updated": users_updated,
        "orders_created": orders_created,
        "total_users": User.query.count(),
        "total_orders": Order.query.count(),
        "total_locations": reference_stats["total_locations"],
        "total_weight_categories": reference_stats["total_weight_categories"],
    }
