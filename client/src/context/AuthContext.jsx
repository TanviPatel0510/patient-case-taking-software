import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { authService } from "../services/auth.service";
import { patientsService } from "../services/patients.service";
import { getRoleDashboardPath, getRoleDefaultPath } from "../constants/roles";

export const AuthContext = createContext(null);

/**
 * Helper to check if JWT cookie exists in document.cookie
 */
function checkCookieForToken() {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .some((item) => item.trim().startsWith("medikiosk_token="));
}

/**
 * AuthProvider component that maintains verified session state from the backend API.
 * The API server session is the source of truth for authentication and roles.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // State checking for existing JWT token in cookies
  const [hasExistingToken, setHasExistingToken] = useState(() => checkCookieForToken());

  /**
   * Hits the backend /auth/me endpoint with credentials to verify session
   * and load current user, profiles, and verified role.
   */
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const session = await authService.getMe();
      setUser(session);
      setHasExistingToken(Boolean(session) || checkCookieForToken());
      return session;
    } catch {
      setUser(null);
      setHasExistingToken(checkCookieForToken());
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Check auth once on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /**
   * Log in user with credentials and set active session
   */
  const login = useCallback(async (credentials) => {
    const session = await authService.login(credentials);
    setUser(session);
    setHasExistingToken(true);
    return session;
  }, []);

  /**
   * Log out user via backend endpoint and clear local auth state
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setHasExistingToken(false);
    }
  }, []);

  /**
   * Select a patient profile for multi-profile patient accounts
   */
  const selectProfile = useCallback(async (patientId) => {
    const updated = await patientsService.selectPatientProfile(patientId);
    setUser(updated);
    return updated;
  }, []);

  /**
   * Manually update session when an external flow (e.g. OTP verification) finishes
   */
  const setSession = useCallback((newSession) => {
    setUser(newSession);
    setHasExistingToken(Boolean(newSession) || checkCookieForToken());
  }, []);

  const value = useMemo(
    () => ({
      user,
      role: user?.role || null,
      loading,
      isAuthenticated: Boolean(user),
      hasExistingToken,
      login,
      logout,
      checkAuth,
      selectProfile,
      setSession,
    }),
    [user, loading, hasExistingToken, login, logout, checkAuth, selectProfile, setSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to consume AuthContext cleanly with safety validation.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
