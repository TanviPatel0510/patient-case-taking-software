import { request } from "./api.client";

export const medicalHistoryService = {
  getMedicalHistory: () => request("/medical-history"),

  createMedicalBundle: (formData) =>
    request("/medical-history/bundle", {
      method: "POST",
      body: formData,
    }),

  deleteMedicalDocument: (documentId) =>
    request(`/medical-documents/${documentId}`, { method: "DELETE" }),
};

export const {
  getMedicalHistory,
  createMedicalBundle,
  deleteMedicalDocument,
} = medicalHistoryService;

export default medicalHistoryService;