const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000/api").replace(/\/$/, "");

async function parseJsonSafely(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function buildNetworkError(error) {
  const isConnectionFailure = error instanceof TypeError;

  return {
    status: 0,
    message: isConnectionFailure
      ? `Could not reach the backend at ${API_BASE_URL}. Make sure the API server is running and accessible.`
      : "Network request failed.",
    errors: {},
  };
}

export async function apiRequest(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
        ...(options.headers ?? {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch (error) {
    throw buildNetworkError(error);
  }

  const payload = await parseJsonSafely(response);

  if (!response.ok) {
    throw {
      status: response.status,
      message: payload?.message ?? "Request failed.",
      errors: payload?.errors ?? {},
    };
  }

  return payload;
}
