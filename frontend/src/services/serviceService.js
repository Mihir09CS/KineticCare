import axiosClient from "../api/axiosClient.js";

export const serviceService = {
  async getAllServices(params = {}) {
    const queryParams = {};

    // Pagination
    if (params.page) queryParams.page = params.page;
    if (params.limit) queryParams.limit = params.limit;

    // Search
    if (params.search?.trim()) {
      queryParams.search = params.search.trim();
    }

    // Category
    if (params.category?.trim()) {
      queryParams.category = params.category.trim();
    }

    // Only send isActive if it's true or false
    if (
      params.isActive === "true" ||
      params.isActive === "false" ||
      params.isActive === true ||
      params.isActive === false
    ) {
      queryParams.isActive = String(params.isActive);
    }

    const response = await axiosClient.get("/services", {
      params: queryParams,
    });

    return response.data;
  },

  async getServiceById(id) {
    const response = await axiosClient.get(`/services/${id}`);
    return response.data;
  },

  async createService(data) {
    const response = await axiosClient.post("/services", data);
    return response.data;
  },

  async updateService(id, data) {
    const response = await axiosClient.put(`/services/${id}`, data);
    return response.data;
  },

  async deleteService(id) {
    const response = await axiosClient.delete(`/services/${id}`);
    return response.data;
  },
};
