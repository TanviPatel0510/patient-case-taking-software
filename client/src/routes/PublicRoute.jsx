import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoadingScreen } from "../components/LoadingScreen";
import { getSafeRedirectPath } from "../constants/roles";

/**
 * Route wrapper for guest pages like /login.
 * Uses AuthContext to check if an authenticated session exists from cookies.
 * Automatically logs in and navigates the user away from the login page,
 * EXCEPT when the user was redirected to /login due to a role mismatch
 * (e.g. Patient trying to access /doctor/ portal).
 */
export function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen message="Checking existing session..." />;
  }

  // If user is authenticated:
  if (user) {
    // If the user arrived here because their active role does NOT match the requested portal,
    // do NOT redirect back to the unauthorized portal (which caused infinite redirect loops).
    // Allow the login screen to render so they can sign into the required role account.
    if (location.state?.roleMismatch) {
      return children ? children : <Outlet />;
    }

    // Normal case: active authenticated user navigating to /login
    // Validate target destination path to prevent cross-role mismatch redirects
    const from = location.state?.from?.pathname;
    const destination = getSafeRedirectPath(from, user.role);
    return <Navigate to={destination} replace />;
  }

  return children ? children : <Outlet />;
}

export default PublicRoute;
