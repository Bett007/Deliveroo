from typing import Optional


class ApiError(Exception):
    status_code = 400

    def __init__(self, message: str, *, status_code: Optional[int] = None, errors=None):
        super().__init__(message)
        if status_code is not None:
            self.status_code = status_code
        self.message = message
        self.errors = errors


class ValidationError(ApiError):
    status_code = 400


class AuthenticationError(ApiError):
    status_code = 401


class AuthorizationError(ApiError):
    status_code = 403


class NotFoundError(ApiError):
    status_code = 404
