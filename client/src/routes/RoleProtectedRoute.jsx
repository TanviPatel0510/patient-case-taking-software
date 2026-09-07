import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoadingScreen } from "../components/LoadingScreen";

/**
 * Role-based authorization gatekeeper component.
 * - Accepts `allowedRoles` array via props.
 * - Shows loading indicator while session is being verified against API.
 * - If unauthenticated, redirects to /login preserving the requested location.
 * - If authenticated with an unauthorized role (e.g. Patient accessing /doctor/),
 *   redirects to /login with a roleMismatch flag so the login screen can be displayed
 *   without entering an infinite redirect loop.
 */
export function RoleProtectedRoute({ allowedRoles = [], children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen message="Verifying permissions..." />;
  }

  // Not logged in -> send to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in, check if role is authorized
  const userRole = user.role;
  const isAuthorized = Array.isArray(allowedRoles) && allowedRoles.includes(userRole);

  if (!isAuthorized) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          roleMismatch: true,
          currentRole: userRole,
          requiredRoles: allowedRoles,
        }}
        replace
      />
    );
  }

  // Authorized -> render matched route or children
  return children ? children : <Outlet />;
}

export default RoleProtectedRoute;
