from flask import Blueprint, g, request

from app.services.auth_service import (
    authenticate_user,
    request_password_reset,
    register_user,
    reset_password_with_code,
    resend_verification_code,
    serialize_password_reset_details,
    serialize_verification_details,
    update_user_profile,
    verify_user_registration,
)
from app.utils.auth import admin_required, auth_required, generate_access_token
from app.utils.responses import success_response

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    user = register_user(request.get_json(silent=True))
    return success_response(
        message="User registered successfully.",
        data={
            "user": user.to_dict(),
            "verification": serialize_verification_details(user),
        },
        status_code=201,
    )


@auth_bp.post("/login")
def login():
    user = authenticate_user(request.get_json(silent=True))
    access_token = generate_access_token(user)
    return success_response(
        message="Login successful.",
        data={"access_token": access_token, "user": user.to_dict()},
    )


@auth_bp.post("/verify")
def verify():
    user = verify_user_registration(request.get_json(silent=True))
    return success_response(
        message="Account verified successfully. You can sign in now.",
        data={"user": user.to_dict()},
    )


@auth_bp.post("/resend-verification")
def resend_verification():
    user = resend_verification_code(request.get_json(silent=True))
    return success_response(
        message="A new verification code has been generated.",
        data={"verification": serialize_verification_details(user)},
    )


@auth_bp.post("/forgot-password")
def forgot_password():
    user = request_password_reset(request.get_json(silent=True))
    data = {}
    if user is not None:
        data["reset"] = serialize_password_reset_details(user)
    return success_response(
        message="If the account exists, a reset code has been generated.",
        data=data,
    )


@auth_bp.post("/reset-password")
def reset_password():
    reset_password_with_code(request.get_json(silent=True))
    return success_response(
        message="Password has been reset successfully. You can sign in now.",
        data={},
    )


@auth_bp.get("/me")
@auth_required
def get_current_user():
    return success_response(
        message="Authenticated user retrieved successfully.",
        data={"user": g.current_user.to_dict()},
    )


@auth_bp.patch("/me")
@auth_required
def update_current_user():
    user = update_user_profile(g.current_user, request.get_json(silent=True))
    return success_response(
        message="Profile updated successfully.",
        data={"user": user.to_dict()},
    )


@auth_bp.get("/admin-check")
@admin_required
def admin_check():
    return success_response(
        message="Admin access confirmed.",
        data={"user": g.current_user.to_dict()},
    )
