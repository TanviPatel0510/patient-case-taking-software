import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoadingScreen } from "../components/LoadingScreen";

/**
 * Role-based authorization gatekeeper component.
 * - Accepts `allowedRoles` array via props.
 * - Shows loading indicator while session is being verified against API.
 * - If unauthenticated or role is unauthorized, redirects to /login.
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

  // Logged in, but does not have the required role -> redirect to /login
  const userRole = user.role;
  const isAuthorized = Array.isArray(allowedRoles) && allowedRoles.includes(userRole);

  if (!isAuthorized) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authorized -> render matched route or children
  return children ? children : <Outlet />;
}

export default RoleProtectedRoute;
