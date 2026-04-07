from flask import Blueprint, g, request

from app.services.order_service import (
    cancel_order,
    create_order,
    get_order,
    get_orders,
    admin_update_order_location,
    admin_update_order_status,
    update_order_destination,
)
from app.utils.auth import admin_required, auth_required
from app.utils.responses import success_response

order_bp = Blueprint("order", __name__)


@order_bp.post("/")
@auth_required
def create():
    payload = request.get_json(silent=True)
    order = create_order(g.current_user, payload)
    return success_response(
        message="Order created successfully.",
        data={"order": order},
        status_code=201,
    )


@order_bp.get("/")
@auth_required
def list_orders():
    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 10, type=int)
    result = get_orders(g.current_user, page=page, limit=limit)
    return success_response(
        message="Orders retrieved successfully.",
        data=result,
    )


@order_bp.get("/<int:order_id>")
@auth_required
def detail(order_id: int):
    order = get_order(g.current_user, order_id)
    return success_response(
        message="Order details retrieved successfully.",
        data={"order": order},
    )


@order_bp.patch("/<int:order_id>/destination")
@auth_required
def change_destination(order_id: int):
    payload = request.get_json(silent=True)
    order = update_order_destination(g.current_user, order_id, payload)
    return success_response(
        message="Order destination updated successfully.",
        data={"order": order},
    )


@order_bp.patch("/<int:order_id>/cancel")
@auth_required
def cancel(order_id: int):
    payload = request.get_json(silent=True)
    order = cancel_order(g.current_user, order_id, payload)
    return success_response(
        message="Order cancelled successfully.",
        data={"order": order},
    )


@order_bp.patch("/<int:order_id>/status")
@admin_required
def update_status(order_id: int):
    payload = request.get_json(silent=True)
    order = admin_update_order_status(g.current_user, order_id, payload)
    return success_response(
        message="Order status updated successfully.",
        data={"order": order},
    )


@order_bp.patch("/<int:order_id>/location")
@admin_required
def update_location(order_id: int):
    payload = request.get_json(silent=True)
    order = admin_update_order_location(g.current_user, order_id, payload)
    return success_response(
        message="Order location updated successfully.",
        data={"order": order},
    )
