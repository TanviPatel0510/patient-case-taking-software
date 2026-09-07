const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(body.message || "Something went wrong.");
    Object.assign(error, body);
    throw error;
  }

  return body;
}

export const registerPatient = (data) =>
  request("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const registerPatientProfile = (data) =>
  request("/auth/patient/add-profile", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const login = (data) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getSession = () => request("/auth/me").catch(() => null);

export const logout = () =>
  request("/auth/logout", {
    method: "POST",
  });

export const requestPatientOtp = (identifier, purpose) =>
  request("/auth/patient/request-otp", {
    method: "POST",
    body: JSON.stringify({ identifier, purpose }),
  });

export const verifyPatientOtp = (identifier, otp) =>
  request("/auth/patient/verify-otp", {
    method: "POST",
    body: JSON.stringify({ identifier, otp }),
  });

export const selectPatientProfile = (patientId) =>
  request("/auth/patient/select-profile", {
    method: "POST",
    body: JSON.stringify({ patientId }),
  });