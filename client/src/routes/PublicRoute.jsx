import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoadingScreen } from "../components/LoadingScreen";
import { getRoleDefaultPath } from "../constants/roles";

/**
 * Route wrapper for guest pages like /login.
 * Uses AuthContext to check if an authenticated session exists from cookies.
 * Automatically logs in and navigates the user away from the login page.
 */
export function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen message="Checking existing session..." />;
  }

  if (user) {
    const from = location.state?.from?.pathname || getRoleDefaultPath(user.role);
    return <Navigate to={from} replace />;
  }

  return children ? children : <Outlet />;
}

export default PublicRoute;
