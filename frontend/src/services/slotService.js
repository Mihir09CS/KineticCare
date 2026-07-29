import axiosClient from "../api/axiosClient.js";

export const slotService = {
  async getSlotsByService(serviceId, params = {}) {
    const response = await axiosClient.get(`/slots/service/${serviceId}`, { params });
    return response.data;
  },

  async getSlotById(id) {
    const response = await axiosClient.get(`/slots/${id}`);
    return response.data;
  },

  async getAllSlots(params = {}) {
    const response = await axiosClient.get("/slots", { params });
    return response.data;
  },

  async createSlot(data) {
    const response = await axiosClient.post("/slots", data);
    return response.data;
  },

  async updateSlot(id, data) {
    const response = await axiosClient.put(`/slots/${id}`, data);
    return response.data;
  },

  async deleteSlot(id) {
    const response = await axiosClient.delete(`/slots/${id}`);
    return response.data;
  },
};
