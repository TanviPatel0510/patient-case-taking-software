import { apiClient } from "./api.client";

export const authService = {
  /**
   * Log in with identifier and password or credentials
   */
  login: (data) => apiClient.post("/auth/login", data),

  /**
   * Fetch current authenticated session from server (source of truth)
   */
  getMe: () => apiClient.get("/auth/me").catch(() => null),

  /**
   * Alias for getMe for backward compatibility
   */
  getSession: () => apiClient.get("/auth/me").catch(() => null),

  /**
   * Log out the current user and invalidate cookie session
   */
  logout: () => apiClient.post("/auth/logout"),

  /**
   * Request OTP for patient authentication or registration
   */
  requestPatientOtp: (identifier, purpose) =>
    apiClient.post("/auth/patient/request-otp", { identifier, purpose }),

  /**
   * Verify patient OTP
   */
  verifyPatientOtp: (identifier, otp) =>
    apiClient.post("/auth/patient/verify-otp", { identifier, otp }),
};

export const {
  login,
  getMe,
  getSession,
  logout,
  requestPatientOtp,
  verifyPatientOtp,
} = authService;

export default authService;
