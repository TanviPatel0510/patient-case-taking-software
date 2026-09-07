const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Universal HTTP request wrapper with cookie credentials and standard JSON handling.
 */
export async function request(path, options = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers,
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(body.message || "An unexpected error occurred.");
    Object.assign(error, body);
    throw error;
  }

  return body;
}

export const apiClient = {
  get: (path, options = {}) => request(path, { method: "GET", ...options }),
  post: (path, data, options = {}) =>
    request(path, {
      method: "POST",
      body: data !== undefined ? JSON.stringify(data) : undefined,
      ...options,
    }),
  put: (path, data, options = {}) =>
    request(path, {
      method: "PUT",
      body: data !== undefined ? JSON.stringify(data) : undefined,
      ...options,
    }),
  delete: (path, options = {}) => request(path, { method: "DELETE", ...options }),
};

export default apiClient;
