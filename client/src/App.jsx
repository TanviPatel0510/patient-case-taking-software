import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { ROLES, getRoleDashboardPath } from "./constants/roles";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { RoleProtectedRoute } from "./routes/RoleProtectedRoute";
import { PublicRoute } from "./routes/PublicRoute";

// Page Components
import { Welcome } from "./pages/Welcome";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Profiles } from "./pages/Profiles";
import { PatientDashboard } from "./pages/PateintDashboard";
import { RoleDashboard } from "./pages/RoleDashboard";
import { NotFound } from "./pages/NotFound";

/**
 * Redirects authenticated user to their role-specific dashboard.
 */
function DashboardRedirect() {
  const { user } = useAuth();
  const targetPath = getRoleDashboardPath(user?.role);
  return <Navigate to={targetPath} replace />;
}

/**
 * Handles legacy /dashboard/:role links and forwards to canonical routes.
 */
function LegacyRoleRedirect() {
  const { role } = useParams();
  if (role === ROLES.PATIENT) {
    return <Navigate to="/patient/dashboard" replace />;
  }
  return <Navigate to={`/${role}/dashboard`} replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Welcome />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes (Authentication Required) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profiles" element={<Profiles />} />
        <Route path="/dashboard" element={<DashboardRedirect />} />
        <Route path="/dashboard/:role" element={<LegacyRoleRedirect />} />
      </Route>

      {/* Role-Protected Routes: Patient Only (/patient/*) */}
      <Route element={<RoleProtectedRoute allowedRoles={[ROLES.PATIENT]} />}>
        <Route path="/patient" element={<Navigate to="/patient/dashboard" replace />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/*" element={<PatientDashboard />} />
      </Route>

      {/* Role-Protected Routes: Doctor Only (/doctor/*) */}
      <Route element={<RoleProtectedRoute allowedRoles={[ROLES.DOCTOR]} />}>
        <Route path="/doctor" element={<Navigate to="/doctor/dashboard" replace />} />
        <Route path="/doctor/dashboard" element={<RoleDashboard />} />
        <Route path="/doctor/*" element={<RoleDashboard />} />
      </Route>

      {/* Role-Protected Routes: Admin Only (/admin/*) */}
      <Route element={<RoleProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<RoleDashboard />} />
        <Route path="/admin/*" element={<RoleDashboard />} />
      </Route>

      {/* Role-Protected Routes: Triage Nurse Only (/triage_nurse/*) */}
      <Route element={<RoleProtectedRoute allowedRoles={[ROLES.TRIAGE_NURSE]} />}>
        <Route path="/triage_nurse" element={<Navigate to="/triage_nurse/dashboard" replace />} />
        <Route path="/triage_nurse/dashboard" element={<RoleDashboard />} />
        <Route path="/triage_nurse/*" element={<RoleDashboard />} />
      </Route>

      {/* Role-Protected Routes: Kiosk Only (/kiosk/*) */}
      <Route element={<RoleProtectedRoute allowedRoles={[ROLES.KIOSK]} />}>
        <Route path="/kiosk" element={<Navigate to="/kiosk/dashboard" replace />} />
        <Route path="/kiosk/dashboard" element={<RoleDashboard />} />
        <Route path="/kiosk/*" element={<RoleDashboard />} />
      </Route>

      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}