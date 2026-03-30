from datetime import datetime, timedelta, timezone
from functools import wraps

import jwt
from flask import current_app, g, request

from app.errors.exceptions import AuthenticationError, AuthorizationError
from app.extensions import db
from app.models import User


def generate_access_token(user: User) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=current_app.config["JWT_ACCESS_TOKEN_EXPIRES_MINUTES"]
    )
    payload = {
        "sub": str(user.id),
        "email": user.email,
        "role": user.role,
        "exp": expires_at,
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, current_app.config["JWT_SECRET_KEY"], algorithm="HS256")


def decode_access_token(token: str) -> dict:
    try:
        return jwt.decode(
            token,
            current_app.config["JWT_SECRET_KEY"],
            algorithms=["HS256"],
        )
    except jwt.ExpiredSignatureError as exc:
        raise AuthenticationError("Access token has expired.") from exc
    except jwt.InvalidTokenError as exc:
        raise AuthenticationError("Invalid access token.") from exc


def get_bearer_token() -> str:
    authorization_header = request.headers.get("Authorization", "")
    scheme, _, token = authorization_header.partition(" ")

    if scheme.lower() != "bearer" or not token:
        raise AuthenticationError("Authentication token is missing.")

    return token


def auth_required(view_func):
    @wraps(view_func)
    def wrapped(*args, **kwargs):
        payload = decode_access_token(get_bearer_token())
        user = db.session.get(User, int(payload["sub"]))

        if user is None:
            raise AuthenticationError("Authenticated user no longer exists.")

        g.current_user = user
        return view_func(*args, **kwargs)

    return wrapped


def admin_required(view_func):
    @wraps(view_func)
    @auth_required
    def wrapped(*args, **kwargs):
        if g.current_user.role != "admin":
            raise AuthorizationError("You do not have permission to access this resource.")

        return view_func(*args, **kwargs)

    return wrapped
