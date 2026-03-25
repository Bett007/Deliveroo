from flask import Blueprint, jsonify

health_bp = Blueprint("health", __name__)


@health_bp.get("/health")
def health_check():
    return jsonify({"message": "Deliveroo backend is running", "status": "ok"}), 200
