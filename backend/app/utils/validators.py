import re
from typing import Optional

from app.errors.exceptions import ValidationError

EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
MIN_PASSWORD_LENGTH = 8
VALID_ROLES = {"customer", "admin", "rider"}


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
