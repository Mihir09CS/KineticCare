import axiosClient from "../api/axiosClient.js";

export const dashboardService = {
  async getUserDashboard() {
    const response = await axiosClient.get("/dashboard/user");
    return response.data;
  },

  async getAdminDashboard() {
    const response = await axiosClient.get("/dashboard/admin");
    return response.data;
  },
};
