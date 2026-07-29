import axiosClient from "../api/axiosClient.js";

export const bookingService = {
  async createBooking(data) {
    const response = await axiosClient.post("/bookings", data);
    return response.data;
  },

  async getMyBookings(params = {}) {
    const response = await axiosClient.get("/bookings/my", { params });
    return response.data;
  },

  async getMyUpcomingBookings() {
    const response = await axiosClient.get("/bookings/my/upcoming");
    return response.data;
  },

  async getBookingById(id) {
    const response = await axiosClient.get(`/bookings/${id}`);
    return response.data;
  },

  async cancelBooking(id) {
    const response = await axiosClient.patch(`/bookings/${id}/cancel`);
    return response.data;
  },

  async getAllBookings(params = {}) {
    const response = await axiosClient.get("/bookings", { params });
    return response.data;
  },
};
