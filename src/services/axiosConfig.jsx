// src/services/axiosConfig.js
import axios from "axios";
import { toast } from "react-hot-toast"; // Assuming you're using react-hot-toast for notifications

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_API_URL, // Replace with your API base URL
  // timeout: 10000, // Optional timeout setting
});

// Request interceptor (optional, for adding headers, etc.)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    // Add any custom request headers here if needed
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    if (response?.data?.status === false ||  response?.data?.success === false) {
      toast.error(response?.data?.message);
    } else {
      return response;
    }
  },
  (error) => {
    if (error.response) {
      // Handle specific error status codes
      if (error.response.status === 401) {
        // Don't auto-redirect if this is a login attempt - let the component handle it
        const isLoginAttempt = error.config?.url?.includes('/auth/login');
        
        if (!isLoginAttempt) {
          // Handle unauthorized error for other API calls
          toast.error("Unauthorized access. Please log in again.");
          // Clear storage and redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("userData");
          localStorage.removeItem("user");
          localStorage.removeItem("accountantUser");
          localStorage.setItem("lastVisitedRoute", "/sign-in");
          window.location.href = "/sign-in";
        }
        // For login attempts, let the error bubble up to be handled by the SignIn component
      } else {
        // Handle other errors
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        }
      }
    } else {
      // Handle network or server errors
      toast.error("Network error. Please try again later.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
