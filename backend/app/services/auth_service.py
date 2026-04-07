from typing import Optional

from app.errors.exceptions import AuthenticationError, ValidationError
from app.extensions import db
from app.models import User
from app.utils.validators import validate_login_payload, validate_registration_payload


def register_user(payload: Optional[dict] = None) -> User:
    data = validate_registration_payload(payload)

    if User.query.filter_by(email=data["email"]).first():
        raise ValidationError(
            "Validation failed.",
            errors={"email": ["A user with this email already exists."]},
        )

    user = User(email=data["email"], role=data["role"])
    user.set_password(data["password"])

    db.session.add(user)
    db.session.commit()

    return user


def authenticate_user(payload: Optional[dict] = None) -> User:
    data = validate_login_payload(payload)
    user = User.query.filter_by(email=data["email"]).first()

    if user is None or not user.check_password(data["password"]):
        raise AuthenticationError("Invalid email or password.")

    return user
