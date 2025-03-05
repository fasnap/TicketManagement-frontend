import axios from "axios";
import { BASE_URL } from "../api/base";
import { store } from "../store/store";
import { logout } from "../features/authSlice";

// Create an Axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: `${BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const access = localStorage.getItem("access");
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 and there is no originalRequest._retry flag
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh");

        // Call the token refresh endpoint
        const response = await axios.post(`${BASE_URL}/user/api/token/refresh/`, {
          refresh: refreshToken
        });

        // Update tokens in localStorage
        localStorage.setItem("access", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);

        // Update the Authorization header with the new access token
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout the user
        store.dispatch(logout());
        window.location.href = "/user/login"; // Redirect to login page
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;