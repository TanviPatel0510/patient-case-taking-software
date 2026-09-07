import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoadingScreen } from "../components/LoadingScreen";

/**
 * Generic authentication gatekeeper component.
 * - Shows loading indicator while authentication check is pending.
 * - Allows authenticated users through to children or <Outlet />.
 * - Redirects unauthenticated users to /login preserving the requested location.
 */
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  if (!user) {
    // Preserve requested URL so the user can be redirected back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
}

export default ProtectedRoute;
