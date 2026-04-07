from app.errors.exceptions import AuthorizationError, NotFoundError, ValidationError


def create_order(user, payload):
    raise NotImplementedError("Implement order creation logic in order_service")


def get_orders(user, page=1, limit=10):
    raise NotImplementedError("Implement order listing and pagination in order_service")


def get_order(user, order_id):
    raise NotImplementedError("Implement order detail retrieval in order_service")


def update_order_destination(user, order_id, payload):
    raise NotImplementedError("Implement order destination update logic in order_service")


def cancel_order(user, order_id):
    raise NotImplementedError("Implement order cancellation logic in order_service")


def admin_update_order_status(user, order_id, payload):
    raise NotImplementedError("Implement admin order status update logic in order_service")


def admin_update_order_location(user, order_id, payload):
    raise NotImplementedError("Implement admin order location update logic in order_service")
