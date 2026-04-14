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
    first_name = (data.get("first_name") or "").strip()
    last_name = (data.get("last_name") or "").strip()

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

    if not first_name:
        errors["first_name"] = ["First name is required."]
    elif len(first_name) > 120:
        errors["first_name"] = ["First name must be 120 characters or less."]

    if not last_name:
        errors["last_name"] = ["Last name is required."]
    elif len(last_name) > 120:
        errors["last_name"] = ["Last name must be 120 characters or less."]

    if errors:
        raise ValidationError("Validation failed.", errors=errors)

    return {
        "email": email,
        "password": password,
        "role": role,
        "first_name": first_name,
        "last_name": last_name,
    }


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


def validate_verification_payload(payload: Optional[dict] = None) -> dict:
    data = payload or {}
    errors = {}

    email = (data.get("email") or "").strip().lower()
    code = str(data.get("code") or "").strip()

    if not email:
        errors["email"] = ["Email is required."]
    elif not EMAIL_PATTERN.match(email):
        errors["email"] = ["Enter a valid email address."]

    if not code:
        errors["code"] = ["Verification code is required."]
    elif not re.fullmatch(r"\d{6}", code):
        errors["code"] = ["Verification code must be a 6-digit number."]

    if errors:
        raise ValidationError("Validation failed.", errors=errors)

    return {"email": email, "code": code}


def validate_verification_resend_payload(payload: Optional[dict] = None) -> dict:
    data = payload or {}
    errors = {}

    email = (data.get("email") or "").strip().lower()

    if not email:
        errors["email"] = ["Email is required."]
    elif not EMAIL_PATTERN.match(email):
        errors["email"] = ["Enter a valid email address."]

    if errors:
        raise ValidationError("Validation failed.", errors=errors)

    return {"email": email}


def validate_profile_payload(payload: Optional[dict] = None) -> dict:
    if payload is None:
        data = {}
    elif not isinstance(payload, dict):
        raise ValidationError(
            "Validation failed.",
            errors={"payload": ["Profile payload must be a JSON object."]},
        )
    else:
        data = payload

    errors = {}

    first_name = data.get("first_name")
    last_name = data.get("last_name")
    phone = data.get("phone")
    avatar_url = data.get("avatar_url")

    def normalize_text(value, field, max_length):
        if value is None:
            return None
        if not isinstance(value, str):
            errors[field] = [f"{field.replace('_', ' ').title()} must be a string."]
            return None
        value = value.strip()
        if len(value) > max_length:
            errors[field] = [f"{field.replace('_', ' ').title()} must be {max_length} characters or fewer."]
        return value or None

    normalized_data = {}

    if "first_name" in data:
        normalized_data["first_name"] = normalize_text(first_name, "first_name", 120)
    if "last_name" in data:
        normalized_data["last_name"] = normalize_text(last_name, "last_name", 120)
    if "phone" in data:
        normalized_data["phone"] = normalize_text(phone, "phone", 40)
    if "avatar_url" in data:
        normalized_data["avatar_url"] = normalize_text(avatar_url, "avatar_url", 2_000_000)

    if errors:
        raise ValidationError("Validation failed.", errors=errors)

    return normalized_data


def validate_parcel_payload(payload: Optional[dict] = None) -> dict:
    data = payload or {}
    errors = {}

    description = (data.get("description") or "").strip()
    weight = data.get("weight")
    weight_category_id = data.get("weight_category_id")
    image_url = data.get("image_url")
    special_instructions = data.get("special_instructions")

    if isinstance(image_url, str):
        image_url = image_url.strip() or None

    if isinstance(special_instructions, str):
        special_instructions = special_instructions.strip() or None

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


def validate_assignment_payload(payload: Optional[dict] = None) -> dict:
    data = payload or {}
    errors = {}
    rider_id = data.get("rider_id")

    if rider_id is None:
        return {"rider_id": None}

    try:
        rider_id = int(rider_id)
    except (TypeError, ValueError):
        errors["rider_id"] = ["Rider ID must be an integer."]

    if errors:
        raise ValidationError("Validation failed.", errors=errors)

    return {"rider_id": rider_id}


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

    if isinstance(note, str):
        note = note.strip() or None

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
