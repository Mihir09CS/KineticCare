import axiosClient from "../api/axiosClient.js";

export const authService = {
  async register(data) {
    const response = await axiosClient.post("/auth/register", data);
    return response.data;
  },

  async login(data) {
    const response = await axiosClient.post("/auth/login", data);
    return response.data;
  },

  async googleLogin(idToken) {
    const response = await axiosClient.post("/auth/google", { idToken });
    return response.data;
  },


  async logout() {
    const response = await axiosClient.post("/auth/logout");
    return response.data;
  },

  async getMe() {
    const response = await axiosClient.get("/auth/me");
    return response.data;
  },

  async updateProfile(data) {
    const response = await axiosClient.patch("/auth/profile", data);
    return response.data;
  },

  async changePassword(data) {
    const response = await axiosClient.patch("/auth/change-password", data);
    return response.data;
  },

  async forgotPassword(data) {
    const response = await axiosClient.post("/auth/forgot-password", data);
    return response.data;
  },

  async resetPassword(token, data) {
    const response = await axiosClient.post(`/auth/reset-password/${token}`, data);
    return response.data;
  },
};
