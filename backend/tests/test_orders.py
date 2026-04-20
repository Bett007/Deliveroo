from app.extensions import db
from app.models import Location, WeightCategory


def register_user(client, email="user@example.com", password="Password123", role="customer"):
    response = client.post(
        "/api/auth/register",
        json={"email": email, "password": password, "role": role},
    )
    code = response.get_json()["data"]["verification"]["code"]
    client.post(
        "/api/auth/verify",
        json={"email": email, "code": code},
    )
    return response


def login_user(client, email="user@example.com", password="Password123"):
    response = client.post(
        "/api/auth/login",
        json={"email": email, "password": password},
    )
    return response.get_json()["data"]["access_token"]


def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


def create_reference_data(app):
    with app.app_context():
        pickup = Location(
            address="Westlands Pickup Hub, Waiyaki Way",
            city="Nairobi",
            country="Kenya",
            latitude=-1.2676,
            longitude=36.8108,
        )
        delivery = Location(
            address="Kilimani Dispatch Point, Ngong Road",
            city="Nairobi",
            country="Kenya",
            latitude=-1.2921,
            longitude=36.7831,
        )
        current = Location(
            address="CBD Customer Desk, Kenyatta Avenue",
            city="Nairobi",
            country="Kenya",
            latitude=-1.2864,
            longitude=36.8172,
        )
        weight_category = WeightCategory(
            name="light",
            min_weight=0,
            max_weight=2,
            base_price=250,
        )

        db.session.add_all([pickup, delivery, current, weight_category])
        db.session.commit()

        return {
            "pickup_location_id": pickup.id,
            "delivery_location_id": delivery.id,
            "current_location_id": current.id,
            "weight_category_id": weight_category.id,
        }


def build_order_payload(reference_ids):
    return {
        "pickup_location_id": reference_ids["pickup_location_id"],
        "delivery_location_id": reference_ids["delivery_location_id"],
        "quoted_price": 450,
        "parcel": {
            "description": "Small electronics package",
            "weight": 1.5,
            "weight_category_id": reference_ids["weight_category_id"],
            "special_instructions": "Handle with care",
        },
    }


def create_order(client, token, payload):
    return client.post(
        "/api/orders/",
        json=payload,
        headers=auth_headers(token),
    )


def test_create_order_success(client, app):
    reference_ids = create_reference_data(app)
    register_user(client)
    token = login_user(client)

    response = create_order(client, token, build_order_payload(reference_ids))
    body = response.get_json()

    assert response.status_code == 201
    assert body["success"] is True
    assert body["data"]["order"]["pickup_location_id"] == reference_ids["pickup_location_id"]
    assert body["data"]["order"]["delivery_location_id"] == reference_ids["delivery_location_id"]
    assert body["data"]["order"]["status"] == "pending"


def test_create_order_with_custom_addresses(client, app):
    reference_ids = create_reference_data(app)
    register_user(client)
    token = login_user(client)

    payload = {
        "quoted_price": 520,
        "pickup_location": {
            "address": "Lavington Business Center, Nairobi",
            "latitude": -1.2750,
            "longitude": 36.7850,
        },
        "delivery_location": {
            "address": "Karen Mall, Nairobi",
            "latitude": -1.3190,
            "longitude": 36.7270,
        },
        "parcel": {
            "description": "Garden tools",
            "weight": 3.2,
            "weight_category_id": reference_ids["weight_category_id"],
            "special_instructions": "Stack with care",
        },
    }

    response = create_order(client, token, payload)
    body = response.get_json()

    assert response.status_code == 201
    assert body["success"] is True
    assert body["data"]["order"]["pickup_location_id"] is not None
    assert body["data"]["order"]["delivery_location_id"] is not None
    assert body["data"]["order"]["distance_km"] is None
    assert body["data"]["order"]["estimated_duration_minutes"] is None
    assert body["data"]["order"]["status"] == "pending"


def test_create_order_rejects_validation_errors(client, app):
    reference_ids = create_reference_data(app)
    register_user(client)
    token = login_user(client)
    payload = build_order_payload(reference_ids)
    payload["quoted_price"] = -10

    response = create_order(client, token, payload)
    body = response.get_json()

    assert response.status_code == 400
    assert body["success"] is False
    assert body["message"] == "Validation failed."
    assert body["errors"]["quoted_price"] == ["Quoted price must be a valid number."]


def test_create_order_rejects_invalid_parcel_payload(client, app):
    reference_ids = create_reference_data(app)
    register_user(client)
    token = login_user(client)
    payload = build_order_payload(reference_ids)
    payload["parcel"]["description"] = ""

    response = create_order(client, token, payload)
    body = response.get_json()

    assert response.status_code == 400
    assert body["success"] is False
    assert body["message"] == "Validation failed."
    assert body["errors"]["description"] == ["Parcel description is required."]


def test_list_orders_returns_only_authenticated_users_orders(client, app):
    reference_ids = create_reference_data(app)
    register_user(client, email="customer1@example.com")
    register_user(client, email="customer2@example.com")
    token_one = login_user(client, email="customer1@example.com")
    token_two = login_user(client, email="customer2@example.com")

    create_order(client, token_one, build_order_payload(reference_ids))
    create_order(client, token_two, build_order_payload(reference_ids))

    response = client.get("/api/orders/?page=1&limit=10", headers=auth_headers(token_one))
    body = response.get_json()

    assert response.status_code == 200
    assert body["success"] is True
    assert body["data"]["page"] == 1
    assert body["data"]["limit"] == 10
    assert body["data"]["total"] == 1
    assert len(body["data"]["items"]) == 1


def test_get_order_returns_details_for_owner(client, app):
    reference_ids = create_reference_data(app)
    register_user(client)
    token = login_user(client)
    create_response = create_order(client, token, build_order_payload(reference_ids))
    order_id = create_response.get_json()["data"]["order"]["id"]

    response = client.get(f"/api/orders/{order_id}", headers=auth_headers(token))
    body = response.get_json()

    assert response.status_code == 200
    assert body["data"]["order"]["id"] == order_id


def test_get_order_rejects_non_owner(client, app):
    reference_ids = create_reference_data(app)
    register_user(client, email="owner@example.com")
    register_user(client, email="other@example.com")
    owner_token = login_user(client, email="owner@example.com")
    other_token = login_user(client, email="other@example.com")
    create_response = create_order(client, owner_token, build_order_payload(reference_ids))
    order_id = create_response.get_json()["data"]["order"]["id"]

    response = client.get(f"/api/orders/{order_id}", headers=auth_headers(other_token))
    body = response.get_json()

    assert response.status_code == 403
    assert body["message"] == "You do not have permission to access this order."


def test_update_destination_success(client, app):
    reference_ids = create_reference_data(app)
    register_user(client)
    token = login_user(client)
    create_response = create_order(client, token, build_order_payload(reference_ids))
    order_id = create_response.get_json()["data"]["order"]["id"]

    response = client.patch(
        f"/api/orders/{order_id}/destination",
        json={"delivery_location_id": reference_ids["current_location_id"]},
        headers=auth_headers(token),
    )
    body = response.get_json()

    assert response.status_code == 200
    assert body["data"]["order"]["delivery_location_id"] == reference_ids["current_location_id"]


def test_cancel_order_success(client, app):
    reference_ids = create_reference_data(app)
    register_user(client)
    token = login_user(client)
    create_response = create_order(client, token, build_order_payload(reference_ids))
    order_id = create_response.get_json()["data"]["order"]["id"]

    response = client.patch(
        f"/api/orders/{order_id}/cancel",
        json={"reason": "Customer requested cancellation."},
        headers=auth_headers(token),
    )
    body = response.get_json()

    assert response.status_code == 200
    assert body["data"]["order"]["status"] == "cancelled"


def test_admin_can_update_order_status_and_location(client, app):
    reference_ids = create_reference_data(app)
    register_user(client, email="customer@example.com", role="customer")
    register_user(client, email="admin@example.com", role="admin")
    customer_token = login_user(client, email="customer@example.com")
    admin_token = login_user(client, email="admin@example.com")
    create_response = create_order(client, customer_token, build_order_payload(reference_ids))
    order_id = create_response.get_json()["data"]["order"]["id"]

    status_response = client.patch(
        f"/api/orders/{order_id}/status",
        json={"status": "in_transit"},
        headers=auth_headers(admin_token),
    )
    location_response = client.patch(
        f"/api/orders/{order_id}/location",
        json={"location_id": reference_ids["current_location_id"]},
        headers=auth_headers(admin_token),
    )

    assert status_response.status_code == 200
    assert status_response.get_json()["data"]["order"]["status"] == "in_transit"
    assert location_response.status_code == 200
    assert location_response.get_json()["data"]["order"]["current_location_id"] == reference_ids["current_location_id"]


def test_non_admin_cannot_update_order_status_or_location(client, app):
    reference_ids = create_reference_data(app)
    register_user(client)
    token = login_user(client)
    create_response = create_order(client, token, build_order_payload(reference_ids))
    order_id = create_response.get_json()["data"]["order"]["id"]

    status_response = client.patch(
        f"/api/orders/{order_id}/status",
        json={"status": "in_transit"},
        headers=auth_headers(token),
    )
    location_response = client.patch(
        f"/api/orders/{order_id}/location",
        json={"location_id": reference_ids["current_location_id"]},
        headers=auth_headers(token),
    )

    assert status_response.status_code == 403
    assert location_response.status_code == 403


def test_rider_can_accept_and_update_open_delivery(client, app):
    reference_ids = create_reference_data(app)
    register_user(client, email="customer@example.com", role="customer")
    register_user(client, email="rider@example.com", role="rider")
    customer_token = login_user(client, email="customer@example.com")
    rider_token = login_user(client, email="rider@example.com")
    create_response = create_order(client, customer_token, build_order_payload(reference_ids))
    order_id = create_response.get_json()["data"]["order"]["id"]

    assign_response = client.patch(
        f"/api/orders/{order_id}/assign",
        json={},
        headers=auth_headers(rider_token),
    )
    status_response = client.patch(
        f"/api/orders/{order_id}/status",
        json={"status": "in_transit"},
        headers=auth_headers(rider_token),
    )
    location_response = client.patch(
        f"/api/orders/{order_id}/location",
        json={"location_id": reference_ids["current_location_id"]},
        headers=auth_headers(rider_token),
    )

    assert assign_response.status_code == 200
    assert assign_response.get_json()["data"]["order"]["assigned_rider"]["email"] == "rider@example.com"
    assert assign_response.get_json()["data"]["order"]["status"] == "confirmed"
    assert status_response.status_code == 200
    assert status_response.get_json()["data"]["order"]["picked_up_at"] is not None
    assert location_response.status_code == 200
    assert location_response.get_json()["data"]["order"]["current_location_id"] == reference_ids["current_location_id"]


def test_second_rider_cannot_update_assigned_delivery(client, app):
    reference_ids = create_reference_data(app)
    register_user(client, email="customer@example.com", role="customer")
    register_user(client, email="rider1@example.com", role="rider")
    register_user(client, email="rider2@example.com", role="rider")
    customer_token = login_user(client, email="customer@example.com")
    rider_one_token = login_user(client, email="rider1@example.com")
    rider_two_token = login_user(client, email="rider2@example.com")
    create_response = create_order(client, customer_token, build_order_payload(reference_ids))
    order_id = create_response.get_json()["data"]["order"]["id"]

    client.patch(
        f"/api/orders/{order_id}/assign",
        json={},
        headers=auth_headers(rider_one_token),
    )
    response = client.patch(
        f"/api/orders/{order_id}/status",
        json={"status": "in_transit"},
        headers=auth_headers(rider_two_token),
    )

    assert response.status_code == 403
    assert response.get_json()["message"] == "Accept this delivery before updating it."


def test_rider_can_see_own_delivered_orders_in_list(client, app):
    reference_ids = create_reference_data(app)
    register_user(client, email="customer@example.com", role="customer")
    register_user(client, email="rider@example.com", role="rider")
    customer_token = login_user(client, email="customer@example.com")
    rider_token = login_user(client, email="rider@example.com")
    create_response = create_order(client, customer_token, build_order_payload(reference_ids))
    order_id = create_response.get_json()["data"]["order"]["id"]

    client.patch(
        f"/api/orders/{order_id}/assign",
        json={},
        headers=auth_headers(rider_token),
    )
    deliver_response = client.patch(
        f"/api/orders/{order_id}/status",
        json={"status": "delivered"},
        headers=auth_headers(rider_token),
    )
    list_response = client.get("/api/orders/?page=1&limit=20", headers=auth_headers(rider_token))

    assert deliver_response.status_code == 200
    assert deliver_response.get_json()["data"]["order"]["status"] == "delivered"
    assert list_response.status_code == 200
    assert any(
        item["id"] == order_id and item["status"] == "delivered"
        for item in list_response.get_json()["data"]["items"]
    )


def test_tracking_updates_create_and_list(client, app):
    reference_ids = create_reference_data(app)
    register_user(client, email="customer@example.com", role="customer")
    register_user(client, email="admin@example.com", role="admin")
    customer_token = login_user(client, email="customer@example.com")
    admin_token = login_user(client, email="admin@example.com")
    create_response = create_order(client, customer_token, build_order_payload(reference_ids))
    order_id = create_response.get_json()["data"]["order"]["id"]

    create_tracking_response = client.post(
        f"/api/tracking/{order_id}",
        json={
            "status": "in_transit",
            "location_id": reference_ids["current_location_id"],
            "note": "Driver has picked up the parcel.",
        },
        headers=auth_headers(admin_token),
    )
    list_response = client.get(f"/api/tracking/{order_id}", headers=auth_headers(customer_token))

    assert create_tracking_response.status_code == 201
    assert create_tracking_response.get_json()["data"]["tracking_update"]["status"] == "in_transit"
    assert list_response.status_code == 200
    assert len(list_response.get_json()["data"]["updates"]) == 1


def test_tracking_update_rejects_invalid_payload(client, app):
    reference_ids = create_reference_data(app)
    register_user(client, email="customer@example.com", role="customer")
    register_user(client, email="admin@example.com", role="admin")
    customer_token = login_user(client, email="customer@example.com")
    admin_token = login_user(client, email="admin@example.com")
    create_response = create_order(client, customer_token, build_order_payload(reference_ids))
    order_id = create_response.get_json()["data"]["order"]["id"]

    response = client.post(
        f"/api/tracking/{order_id}",
        json={"status": "flying"},
        headers=auth_headers(admin_token),
    )
    body = response.get_json()

    assert response.status_code == 400
    assert body["message"] == "Validation failed."
    assert body["errors"]["status"] == [
        "Status must be one of: cancelled, confirmed, delivered, in_transit, pending."
    ]


def test_customer_cannot_create_tracking_update(client, app):
    reference_ids = create_reference_data(app)
    register_user(client)
    token = login_user(client)
    create_response = create_order(client, token, build_order_payload(reference_ids))
    order_id = create_response.get_json()["data"]["order"]["id"]

    response = client.post(
        f"/api/tracking/{order_id}",
        json={"status": "in_transit"},
        headers=auth_headers(token),
    )
    body = response.get_json()

    assert response.status_code == 403
    assert body["message"] == "You do not have permission to access this resource."


def test_cancel_order_rejects_delivered_order(client, app):
    reference_ids = create_reference_data(app)
    register_user(client, email="customer@example.com", role="customer")
    register_user(client, email="admin@example.com", role="admin")
    customer_token = login_user(client, email="customer@example.com")
    admin_token = login_user(client, email="admin@example.com")
    create_response = create_order(client, customer_token, build_order_payload(reference_ids))
    order_id = create_response.get_json()["data"]["order"]["id"]

    client.patch(
        f"/api/orders/{order_id}/status",
        json={"status": "delivered"},
        headers=auth_headers(admin_token),
    )
    response = client.patch(
        f"/api/orders/{order_id}/cancel",
        json={"reason": "Too late"},
        headers=auth_headers(customer_token),
    )
    body = response.get_json()

    assert response.status_code == 400
    assert body["message"] == "Delivered orders cannot be cancelled."


def test_destination_update_rejects_cancelled_order(client, app):
    reference_ids = create_reference_data(app)
    register_user(client)
    token = login_user(client)
    create_response = create_order(client, token, build_order_payload(reference_ids))
    order_id = create_response.get_json()["data"]["order"]["id"]

    client.patch(
        f"/api/orders/{order_id}/cancel",
        json={"reason": "Changed my mind"},
        headers=auth_headers(token),
    )
    response = client.patch(
        f"/api/orders/{order_id}/destination",
        json={"delivery_location_id": reference_ids["current_location_id"]},
        headers=auth_headers(token),
    )
    body = response.get_json()

    assert response.status_code == 400
    assert body["message"] == "Cancelled orders cannot be updated."


def test_order_listing_paginates_results(client, app):
    reference_ids = create_reference_data(app)
    register_user(client)
    token = login_user(client)

    for _ in range(3):
        create_order(client, token, build_order_payload(reference_ids))

    response = client.get("/api/orders/?page=2&limit=2", headers=auth_headers(token))
    body = response.get_json()

    assert response.status_code == 200
    assert body["data"]["page"] == 2
    assert body["data"]["limit"] == 2
    assert body["data"]["total"] == 3
    assert len(body["data"]["items"]) == 1


def test_missing_token_rejects_order_routes(client):
    response = client.get("/api/orders/")
    body = response.get_json()

    assert response.status_code == 401
    assert body["message"] == "Authentication token is missing."


def test_admin_can_view_another_users_tracking_updates(client, app):
    reference_ids = create_reference_data(app)
    register_user(client, email="customer@example.com", role="customer")
    register_user(client, email="admin@example.com", role="admin")
    customer_token = login_user(client, email="customer@example.com")
    admin_token = login_user(client, email="admin@example.com")
    create_response = create_order(client, customer_token, build_order_payload(reference_ids))
    order_id = create_response.get_json()["data"]["order"]["id"]

    client.post(
        f"/api/tracking/{order_id}",
        json={"status": "confirmed", "note": "Order confirmed."},
        headers=auth_headers(admin_token),
    )
    response = client.get(f"/api/tracking/{order_id}", headers=auth_headers(admin_token))

    assert response.status_code == 200
    assert response.get_json()["data"]["updates"][0]["status"] == "confirmed"


def test_order_detail_returns_not_found_for_unknown_order(client):
    register_user(client)
    token = login_user(client)

    response = client.get("/api/orders/9999", headers=auth_headers(token))
    body = response.get_json()

    assert response.status_code == 404
    assert body["message"] == "Order not found."
