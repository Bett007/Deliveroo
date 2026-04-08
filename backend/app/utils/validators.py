import re
from typing import Optional

from app.errors.exceptions import ValidationError

EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
MIN_PASSWORD_LENGTH = 8
VALID_ROLES = {"customer", "admin", "rider"}
VALID_ORDER_STATUSES = {
    "pending",
    "confirmed",
    "in_transit",
    "delivered",
    "cancelled",
}


def validate_registration_payload(payload: Optional[dict] = None) -> dict:
    data = payload or {}
    errors = {}

    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    role = (data.get("role") or "customer").strip().lower()

    if not email:
        errors["email"] = ["Email is required."]
    elif not EMAIL_PATTERN.match(email):
        errors["email"] = ["Enter a valid email address."]

    if not password:
        errors["password"] = ["Password is required."]
    elif len(password) < MIN_PASSWORD_LENGTH:
        errors["password"] = [
            f"Password must be at least {MIN_PASSWORD_LENGTH} characters long."
        ]

    if not role:
        errors["role"] = ["Role is required."]
    elif role not in VALID_ROLES:
        errors["role"] = [
            f"Role must be one of: {', '.join(sorted(VALID_ROLES))}."
        ]

    if errors:
        raise ValidationError("Validation failed.", errors=errors)

    return {"email": email, "password": password, "role": role}


def validate_login_payload(payload: Optional[dict] = None) -> dict:
    data = payload or {}
    errors = {}

    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email:
        errors["email"] = ["Email is required."]
    elif not EMAIL_PATTERN.match(email):
        errors["email"] = ["Enter a valid email address."]

    if not password:
        errors["password"] = ["Password is required."]

    if errors:
        raise ValidationError("Validation failed.", errors=errors)

    return {"email": email, "password": password}


def validate_parcel_payload(payload: Optional[dict] = None) -> dict:
    data = payload or {}
    errors = {}

    description = (data.get("description") or "").strip()
    weight = data.get("weight")
    weight_category_id = data.get("weight_category_id")
    image_url = data.get("image_url")
    special_instructions = data.get("special_instructions")

    if not description:
        errors["description"] = ["Parcel description is required."]

    if weight is None:
        errors["weight"] = ["Parcel weight is required."]
    else:
        try:
            weight = float(weight)
            if weight <= 0:
                raise ValueError()
        except (TypeError, ValueError):
            errors["weight"] = ["Parcel weight must be a positive number."]

    if not weight_category_id:
        errors["weight_category_id"] = ["Weight category is required."]
    else:
        try:
            weight_category_id = int(weight_category_id)
        except (TypeError, ValueError):
            errors["weight_category_id"] = ["Weight category ID must be an integer."]

    if errors:
        raise ValidationError("Validation failed.", errors=errors)

    return {
        "description": description,
        "weight": weight,
        "weight_category_id": weight_category_id,
        "image_url": image_url,
        "special_instructions": special_instructions,
    }


def validate_order_payload(payload: Optional[dict] = None) -> dict:
    data = payload or {}
    errors = {}

    pickup_location_id = data.get("pickup_location_id")
    delivery_location_id = data.get("delivery_location_id")
    quoted_price = data.get("quoted_price")
    parcel_payload = data.get("parcel")

    if not pickup_location_id:
        errors["pickup_location_id"] = ["Pickup location is required."]
    else:
        try:
            pickup_location_id = int(pickup_location_id)
        except (TypeError, ValueError):
            errors["pickup_location_id"] = ["Pickup location ID must be an integer."]

    if not delivery_location_id:
        errors["delivery_location_id"] = ["Delivery location is required."]
    else:
        try:
            delivery_location_id = int(delivery_location_id)
        except (TypeError, ValueError):
            errors["delivery_location_id"] = ["Delivery location ID must be an integer."]

    if quoted_price is None:
        errors["quoted_price"] = ["Quoted price is required."]
    else:
        try:
            quoted_price = float(quoted_price)
            if quoted_price < 0:
                raise ValueError()
        except (TypeError, ValueError):
            errors["quoted_price"] = ["Quoted price must be a valid number."]

    if not isinstance(parcel_payload, dict):
        errors["parcel"] = ["Parcel payload is required."]

    if errors:
        raise ValidationError("Validation failed.", errors=errors)

    parcel = validate_parcel_payload(parcel_payload)
    return {
        "pickup_location_id": pickup_location_id,
        "delivery_location_id": delivery_location_id,
        "quoted_price": quoted_price,
        "parcel": parcel,
    }


def validate_destination_payload(payload: Optional[dict] = None) -> dict:
    data = payload or {}
    errors = {}

    delivery_location_id = data.get("delivery_location_id")
    if not delivery_location_id:
        errors["delivery_location_id"] = ["Delivery location is required."]
    else:
        try:
            delivery_location_id = int(delivery_location_id)
        except (TypeError, ValueError):
            errors["delivery_location_id"] = ["Delivery location ID must be an integer."]

    if errors:
        raise ValidationError("Validation failed.", errors=errors)

    return {"delivery_location_id": delivery_location_id}


def validate_status_payload(payload: Optional[dict] = None) -> dict:
    data = payload or {}
    errors = {}

    status = (data.get("status") or "").strip().lower()
    if not status:
        errors["status"] = ["Status is required."]
    elif status not in VALID_ORDER_STATUSES:
        errors["status"] = [
            f"Status must be one of: {', '.join(sorted(VALID_ORDER_STATUSES))}."
        ]

    if errors:
        raise ValidationError("Validation failed.", errors=errors)

    return {"status": status}


def validate_cancel_payload(payload: Optional[dict] = None) -> dict:
    data = payload or {}
    errors = {}

    reason = data.get("reason")
    if reason is not None:
        if not isinstance(reason, str):
            errors["reason"] = ["Cancellation reason must be a string."]
        else:
            reason = reason.strip()
            if not reason:
                errors["reason"] = ["Cancellation reason cannot be empty."]
            elif len(reason) > 500:
                errors["reason"] = ["Cancellation reason must be under 500 characters."]

    if errors:
        raise ValidationError("Validation failed.", errors=errors)

    return {"reason": reason}


def validate_tracking_payload(payload: Optional[dict] = None) -> dict:
    data = payload or {}
    errors = {}

    status = (data.get("status") or "").strip().lower()
    location_id = data.get("location_id")
    note = data.get("note")

    if not status:
        errors["status"] = ["Tracking status is required."]
    elif status not in VALID_ORDER_STATUSES:
        errors["status"] = [
            f"Status must be one of: {', '.join(sorted(VALID_ORDER_STATUSES))}."
        ]

    if location_id is not None:
        try:
            location_id = int(location_id)
        except (TypeError, ValueError):
            errors["location_id"] = ["Location ID must be an integer."]

    if errors:
        raise ValidationError("Validation failed.", errors=errors)

    return {"status": status, "location_id": location_id, "note": note}


def validate_pagination_params(page=1, limit=10) -> dict:
    errors = {}

    try:
        page = int(page)
        if page < 1:
            raise ValueError()
    except (TypeError, ValueError):
        errors["page"] = ["Page must be an integer greater than or equal to 1."]

    try:
        limit = int(limit)
        if limit < 1:
            raise ValueError()
    except (TypeError, ValueError):
        errors["limit"] = ["Limit must be an integer greater than or equal to 1."]

    if errors:
        raise ValidationError("Validation failed.", errors=errors)

    return {"page": page, "limit": limit}
