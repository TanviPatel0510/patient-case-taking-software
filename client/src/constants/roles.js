/**
 * System roles aligned with server/src/models/user.js:
 * enum: ["patient", "doctor", "triage_nurse", "admin", "kiosk"]
 */
export const ROLES = Object.freeze({
  PATIENT: "patient",
  DOCTOR: "doctor",
  TRIAGE_NURSE: "triage_nurse",
  ADMIN: "admin",
  KIOSK: "kiosk",
});

export const ALL_ROLES = Object.freeze(Object.values(ROLES));

export const ROLE_LABELS = Object.freeze({
  [ROLES.PATIENT]: "Patient",
  [ROLES.DOCTOR]: "Doctor",
  [ROLES.TRIAGE_NURSE]: "Triage Nurse",
  [ROLES.ADMIN]: "Administrator",
  [ROLES.KIOSK]: "Kiosk",
});

export const ROLE_DASHBOARD_PATHS = Object.freeze({
  [ROLES.PATIENT]: "/patient/dashboard",
  [ROLES.DOCTOR]: "/doctor/dashboard",
  [ROLES.TRIAGE_NURSE]: "/triage_nurse/dashboard",
  [ROLES.ADMIN]: "/admin/dashboard",
  [ROLES.KIOSK]: "/kiosk/dashboard",
});

/**
 * Returns the default dashboard route for a given role
 */
export function getRoleDashboardPath(role) {
  return ROLE_DASHBOARD_PATHS[role] || "/";
}

/**
 * Returns the initial entry route for a user with a valid JWT token.
 * Patients navigate to /profiles first to select their active session profile.
 */
export function getRoleDefaultPath(role) {
  if (role === ROLES.PATIENT) {
    return "/profiles";
  }
  return ROLE_DASHBOARD_PATHS[role] || "/";
}

/**
 * Checks whether a given path is valid and authorized for a specific role.
 */
export function isPathAllowedForRole(path, role) {
  if (!path || typeof path !== "string" || !role) return false;

  // Normalize path and remove query parameters or trailing slashes for comparison
  const cleanPath = path.split("?")[0].toLowerCase().trim();

  if (role === ROLES.PATIENT) {
    return cleanPath.startsWith("/patient") || cleanPath === "/profiles";
  }
  if (role === ROLES.DOCTOR) {
    return cleanPath.startsWith("/doctor");
  }
  if (role === ROLES.TRIAGE_NURSE) {
    return cleanPath.startsWith("/triage_nurse");
  }
  if (role === ROLES.ADMIN) {
    return cleanPath.startsWith("/admin");
  }
  if (role === ROLES.KIOSK) {
    return cleanPath.startsWith("/kiosk");
  }
  return false;
}

/**
 * Validates a target destination path against the given role.
 * If targetPath is not authorized for that role, safely falls back
 * to the role's canonical dashboard path.
 */
export function getSafeRedirectPath(targetPath, role) {
  if (targetPath && isPathAllowedForRole(targetPath, role)) {
    return targetPath;
  }
  return getRoleDefaultPath(role);
}
