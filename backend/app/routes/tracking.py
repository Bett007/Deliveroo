from flask import Blueprint, g, request

from app.services.tracking_service import (
    add_tracking_update,
    get_tracking_updates,
)
from app.utils.auth import auth_required
from app.utils.responses import success_response

tracking_bp = Blueprint("tracking", __name__)


@tracking_bp.get("/<int:order_id>")
@auth_required
def list_tracking(order_id: int):
    updates = get_tracking_updates(g.current_user, order_id)
    return success_response(
        message="Tracking updates retrieved successfully.",
        data={"updates": updates},
    )


@tracking_bp.post("/<int:order_id>")
@auth_required
def create_tracking(order_id: int):
    payload = request.get_json(silent=True)
    update = add_tracking_update(g.current_user, order_id, payload)
    return success_response(
        message="Tracking update created successfully.",
        data={"tracking_update": update},
        status_code=201,
    )
