from flask import Blueprint, request

from app.services.auth_service import register_user
from app.utils.responses import success_response

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    user = register_user(request.get_json(silent=True))
    return success_response(
        message="User registered successfully.",
        data={"user": user.to_dict()},
        status_code=201,
    )
