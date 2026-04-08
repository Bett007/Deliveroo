from app.errors.exceptions import AuthorizationError, NotFoundError, ValidationError
from app.extensions import db
from app.models import Location, Order, WeightCategory
from app.services.parcel_service import create_parcel
from app.utils.validators import (
    validate_cancel_payload,
    validate_destination_payload,
    validate_order_payload,
    validate_pagination_params,
    validate_status_payload,
)


def _ensure_order_access(user, order):
    if order is None:
        raise NotFoundError("Order not found.")

    if user.role != "admin" and order.user_id != user.id:
        raise AuthorizationError("You do not have permission to access this order.")

    return order


def _validate_location_exists(location_id):
    location = db.session.get(Location, location_id)
    if location is None:
        raise NotFoundError("Location not found.")
    return location


def create_order(user, payload):
    data = validate_order_payload(payload)

    _validate_location_exists(data["pickup_location_id"])
    _validate_location_exists(data["delivery_location_id"])

    parcel = create_parcel(data["parcel"])

    order = Order(
        user_id=user.id,
        parcel_id=parcel.id,
        pickup_location_id=data["pickup_location_id"],
        delivery_location_id=data["delivery_location_id"],
        quoted_price=data["quoted_price"],
        status="pending",
    )

    db.session.add(order)
    db.session.commit()

    return order.to_dict()


def get_orders(user, page=1, limit=10):
    pagination = validate_pagination_params(page=page, limit=limit)
    query = Order.query.filter_by(user_id=user.id).order_by(Order.created_at.desc())
    total = query.count()
    orders = (
        query.offset((pagination["page"] - 1) * pagination["limit"])
        .limit(pagination["limit"])
        .all()
    )

    return {
        "items": [order.to_dict() for order in orders],
        "page": pagination["page"],
        "limit": pagination["limit"],
        "total": total,
    }


def get_order_reference_data():
    locations = Location.query.order_by(Location.city.asc(), Location.address.asc()).all()
    weight_categories = WeightCategory.query.order_by(WeightCategory.min_weight.asc()).all()

    return {
        "locations": [location.to_dict() for location in locations],
        "weight_categories": [category.to_dict() for category in weight_categories],
    }


def get_order(user, order_id):
    order = db.session.get(Order, order_id)
    _ensure_order_access(user, order)
    return order.to_dict()


def update_order_destination(user, order_id, payload):
    data = validate_destination_payload(payload)
    order = db.session.get(Order, order_id)
    _ensure_order_access(user, order)

    if order.status == "delivered":
        raise ValidationError("Delivered orders cannot change destination.")
    if order.status == "cancelled":
        raise ValidationError("Cancelled orders cannot be updated.")

    _validate_location_exists(data["delivery_location_id"])
    order.delivery_location_id = data["delivery_location_id"]
    db.session.commit()

    return order.to_dict()


def cancel_order(user, order_id, payload=None):
    data = validate_cancel_payload(payload)
    order = db.session.get(Order, order_id)
    _ensure_order_access(user, order)

    if order.status == "delivered":
        raise ValidationError("Delivered orders cannot be cancelled.")
    if order.status == "cancelled":
        raise ValidationError("Order is already cancelled.")

    order.status = "cancelled"
    db.session.commit()

    return order.to_dict()


def admin_update_order_status(user, order_id, payload):
    data = validate_status_payload(payload)
    order = db.session.get(Order, order_id)
    _ensure_order_access(user, order)

    order.status = data["status"]
    db.session.commit()

    return order.to_dict()


def admin_update_order_location(user, order_id, payload):
    payload_data = payload or {}
    location_id = payload_data.get("location_id")

    if location_id is None:
        raise ValidationError("Location ID is required for location update.")

    try:
        location_id = int(location_id)
    except (TypeError, ValueError):
        raise ValidationError("Location ID must be an integer.")

    order = db.session.get(Order, order_id)
    _ensure_order_access(user, order)
    _validate_location_exists(location_id)

    order.current_location_id = location_id
    db.session.commit()

    return order.to_dict()
