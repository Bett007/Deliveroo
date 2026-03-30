from flask import Flask
from werkzeug.exceptions import HTTPException

from app.errors.exceptions import ApiError
from app.utils.responses import error_response


def register_error_handlers(app: Flask) -> None:
    @app.errorhandler(ApiError)
    def handle_api_error(error: ApiError):
        return error_response(
            message=error.message,
            status_code=error.status_code,
            errors=error.errors,
        )

    @app.errorhandler(HTTPException)
    def handle_http_exception(error: HTTPException):
        return error_response(
            message=error.description,
            status_code=error.code or 500,
        )

    @app.errorhandler(Exception)
    def handle_unexpected_error(error: Exception):
        if app.config.get("TESTING"):
            raise error

        return error_response(
            message="An unexpected error occurred.",
            status_code=500,
        )
