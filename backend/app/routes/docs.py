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
                            "id": {"type": "integer", "example": 1},
                            "email": {"type": "string", "format": "email", "example": "user@example.com"},
                            "role": {"type": "string", "enum": ["customer", "admin", "rider"], "example": "customer"},
                            "created_at": {"type": "string", "format": "date-time"},
                        },
                    },
                    "Location": {
                        "type": "object",
                        "properties": {
                            "id": {"type": "integer", "example": 1},
                            "address": {"type": "string", "example": "Westlands Pickup Hub, Waiyaki Way"},
                            "city": {"type": "string", "example": "Nairobi"},
                            "country": {"type": "string", "example": "Kenya"},
                            "latitude": {"type": "number", "format": "float", "example": -1.2676},
                            "longitude": {"type": "number", "format": "float", "example": 36.8108},
                            "created_at": {"type": "string", "format": "date-time"},
                        },
                    },
                    "WeightCategory": {
                        "type": "object",
                        "properties": {
                            "id": {"type": "integer", "example": 1},
                            "name": {"type": "string", "example": "light"},
                            "min_weight": {"type": "number", "format": "float", "example": 0.0},
                            "max_weight": {"type": "number", "format": "float", "example": 2.0},
                            "base_price": {"type": "number", "format": "float", "example": 250.0},
                            "created_at": {"type": "string", "format": "date-time"},
                        },
                    },
                    "Parcel": {
                        "type": "object",
                        "properties": {
                            "id": {"type": "integer", "example": 10},
                            "description": {"type": "string", "example": "Small electronics package"},
                            "weight": {"type": "number", "format": "float", "example": 1.5},
                            "weight_category_id": {"type": "integer", "example": 1},
                            "image_url": {"type": "string", "nullable": True, "example": "https://example.com/parcel.png"},
                            "special_instructions": {"type": "string", "nullable": True, "example": "Handle with care"},
                            "created_at": {"type": "string", "format": "date-time"},
                            "updated_at": {"type": "string", "format": "date-time"},
                        },
                    },
                    "Order": {
                        "type": "object",
                        "properties": {
                            "id": {"type": "integer", "example": 101},
                            "user_id": {"type": "integer", "example": 1},
                            "parcel_id": {"type": "integer", "example": 10},
                            "pickup_location_id": {"type": "integer", "example": 1},
                            "delivery_location_id": {"type": "integer", "example": 2},
                            "current_location_id": {"type": "integer", "nullable": True, "example": 3},
                            "quoted_price": {"type": "number", "format": "float", "example": 450.0},
                            "distance_km": {"type": "number", "format": "float", "nullable": True, "example": 12.5},
                            "estimated_duration_minutes": {"type": "integer", "nullable": True, "example": 35},
                            "status": {
                                "type": "string",
                                "enum": ["pending", "confirmed", "in_transit", "delivered", "cancelled"],
                                "example": "pending",
                            },
                            "created_at": {"type": "string", "format": "date-time"},
                            "updated_at": {"type": "string", "format": "date-time"},
                        },
                    },
                    "TrackingUpdate": {
                        "type": "object",
                        "properties": {
                            "id": {"type": "integer", "example": 15},
                            "order_id": {"type": "integer", "example": 101},
                            "location_id": {"type": "integer", "nullable": True, "example": 3},
                            "status": {
                                "type": "string",
                                "enum": ["pending", "confirmed", "in_transit", "delivered", "cancelled"],
                                "example": "in_transit",
                            },
                            "note": {"type": "string", "nullable": True, "example": "Package is out for delivery."},
                            "updated_by": {"type": "integer", "example": 2},
                            "created_at": {"type": "string", "format": "date-time"},
                        },
                    },
                    "RegistrationRequest": {
                        "type": "object",
                        "required": ["email", "password"],
                        "properties": {
                            "email": {"type": "string", "format": "email"},
                            "password": {"type": "string", "minLength": 8},
                            "role": {
                                "type": "string",
                                "enum": ["customer", "admin", "rider"],
                                "default": "customer",
                            },
                        },
                    },
                    "LoginRequest": {
                        "type": "object",
                        "required": ["email", "password"],
                        "properties": {
                            "email": {"type": "string", "format": "email"},
                            "password": {"type": "string"},
                        },
                    },
                    "ParcelInput": {
                        "type": "object",
                        "required": ["description", "weight", "weight_category_id"],
                        "properties": {
                            "description": {"type": "string", "example": "Small electronics package"},
                            "weight": {"type": "number", "format": "float", "example": 1.5},
                            "weight_category_id": {"type": "integer", "example": 1},
                            "image_url": {"type": "string", "nullable": True, "example": "https://example.com/parcel.png"},
                            "special_instructions": {"type": "string", "nullable": True, "example": "Handle with care"},
                        },
                    },
                    "CreateOrderRequest": {
                        "type": "object",
                        "required": ["pickup_location_id", "delivery_location_id", "quoted_price", "parcel"],
                        "properties": {
                            "pickup_location_id": {"type": "integer", "example": 1},
                            "delivery_location_id": {"type": "integer", "example": 2},
                            "quoted_price": {"type": "number", "format": "float", "example": 450.0},
                            "parcel": {"$ref": "#/components/schemas/ParcelInput"},
                        },
                    },
                    "UpdateDestinationRequest": {
                        "type": "object",
                        "required": ["delivery_location_id"],
                        "properties": {
                            "delivery_location_id": {"type": "integer", "example": 4},
                        },
                    },
                    "CancelOrderRequest": {
                        "type": "object",
                        "properties": {
                            "reason": {
                                "type": "string",
                                "maxLength": 500,
                                "nullable": True,
                                "example": "Customer requested cancellation.",
                            }
                        },
                    },
                    "UpdateOrderStatusRequest": {
                        "type": "object",
                        "required": ["status"],
                        "properties": {
                            "status": {
                                "type": "string",
                                "enum": ["pending", "confirmed", "in_transit", "delivered", "cancelled"],
                                "example": "confirmed",
                            }
                        },
                    },
                    "UpdateOrderLocationRequest": {
                        "type": "object",
                        "required": ["location_id"],
                        "properties": {
                            "location_id": {"type": "integer", "example": 3},
                        },
                    },
                    "CreateTrackingUpdateRequest": {
                        "type": "object",
                        "required": ["status"],
                        "properties": {
                            "status": {
                                "type": "string",
                                "enum": ["pending", "confirmed", "in_transit", "delivered", "cancelled"],
                                "example": "in_transit",
                            },
                            "location_id": {"type": "integer", "nullable": True, "example": 3},
                            "note": {"type": "string", "nullable": True, "example": "Driver has left the warehouse."},
                        },
                    },
                    "PaginationMeta": {
                        "type": "object",
                        "properties": {
                            "page": {"type": "integer", "example": 1},
                            "limit": {"type": "integer", "example": 10},
                            "total": {"type": "integer", "example": 42},
                        },
                    },
                    "AuthUserResponseData": {
                        "type": "object",
                        "properties": {
                            "user": {"$ref": "#/components/schemas/User"},
                        },
                    },
                    "LoginResponseData": {
                        "type": "object",
                        "properties": {
                            "access_token": {"type": "string", "example": "<jwt>"},
                            "user": {"$ref": "#/components/schemas/User"},
                        },
                    },
                    "OrderResponseData": {
                        "type": "object",
                        "properties": {
                            "order": {"$ref": "#/components/schemas/Order"},
                        },
                    },
                    "OrdersListResponseData": {
                        "type": "object",
                        "properties": {
                            "items": {
                                "type": "array",
                                "items": {"$ref": "#/components/schemas/Order"},
                            },
                            "page": {"type": "integer", "example": 1},
                            "limit": {"type": "integer", "example": 10},
                            "total": {"type": "integer", "example": 42},
                        },
                    },
                    "TrackingUpdateResponseData": {
                        "type": "object",
                        "properties": {
                            "tracking_update": {"$ref": "#/components/schemas/TrackingUpdate"},
                        },
                    },
                    "TrackingUpdatesListResponseData": {
                        "type": "object",
                        "properties": {
                            "updates": {
                                "type": "array",
                                "items": {"$ref": "#/components/schemas/TrackingUpdate"},
                            }
                        },
                    },
                    "SuccessResponse": {
                        "type": "object",
                        "properties": {
                            "success": {"type": "boolean", "example": True},
                            "message": {"type": "string", "example": "Request completed successfully."},
                            "data": {"type": "object"},
                        },
                    },
                    "ErrorResponse": {
                        "type": "object",
                        "properties": {
                            "success": {"type": "boolean", "example": False},
                            "message": {"type": "string", "example": "Validation failed."},
                            "errors": {
                                "type": "object",
                                "additionalProperties": {
                                    "type": "array",
                                    "items": {"type": "string"},
                                },
                            },
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
                                    "schema": {"$ref": "#/components/schemas/RegistrationRequest"}
                                }
                            },
                        },
                        "responses": {
                            "201": {
                                "description": "User registered successfully",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "allOf": [
                                                {"$ref": "#/components/schemas/SuccessResponse"},
                                                {
                                                    "type": "object",
                                                    "properties": {
                                                        "data": {"$ref": "#/components/schemas/AuthUserResponseData"}
                                                    },
                                                },
                                            ]
                                        }
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
                                    "schema": {"$ref": "#/components/schemas/LoginRequest"}
                                }
                            },
                        },
                        "responses": {
                            "200": {
                                "description": "Login successful",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "allOf": [
                                                {"$ref": "#/components/schemas/SuccessResponse"},
                                                {
                                                    "type": "object",
                                                    "properties": {
                                                        "data": {"$ref": "#/components/schemas/LoginResponseData"}
                                                    },
                                                },
                                            ]
                                        }
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
                                        "schema": {
                                            "allOf": [
                                                {"$ref": "#/components/schemas/SuccessResponse"},
                                                {
                                                    "type": "object",
                                                    "properties": {
                                                        "data": {"$ref": "#/components/schemas/AuthUserResponseData"}
                                                    },
                                                },
                                            ]
                                        }
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
                },
                "/api/orders/": {
                    "post": {
                        "summary": "Create an order",
                        "tags": ["Orders"],
                        "security": [{"bearerAuth": []}],
                        "requestBody": {
                            "required": True,
                            "content": {
                                "application/json": {
                                    "schema": {"$ref": "#/components/schemas/CreateOrderRequest"}
                                }
                            },
                        },
                        "responses": {
                            "201": {
                                "description": "Order created successfully",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "allOf": [
                                                {"$ref": "#/components/schemas/SuccessResponse"},
                                                {
                                                    "type": "object",
                                                    "properties": {
                                                        "data": {"$ref": "#/components/schemas/OrderResponseData"}
                                                    },
                                                },
                                            ]
                                        }
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
                                "description": "Authentication required",
                                "content": {
                                    "application/json": {
                                        "schema": {"$ref": "#/components/schemas/ErrorResponse"}
                                    }
                                },
                            },
                            "404": {
                                "description": "Referenced location or weight category was not found",
                                "content": {
                                    "application/json": {
                                        "schema": {"$ref": "#/components/schemas/ErrorResponse"}
                                    }
                                },
                            },
                        },
                    },
                    "get": {
                        "summary": "List orders for the authenticated user",
                        "tags": ["Orders"],
                        "security": [{"bearerAuth": []}],
                        "parameters": [
                            {
                                "name": "page",
                                "in": "query",
                                "schema": {"type": "integer", "default": 1, "minimum": 1},
                                "required": False,
                                "description": "Page number for paginated results.",
                            },
                            {
                                "name": "limit",
                                "in": "query",
                                "schema": {"type": "integer", "default": 10, "minimum": 1},
                                "required": False,
                                "description": "Maximum number of orders to return.",
                            },
                        ],
                        "responses": {
                            "200": {
                                "description": "Orders retrieved successfully",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "allOf": [
                                                {"$ref": "#/components/schemas/SuccessResponse"},
                                                {
                                                    "type": "object",
                                                    "properties": {
                                                        "data": {"$ref": "#/components/schemas/OrdersListResponseData"}
                                                    },
                                                },
                                            ]
                                        }
                                    }
                                },
                            },
                            "401": {
                                "description": "Authentication required",
                                "content": {
                                    "application/json": {
                                        "schema": {"$ref": "#/components/schemas/ErrorResponse"}
                                    }
                                },
                            },
                        },
                    },
                },
                "/api/orders/{order_id}": {
                    "get": {
                        "summary": "Get order details",
                        "tags": ["Orders"],
                        "security": [{"bearerAuth": []}],
                        "parameters": [
                            {
                                "name": "order_id",
                                "in": "path",
                                "required": True,
                                "schema": {"type": "integer"},
                                "description": "Order ID.",
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "Order details retrieved successfully",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "allOf": [
                                                {"$ref": "#/components/schemas/SuccessResponse"},
                                                {
                                                    "type": "object",
                                                    "properties": {
                                                        "data": {"$ref": "#/components/schemas/OrderResponseData"}
                                                    },
                                                },
                                            ]
                                        }
                                    }
                                },
                            },
                            "401": {
                                "description": "Authentication required",
                                "content": {
                                    "application/json": {
                                        "schema": {"$ref": "#/components/schemas/ErrorResponse"}
                                    }
                                },
                            },
                            "403": {
                                "description": "Authenticated user does not have access to this order",
                                "content": {
                                    "application/json": {
                                        "schema": {"$ref": "#/components/schemas/ErrorResponse"}
                                    }
                                },
                            },
                            "404": {
                                "description": "Order not found",
                                "content": {
                                    "application/json": {
                                        "schema": {"$ref": "#/components/schemas/ErrorResponse"}
                                    }
                                },
                            },
                        },
                    }
                },
                "/api/orders/{order_id}/destination": {
                    "patch": {
                        "summary": "Update order destination",
                        "tags": ["Orders"],
                        "security": [{"bearerAuth": []}],
                        "parameters": [
                            {
                                "name": "order_id",
                                "in": "path",
                                "required": True,
                                "schema": {"type": "integer"},
                                "description": "Order ID.",
                            }
                        ],
                        "requestBody": {
                            "required": True,
                            "content": {
                                "application/json": {
                                    "schema": {"$ref": "#/components/schemas/UpdateDestinationRequest"}
                                }
                            },
                        },
                        "responses": {
                            "200": {
                                "description": "Order destination updated successfully",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "allOf": [
                                                {"$ref": "#/components/schemas/SuccessResponse"},
                                                {
                                                    "type": "object",
                                                    "properties": {
                                                        "data": {"$ref": "#/components/schemas/OrderResponseData"}
                                                    },
                                                },
                                            ]
                                        }
                                    }
                                },
                            },
                            "400": {
                                "description": "Validation failed or order cannot be updated",
                                "content": {
                                    "application/json": {
                                        "schema": {"$ref": "#/components/schemas/ErrorResponse"}
                                    }
                                },
                            },
                            "401": {
                                "description": "Authentication required",
                                "content": {
                                    "application/json": {
                                        "schema": {"$ref": "#/components/schemas/ErrorResponse"}
                                    }
                                },
                            },
                            "403": {
                                "description": "Authenticated user does not have access to this order",
                                "content": {
                                    "application/json": {
                                        "schema": {"$ref": "#/components/schemas/ErrorResponse"}
                                    }
                                },
                            },
                            "404": {
                                "description": "Order or location not found",
                                "content": {
                                    "application/json": {
                                        "schema": {"$ref": "#/components/schemas/ErrorResponse"}
                                    }
                                },
                            },
                        },
                    }
                },
                "/api/orders/{order_id}/cancel": {
                    "patch": {
                        "summary": "Cancel an order",
                        "tags": ["Orders"],
                        "security": [{"bearerAuth": []}],
                        "parameters": [
                            {
                                "name": "order_id",
                                "in": "path",
                                "required": True,
                                "schema": {"type": "integer"},
                                "description": "Order ID.",
                            }
                        ],
                        "requestBody": {
                            "required": False,
                            "content": {
                                "application/json": {
                                    "schema": {"$ref": "#/components/schemas/CancelOrderRequest"}
                                }
                            },
                        },
                        "responses": {
                            "200": {
                                "description": "Order cancelled successfully",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "allOf": [
                                                {"$ref": "#/components/schemas/SuccessResponse"},
                                                {
                                                    "type": "object",
                                                    "properties": {
                                                        "data": {"$ref": "#/components/schemas/OrderResponseData"}
                                                    },
                                                },
                                            ]
                                        }
                                    }
                                },
                            },
                            "400": {
                                "description": "Validation failed or order cannot be cancelled",
                                "content": {
                                    "application/json": {
                                        "schema": {"$ref": "#/components/schemas/ErrorResponse"}
                                    }
                                },
                            },
                            "401": {
                                "description": "Authentication required",
                                "content": {
                                    "application/json": {
                                        "schema": {"$ref": "#/components/schemas/ErrorResponse"}
                                    }
                                },
                            },
                            "403": {
                                "description": "Authenticated user does not have access to this order",
                                "content": {
                                    "application/json": {
                                        "schema": {"$ref": "#/components/schemas/ErrorResponse"}
                                    }
                                },
                            },
                            "404": {
                                "description": "Order not found",
                                "content": {
                                    "application/json": {
                                        "schema": {"$ref": "#/components/schemas/ErrorResponse"}
                                    }
                                },
                            },
                        },
                    }
                },
                "/api/orders/{order_id}/status": {
                    "patch": {
                        "summary": "Admin: update order status",
                        "tags": ["Orders"],
                        "security": [{"bearerAuth": []}],
                        "parameters": [
                            {
                                "name": "order_id",
                                "in": "path",
                                "required": True,
                                "schema": {"type": "integer"},
                                "description": "Order ID.",
                            }
                        ],
                        "requestBody": {
                            "required": True,
                            "content": {
                                "application/json": {
                                    "schema": {"$ref": "#/components/schemas/UpdateOrderStatusRequest"}
                                }
                            },
                        },
                        "responses": {
                            "200": {
                                "description": "Order status updated successfully",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "allOf": [
                                                {"$ref": "#/components/schemas/SuccessResponse"},
                                                {
                                                    "type": "object",
                                                    "properties": {
                                                        "data": {"$ref": "#/components/schemas/OrderResponseData"}
                                                    },
                                                },
                                            ]
                                        }
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
                                "description": "Authentication required",
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
                            "404": {
                                "description": "Order not found",
                                "content": {
                                    "application/json": {
                                        "schema": {"$ref": "#/components/schemas/ErrorResponse"}
                                    }
                                },
                            },
                        },
                    }
                },
                "/api/orders/{order_id}/location": {
                    "patch": {
                        "summary": "Admin: update current order location",
                        "tags": ["Orders"],
                        "security": [{"bearerAuth": []}],
                        "parameters": [
                            {
                                "name": "order_id",
                                "in": "path",
                                "required": True,
                                "schema": {"type": "integer"},
                                "description": "Order ID.",
                            }
                        ],
                        "requestBody": {
                            "required": True,
                            "content": {
                                "application/json": {
                                    "schema": {"$ref": "#/components/schemas/UpdateOrderLocationRequest"}
                                }
                            },
                        },
                        "responses": {
                            "200": {
                                "description": "Order location updated successfully",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "allOf": [
                                                {"$ref": "#/components/schemas/SuccessResponse"},
                                                {
                                                    "type": "object",
                                                    "properties": {
                                                        "data": {"$ref": "#/components/schemas/OrderResponseData"}
                                                    },
                                                },
                                            ]
                                        }
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
                                "description": "Authentication required",
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
                            "404": {
                                "description": "Order or location not found",
                                "content": {
                                    "application/json": {
                                        "schema": {"$ref": "#/components/schemas/ErrorResponse"}
                                    }
                                },
                            },
                        },
                    }
                },
                "/api/tracking/{order_id}": {
                    "get": {
                        "summary": "List tracking updates for an order",
                        "tags": ["Tracking"],
                        "security": [{"bearerAuth": []}],
                        "parameters": [
                            {
                                "name": "order_id",
                                "in": "path",
                                "required": True,
                                "schema": {"type": "integer"},
                                "description": "Order ID.",
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "Tracking updates retrieved successfully",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "allOf": [
                                                {"$ref": "#/components/schemas/SuccessResponse"},
                                                {
                                                    "type": "object",
                                                    "properties": {
                                                        "data": {"$ref": "#/components/schemas/TrackingUpdatesListResponseData"}
                                                    },
                                                },
                                            ]
                                        }
                                    }
                                },
                            },
                            "401": {
                                "description": "Authentication required",
                                "content": {
                                    "application/json": {
                                        "schema": {"$ref": "#/components/schemas/ErrorResponse"}
                                    }
                                },
                            },
                            "403": {
                                "description": "Authenticated user does not have access to this order",
                                "content": {
                                    "application/json": {
                                        "schema": {"$ref": "#/components/schemas/ErrorResponse"}
                                    }
                                },
                            },
                            "404": {
                                "description": "Order not found",
                                "content": {
                                    "application/json": {
                                        "schema": {"$ref": "#/components/schemas/ErrorResponse"}
                                    }
                                },
                            },
                        },
                    },
                    "post": {
                        "summary": "Admin: create a tracking update",
                        "tags": ["Tracking"],
                        "security": [{"bearerAuth": []}],
                        "parameters": [
                            {
                                "name": "order_id",
                                "in": "path",
                                "required": True,
                                "schema": {"type": "integer"},
                                "description": "Order ID.",
                            }
                        ],
                        "requestBody": {
                            "required": True,
                            "content": {
                                "application/json": {
                                    "schema": {"$ref": "#/components/schemas/CreateTrackingUpdateRequest"}
                                }
                            },
                        },
                        "responses": {
                            "201": {
                                "description": "Tracking update created successfully",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "allOf": [
                                                {"$ref": "#/components/schemas/SuccessResponse"},
                                                {
                                                    "type": "object",
                                                    "properties": {
                                                        "data": {"$ref": "#/components/schemas/TrackingUpdateResponseData"}
                                                    },
                                                },
                                            ]
                                        }
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
                                "description": "Authentication required",
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
                            "404": {
                                "description": "Order or location not found",
                                "content": {
                                    "application/json": {
                                        "schema": {"$ref": "#/components/schemas/ErrorResponse"}
                                    }
                                },
                            },
                        },
                    },
                },
            },
        }
    )
