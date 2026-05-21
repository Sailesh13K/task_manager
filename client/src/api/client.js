const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export function createApiClient(token) {
  return async function api(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.message || "Request failed");
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  };
}
