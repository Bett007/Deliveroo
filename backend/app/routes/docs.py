from flask import Blueprint, jsonify

docs_bp = Blueprint("docs", __name__)


@docs_bp.get("/swagger.json")
def swagger_spec():
    return jsonify(
        {
            "openapi": "3.0.3",
            "info": {
                "title": "Deliveroo Backend API",
                "version": "1.0.0",
                "description": "Swagger-compatible API documentation for implemented backend endpoints.",
            },
            "paths": {
                "/api/auth/register": {
                    "post": {
                        "summary": "Register a new user",
                        "tags": ["Authentication"],
                        "requestBody": {
                            "required": True,
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object",
                                        "required": ["email", "password"],
                                        "properties": {
                                            "email": {
                                                "type": "string",
                                                "format": "email",
                                            },
                                            "password": {
                                                "type": "string",
                                                "minLength": 8,
                                            },
                                            "role": {
                                                "type": "string",
                                                "enum": ["customer", "admin", "rider"],
                                                "default": "customer",
                                            },
                                        },
                                    }
                                }
                            },
                        },
                        "responses": {
                            "201": {
                                "description": "User registered successfully",
                            },
                            "400": {
                                "description": "Validation failed",
                            },
                        },
                    }
                }
            },
        }
    )
