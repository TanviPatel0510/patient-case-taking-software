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
