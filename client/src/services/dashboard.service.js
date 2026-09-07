import { apiClient } from "./api.client";

export const dashboardService = {
  /**
   * Fetch role-specific dashboard data and statistics
   */
  getDashboardStats: (role) =>
    apiClient.get(`/dashboard/stats${role ? `?role=${encodeURIComponent(role)}` : ""}`),

  /**
   * Fetch active consultation queue or cases for medical staff
   */
  getQueue: (department) =>
    apiClient.get(`/queue${department ? `?department=${encodeURIComponent(department)}` : ""}`),
};

export const {
  getDashboardStats,
  getQueue,
} = dashboardService;

export default dashboardService;
