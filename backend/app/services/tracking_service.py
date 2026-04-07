from app.errors.exceptions import AuthorizationError, NotFoundError, ValidationError


def get_tracking_updates(user, order_id):
    raise NotImplementedError("Implement tracking retrieval in tracking_service")


def add_tracking_update(user, order_id, payload):
    raise NotImplementedError("Implement tracking update creation in tracking_service")
