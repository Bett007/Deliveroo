import { apiRequest } from "./client";

export async function registerRequest(payload) {
  const response = await apiRequest("/auth/register", {
    method: "POST",
    body: payload,
  });

  return {
    user: response.data.user,
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

export async function verifyAdminAccess(token) {
  const response = await apiRequest("/auth/admin-check", { token });
  return response.data.user;
}
