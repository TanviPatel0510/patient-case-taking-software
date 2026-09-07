import { apiClient } from "./api.client";

export const patientsService = {
  /**
   * Register a new primary patient account
   */
  registerPatient: (data) => apiClient.post("/auth/register", data),

  /**
   * Add a secondary family/dependent profile under the authenticated account
   */
  registerPatientProfile: (data) =>
    apiClient.post("/auth/patient/add-profile", data),

  /**
   * Select an active patient profile for the current medical session
   */
  selectPatientProfile: (patientId) =>
    apiClient.post("/auth/patient/select-profile", { patientId }),
};

export const {
  registerPatient,
  registerPatientProfile,
  selectPatientProfile,
} = patientsService;

export default patientsService;
