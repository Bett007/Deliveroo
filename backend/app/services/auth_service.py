from datetime import datetime, timedelta, timezone
from secrets import randbelow
from typing import Optional

from app.errors.exceptions import AuthenticationError, ValidationError
from app.extensions import db
from app.models import User
from app.utils.validators import (
    validate_login_payload,
    validate_profile_payload,
    validate_registration_payload,
    validate_verification_payload,
    validate_verification_resend_payload,
)

VERIFICATION_CODE_LENGTH = 6
VERIFICATION_CODE_TTL_MINUTES = 10


def _generate_verification_code() -> str:
    return f"{randbelow(10 ** VERIFICATION_CODE_LENGTH):0{VERIFICATION_CODE_LENGTH}d}"


def _refresh_verification_code(user: User) -> User:
    user.is_verified = False
    user.verification_code = _generate_verification_code()
    user.verification_code_expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=VERIFICATION_CODE_TTL_MINUTES
    )
    return user


def serialize_verification_details(user: User) -> dict:
    return {
        "email": user.email,
        "code": user.verification_code,
        "expires_at": user.verification_code_expires_at.isoformat()
        if user.verification_code_expires_at
        else None,
    }


def _is_verification_code_expired(expires_at: Optional[datetime]) -> bool:
    if expires_at is None:
        return True

    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    return expires_at < datetime.now(timezone.utc)


def register_user(payload: Optional[dict] = None) -> User:
    data = validate_registration_payload(payload)

    if User.query.filter_by(email=data["email"]).first():
        raise ValidationError(
            "Validation failed.",
            errors={"email": ["A user with this email already exists."]},
        )

    user = User(email=data["email"], role=data["role"])
    user.set_password(data["password"])
    user.first_name = data["first_name"]
    user.last_name = data["last_name"]
    _refresh_verification_code(user)

    db.session.add(user)
    db.session.commit()

    return user


def authenticate_user(payload: Optional[dict] = None) -> User:
    data = validate_login_payload(payload)
    user = User.query.filter_by(email=data["email"]).first()

    if user is None or not user.check_password(data["password"]):
        raise AuthenticationError("Invalid email or password.")

    if not user.is_verified:
        raise AuthenticationError(
            "Account verification is required before signing in."
        )

    return user


def verify_user_registration(payload: Optional[dict] = None) -> User:
    data = validate_verification_payload(payload)
    user = User.query.filter_by(email=data["email"]).first()

    if user is None:
        raise AuthenticationError("Verification code is invalid.")

    if user.is_verified:
        return user

    if user.verification_code != data["code"]:
        raise AuthenticationError("Verification code is invalid.")

    if _is_verification_code_expired(user.verification_code_expires_at):
        raise AuthenticationError(
            "Verification code has expired. Request a new code and try again."
        )

    user.is_verified = True
    user.verification_code = None
    user.verification_code_expires_at = None
    db.session.commit()

    return user


def resend_verification_code(payload: Optional[dict] = None) -> User:
    data = validate_verification_resend_payload(payload)
    user = User.query.filter_by(email=data["email"]).first()

    if user is None:
        raise ValidationError(
            "Validation failed.",
            errors={"email": ["No account was found for this email address."]},
        )

    if user.is_verified:
        raise ValidationError(
            "Validation failed.",
            errors={"email": ["This account is already verified."]},
        )

    _refresh_verification_code(user)
    db.session.commit()

    return user


def update_user_profile(user: User, payload: Optional[dict] = None) -> User:
    data = validate_profile_payload(payload)

    for field, value in data.items():
        setattr(user, field, value)

    db.session.commit()

    return user
