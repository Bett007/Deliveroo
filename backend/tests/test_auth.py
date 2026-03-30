def register_user(client, email="user@example.com", password="Password123", role="customer"):
    return client.post(
        "/api/auth/register",
        json={"email": email, "password": password, "role": role},
    )


def login_user(client, email="user@example.com", password="Password123"):
    return client.post(
        "/api/auth/login",
        json={"email": email, "password": password},
    )


def test_register_user_success(client):
    response = register_user(client)
    body = response.get_json()

    assert response.status_code == 201
    assert body["success"] is True
    assert body["data"]["user"]["email"] == "user@example.com"
    assert body["data"]["user"]["role"] == "customer"


def test_register_user_rejects_duplicate_email(client):
    register_user(client)

    response = register_user(client)
    body = response.get_json()

    assert response.status_code == 400
    assert body["success"] is False
    assert body["errors"]["email"] == ["A user with this email already exists."]


def test_login_success_returns_access_token(client):
    register_user(client)

    response = login_user(client)
    body = response.get_json()

    assert response.status_code == 200
    assert body["success"] is True
    assert isinstance(body["data"]["access_token"], str)
    assert body["data"]["user"]["email"] == "user@example.com"


def test_login_rejects_invalid_credentials(client):
    register_user(client)

    response = login_user(client, password="WrongPassword123")
    body = response.get_json()

    assert response.status_code == 401
    assert body == {
        "success": False,
        "message": "Invalid email or password.",
    }


def test_protected_route_rejects_missing_token(client):
    response = client.get("/api/auth/me")
    body = response.get_json()

    assert response.status_code == 401
    assert body == {
        "success": False,
        "message": "Authentication token is missing.",
    }


def test_protected_route_allows_valid_token(client):
    register_user(client)
    login_response = login_user(client)
    token = login_response.get_json()["data"]["access_token"]

    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    body = response.get_json()

    assert response.status_code == 200
    assert body["success"] is True
    assert body["data"]["user"]["email"] == "user@example.com"


def test_admin_route_rejects_non_admin_user(client):
    register_user(client, email="customer@example.com", role="customer")
    token = login_user(client, email="customer@example.com").get_json()["data"][
        "access_token"
    ]

    response = client.get(
        "/api/auth/admin-check",
        headers={"Authorization": f"Bearer {token}"},
    )
    body = response.get_json()

    assert response.status_code == 403
    assert body == {
        "success": False,
        "message": "You do not have permission to access this resource.",
    }


def test_admin_route_allows_admin_user(client):
    register_user(client, email="admin@example.com", role="admin")
    token = login_user(client, email="admin@example.com").get_json()["data"][
        "access_token"
    ]

    response = client.get(
        "/api/auth/admin-check",
        headers={"Authorization": f"Bearer {token}"},
    )
    body = response.get_json()

    assert response.status_code == 200
    assert body["success"] is True
    assert body["message"] == "Admin access confirmed."
