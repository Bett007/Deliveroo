from app.errors.exceptions import AuthorizationError, NotFoundError, ValidationError
from app.extensions import db
from app.models import Location, Order, TrackingUpdate
from app.utils.validators import validate_tracking_payload


def _ensure_order_access(user, order):
    if order is None:
        raise NotFoundError("Order not found.")

    if user.role != "admin" and order.user_id != user.id:
        raise AuthorizationError("You do not have permission to access this order.")

    return order


def _validate_location_exists(location_id):
    if location_id is None:
        return None

    location = db.session.get(Location, location_id)
    if location is None:
        raise NotFoundError("Location not found.")
    return location


def get_tracking_updates(user, order_id):
    order = db.session.get(Order, order_id)
    _ensure_order_access(user, order)

    updates = TrackingUpdate.query.filter_by(order_id=order.id).order_by(TrackingUpdate.created_at.desc()).all()
    return [update.to_dict() for update in updates]


def add_tracking_update(user, order_id, payload):
    data = validate_tracking_payload(payload)
    order = db.session.get(Order, order_id)
    _ensure_order_access(user, order)
    _validate_location_exists(data["location_id"])

    update = TrackingUpdate(
        order_id=order.id,
        location_id=data["location_id"],
        status=data["status"],
        note=data["note"],
        updated_by=user.id,
    )
    db.session.add(update)
    db.session.commit()
    return update.to_dict()
