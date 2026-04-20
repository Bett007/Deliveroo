import { apiRequest } from "./client";

export async function registerRequest(payload) {
  const response = await apiRequest("/auth/register", {
    method: "POST",
    body: payload,
  });

  return {
    user: response.data.user,
    verification: response.data.verification,
    message: response.message,
  };
}

export async function loginRequest(payload) {
  const response = await apiRequest("/auth/login", {
    method: "POST",
    body: payload,
  });

  return {
    accessToken: response.data.access_token,
    user: response.data.user,
    message: response.message,
  };
}

export async function fetchCurrentUser(token) {
  const response = await apiRequest("/auth/me", { token });
  return { user: response.data.user };
}

export async function updateProfileRequest(token, payload) {
  const response = await apiRequest("/auth/me", {
    method: "PATCH",
    token,
    body: payload,
  });

  return {
    user: response.data.user,
    message: response.message,
  };
}

export async function verifyAdminAccess(token) {
  const response = await apiRequest("/auth/admin-check", { token });
  return response.data.user;
}

export async function verifyRegistrationRequest(payload) {
  const response = await apiRequest("/auth/verify", {
    method: "POST",
    body: payload,
  });

  return {
    user: response.data.user,
    message: response.message,
  };
}

export async function resendVerificationRequest(payload) {
  const response = await apiRequest("/auth/resend-verification", {
    method: "POST",
    body: payload,
  });

  return {
    verification: response.data.verification,
    message: response.message,
  };
}

export async function forgotPasswordRequest(payload) {
  const response = await apiRequest("/auth/forgot-password", {
    method: "POST",
    body: payload,
  });

  return {
    reset: response.data.reset ?? null,
    message: response.message,
  };
}

export async function resetPasswordRequest(payload) {
  const response = await apiRequest("/auth/reset-password", {
    method: "POST",
    body: payload,
  });

  return {
    message: response.message,
  };
}
