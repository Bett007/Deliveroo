from app.errors.exceptions import AuthorizationError, NotFoundError, ValidationError
from app.extensions import db
from app.models import Location, Order
from app.services.parcel_service import create_parcel
from app.utils.validators import (
    validate_destination_payload,
    validate_order_payload,
    validate_status_payload,
)


def _ensure_order_access(user, order):
    if order is None:
        raise NotFoundError("Order not found.")

    if user.role != "admin" and order.user_id != user.id:
        raise AuthorizationError("You do not have permission to access this order.")

    return order


def _validate_location_exists(location_id):
    location = Location.query.get(location_id)
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
    query = Order.query.filter_by(user_id=user.id).order_by(Order.created_at.desc())
    total = query.count()
    orders = query.offset((page - 1) * limit).limit(limit).all()

    return {
        "items": [order.to_dict() for order in orders],
        "page": page,
        "limit": limit,
        "total": total,
    }


def get_order(user, order_id):
    order = Order.query.get(order_id)
    _ensure_order_access(user, order)
    return order.to_dict()


def update_order_destination(user, order_id, payload):
    data = validate_destination_payload(payload)
    order = Order.query.get(order_id)
    _ensure_order_access(user, order)

    if order.status == "delivered":
        raise ValidationError("Delivered orders cannot change destination.")
    if order.status == "cancelled":
        raise ValidationError("Cancelled orders cannot be updated.")

    _validate_location_exists(data["delivery_location_id"])
    order.delivery_location_id = data["delivery_location_id"]
    db.session.commit()

    return order.to_dict()


def cancel_order(user, order_id):
    order = Order.query.get(order_id)
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
    order = Order.query.get(order_id)
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

    order = Order.query.get(order_id)
    _ensure_order_access(user, order)
    _validate_location_exists(location_id)

    order.current_location_id = location_id
    db.session.commit()

    return order.to_dict()
