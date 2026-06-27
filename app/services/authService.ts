import axiosInstance from "~/interceptor/interceptor";
import { API_ENDPOINTS } from "~/lib/api-endpoints";

export const authService = {
  //#region get the logged-in user's profile
  getMe: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.AUTH.ME);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
