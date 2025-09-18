import toast from "react-hot-toast";
import axiosInstance from "./axiosConfig";

// Logout API service
export const logout = async (navigate) => {
  try {
    const response = await axiosInstance.post(`logout`);
    if (response?.data?.status === true) {
      toast.success(response?.data?.message);
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      navigate("/login");
    }
  } catch (error) {
    console.error(error);
  }
};