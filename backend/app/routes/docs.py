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
            "components": {
                "securitySchemes": {
                    "bearerAuth": {
                        "type": "http",
                        "scheme": "bearer",
                        "bearerFormat": "JWT",
                    }
                },
                "schemas": {
                    "User": {
                        "type": "object",
                        "properties": {
                            "id": {"type": "integer"},
                            "email": {"type": "string", "format": "email"},
                            "role": {"type": "string"},
                            "created_at": {"type": "string", "format": "date-time"},
                        },
                    },
                    "SuccessResponse": {
                        "type": "object",
                        "properties": {
                            "success": {"type": "boolean", "example": True},
                            "message": {"type": "string"},
                            "data": {"type": "object"},
                        },
                    },
                    "ErrorResponse": {
                        "type": "object",
                        "properties": {
                            "success": {"type": "boolean", "example": False},
                            "message": {"type": "string"},
                            "errors": {"type": "object"},
                        },
                    },
                },
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
                                "content": {
                                    "application/json": {
                                        "schema": {"$ref": "#/components/schemas/SuccessResponse"}
                                    }
                                },
                            },
                            "400": {
                                "description": "Validation failed",
                                "content": {
                                    "application/json": {
                                        "schema": {"$ref": "#/components/schemas/ErrorResponse"}
                                    }
                                },
                            },
                        },
                    }
                },
                "/api/auth/login": {
                    "post": {
                        "summary": "Authenticate a user",
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
                                            "password": {"type": "string"},
                                        },
                                    }
                                }
                            },
                        },
                        "responses": {
                            "200": {
                                "description": "Login successful",
                                "content": {
                                    "application/json": {
                                        "schema": {"$ref": "#/components/schemas/SuccessResponse"}
                                    }
                                },
                            },
                            "400": {
                                "description": "Validation failed",
                                "content": {
                                    "application/json": {
                                        "schema": {"$ref": "#/components/schemas/ErrorResponse"}
                                    }
                                },
                            },
                            "401": {
                                "description": "Invalid credentials",
                                "content": {
                                    "application/json": {
                                        "schema": {"$ref": "#/components/schemas/ErrorResponse"}
                                    }
                                },
                            },
                        },
                    }
                },
                "/api/auth/me": {
                    "get": {
                        "summary": "Get the authenticated user",
                        "tags": ["Authentication"],
                        "security": [{"bearerAuth": []}],
                        "responses": {
                            "200": {
                                "description": "Authenticated user retrieved successfully",
                                "content": {
                                    "application/json": {
                                        "schema": {"$ref": "#/components/schemas/SuccessResponse"}
                                    }
                                },
                            },
                            "401": {
                                "description": "Missing, invalid, or expired token",
                                "content": {
                                    "application/json": {
                                        "schema": {"$ref": "#/components/schemas/ErrorResponse"}
                                    }
                                },
                            },
                        },
                    }
                },
                "/api/auth/admin-check": {
                    "get": {
                        "summary": "Verify admin-only access",
                        "tags": ["Authorization"],
                        "security": [{"bearerAuth": []}],
                        "responses": {
                            "200": {
                                "description": "Admin access confirmed",
                                "content": {
                                    "application/json": {
                                        "schema": {"$ref": "#/components/schemas/SuccessResponse"}
                                    }
                                },
                            },
                            "401": {
                                "description": "Missing, invalid, or expired token",
                                "content": {
                                    "application/json": {
                                        "schema": {"$ref": "#/components/schemas/ErrorResponse"}
                                    }
                                },
                            },
                            "403": {
                                "description": "Authenticated user is not an admin",
                                "content": {
                                    "application/json": {
                                        "schema": {"$ref": "#/components/schemas/ErrorResponse"}
                                    }
                                },
                            },
                        },
                    }
                }
            },
        }
    )
