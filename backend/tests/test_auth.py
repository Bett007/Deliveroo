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


def verify_user(client, email="user@example.com", code="000000"):
    return client.post(
        "/api/auth/verify",
        json={"email": email, "code": code},
    )


def resend_verification_code(client, email="user@example.com"):
    return client.post(
        "/api/auth/resend-verification",
        json={"email": email},
    )


def forgot_password(client, email="user@example.com"):
    return client.post(
        "/api/auth/forgot-password",
        json={"email": email},
    )


def reset_password(client, email="user@example.com", code="000000", new_password="NewPassword123"):
    return client.post(
        "/api/auth/reset-password",
        json={"email": email, "code": code, "new_password": new_password},
    )


def test_register_user_success(client):
    response = register_user(client)
    body = response.get_json()

    assert response.status_code == 201
    assert body["success"] is True
    assert body["data"]["user"]["email"] == "user@example.com"
    assert body["data"]["user"]["role"] == "customer"
    assert body["data"]["user"]["is_verified"] is False
    assert len(body["data"]["verification"]["code"]) == 6


def test_register_user_rejects_duplicate_email(client):
    register_user(client)

    response = register_user(client)
    body = response.get_json()

    assert response.status_code == 400
    assert body["success"] is False
    assert body["errors"]["email"] == ["A user with this email already exists."]


def test_login_success_returns_access_token(client):
    registration = register_user(client).get_json()
    verify_user(client, code=registration["data"]["verification"]["code"])

    response = login_user(client)
    body = response.get_json()

    assert response.status_code == 200
    assert body["success"] is True
    assert isinstance(body["data"]["access_token"], str)
    assert body["data"]["user"]["email"] == "user@example.com"


def test_login_rejects_invalid_credentials(client):
    registration = register_user(client).get_json()
    verify_user(client, code=registration["data"]["verification"]["code"])

    response = login_user(client, password="WrongPassword123")
    body = response.get_json()

    assert response.status_code == 401
    assert body == {
        "success": False,
        "message": "Invalid email or password.",
    }


def test_login_rejects_unverified_user(client):
    register_user(client)

    response = login_user(client)
    body = response.get_json()

    assert response.status_code == 401
    assert body == {
        "success": False,
        "message": "Account verification is required before signing in.",
    }


def test_verify_user_success(client):
    registration = register_user(client).get_json()

    response = verify_user(client, code=registration["data"]["verification"]["code"])
    body = response.get_json()

    assert response.status_code == 200
    assert body["success"] is True
    assert body["data"]["user"]["is_verified"] is True
    assert body["message"] == "Account verified successfully. You can sign in now."


def test_verify_user_rejects_invalid_code(client):
    register_user(client)

    response = verify_user(client, code="999999")
    body = response.get_json()

    assert response.status_code == 401
    assert body == {
        "success": False,
        "message": "Verification code is invalid.",
    }


def test_resend_verification_generates_new_code(client):
    registration = register_user(client).get_json()
    original_code = registration["data"]["verification"]["code"]

    response = resend_verification_code(client)
    body = response.get_json()

    assert response.status_code == 200
    assert body["success"] is True
    assert body["data"]["verification"]["email"] == "user@example.com"
    assert body["data"]["verification"]["code"] != original_code


def test_resend_verification_rejects_verified_user(client):
    registration = register_user(client).get_json()
    verify_user(client, code=registration["data"]["verification"]["code"])

    response = resend_verification_code(client)
    body = response.get_json()

    assert response.status_code == 400
    assert body["success"] is False
    assert body["errors"]["email"] == ["This account is already verified."]


def test_protected_route_rejects_missing_token(client):
    response = client.get("/api/auth/me")
    body = response.get_json()

    assert response.status_code == 401
    assert body == {
        "success": False,
        "message": "Authentication token is missing.",
    }


def test_protected_route_allows_valid_token(client):
    registration = register_user(client).get_json()
    verify_user(client, code=registration["data"]["verification"]["code"])
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
    registration = register_user(client, email="customer@example.com", role="customer").get_json()
    verify_user(client, email="customer@example.com", code=registration["data"]["verification"]["code"])
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
    registration = register_user(client, email="admin@example.com", role="admin").get_json()
    verify_user(client, email="admin@example.com", code=registration["data"]["verification"]["code"])
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


def test_forgot_password_returns_reset_details_for_existing_user(client):
    registration = register_user(client).get_json()
    verify_user(client, code=registration["data"]["verification"]["code"])

    response = forgot_password(client)
    body = response.get_json()

    assert response.status_code == 200
    assert body["success"] is True
    assert body["data"]["reset"]["email"] == "user@example.com"
    assert len(body["data"]["reset"]["code"]) == 6


def test_forgot_password_does_not_fail_for_unknown_email(client):
    response = forgot_password(client, email="unknown@example.com")
    body = response.get_json()

    assert response.status_code == 200
    assert body["success"] is True
    assert "reset" not in body["data"]


def test_reset_password_success_allows_login_with_new_password(client):
    registration = register_user(client).get_json()
    verify_user(client, code=registration["data"]["verification"]["code"])
    forgot = forgot_password(client).get_json()
    code = forgot["data"]["reset"]["code"]

    reset_response = reset_password(client, code=code, new_password="NewPassword456")
    assert reset_response.status_code == 200

    login_old = login_user(client, password="Password123")
    assert login_old.status_code == 401

    login_new = login_user(client, password="NewPassword456")
    assert login_new.status_code == 200
