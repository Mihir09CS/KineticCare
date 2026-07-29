import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: attach token from localStorage if present
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("kinetic_access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: handle standard error responses
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred.";

    if (status === 401) {
      // Clear token & user state on 401
      localStorage.removeItem("kinetic_access_token");
      // Dispatch event so AuthContext can automatically log out user
      window.dispatchEvent(new Event("kinetic_unauthorized"));
    }

    return Promise.reject({
      status,
      message,
      data: error.response?.data?.data || null,
      raw: error,
    });
  }
);

export default axiosClient;
