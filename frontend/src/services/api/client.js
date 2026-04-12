const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5001/api").replace(/\/$/, "");
const REQUEST_TIMEOUT_MS = 15000;

function isLocalApiUrl(url) {
  try {
    const parsed = new URL(url);
    return ["127.0.0.1", "localhost"].includes(parsed.hostname);
  } catch {
    return false;
  }
}

function assertDeployedFrontendIsNotUsingLocalApi() {
  if (typeof window === "undefined") {
    return;
  }

  const frontendHost = window.location.hostname;
  const frontendIsLocal = ["127.0.0.1", "localhost"].includes(frontendHost);

  if (!frontendIsLocal && isLocalApiUrl(API_BASE_URL)) {
    throw {
      status: 0,
      message: "Frontend is deployed but VITE_API_BASE_URL still points to localhost. Set it to your public backend URL.",
      errors: {},
    };
  }
}

async function parseJsonSafely(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function apiRequest(path, options = {}) {
  assertDeployedFrontendIsNotUsingLocalApi();

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), options.timeoutMs ?? REQUEST_TIMEOUT_MS);

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
      signal: controller.signal,
    });
  } catch (error) {
    window.clearTimeout(timeoutId);

    if (error?.name === "AbortError") {
      throw {
        status: 0,
        message: "The request took too long. The backend may be down or still starting up. Please try again shortly.",
        errors: {},
      };
    }

    throw {
      status: 0,
      message: `Unable to reach the backend at ${API_BASE_URL}. Please confirm the API server is running.`,
      errors: {},
    };
  }

  window.clearTimeout(timeoutId);

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
