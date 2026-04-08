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


def login_token(client, email="user@example.com", password="Password123"):
    response = client.post(
        "/api/auth/login",
        json={"email": email, "password": password},
    )
    return response.get_json()["data"]["access_token"]


def test_me_route_rejects_invalid_jwt(client):
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": "Bearer not-a-real-token"},
    )
    body = response.get_json()

    assert response.status_code == 401
    assert body == {
        "success": False,
        "message": "Invalid access token.",
    }


def test_api_routes_return_configured_cors_origin(client):
    origin = "http://localhost:5173"

    response = client.get(
        "/api/health",
        headers={"Origin": origin},
    )

    assert response.status_code == 200
    assert response.headers["Access-Control-Allow-Origin"] == origin


def test_order_list_rejects_invalid_pagination(client):
    register_user(client)
    token = login_token(client)

    response = client.get(
        "/api/orders/?page=0&limit=-1",
        headers={"Authorization": f"Bearer {token}"},
    )
    body = response.get_json()

    assert response.status_code == 400
    assert body["success"] is False
    assert body["message"] == "Validation failed."
    assert body["errors"]["page"] == ["Page must be an integer greater than or equal to 1."]
    assert body["errors"]["limit"] == ["Limit must be an integer greater than or equal to 1."]


def test_order_reference_data_returns_seedable_shapes(client, app):
    from app.extensions import db
    from app.models import Location, WeightCategory

    with app.app_context():
        db.session.add(Location(address="CBD Customer Desk, Kenyatta Avenue", city="Nairobi", country="Kenya", latitude=-1.2864, longitude=36.8172))
        db.session.add(WeightCategory(name="light", min_weight=0, max_weight=2, base_price=250))
        db.session.commit()

    register_user(client)
    token = login_token(client)

    response = client.get(
        "/api/orders/reference-data",
        headers={"Authorization": f"Bearer {token}"},
    )
    body = response.get_json()

    assert response.status_code == 200
    assert body["success"] is True
    assert len(body["data"]["locations"]) == 1
    assert len(body["data"]["weight_categories"]) == 1
