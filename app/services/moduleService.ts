import axiosInstance from "~/interceptor/interceptor";
import { API_ENDPOINTS } from "~/lib/api-endpoints";
import type { ModulePayload } from "~/types/module.interface";

export const moduleService = {
  //#region get all modules
  getModules: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.MODULE.BASE);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  //#region create module
  createModule: async (payload: ModulePayload) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.MODULE.BASE,
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  //#region update module
  updateModule: async (id: number, payload: ModulePayload) => {
    try {
      const response = await axiosInstance.put(
        `${API_ENDPOINTS.MODULE.BASE}/${id}`,
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  //#region delete module
  deleteModule: async (id: number) => {
    try {
      const response = await axiosInstance.delete(
        `${API_ENDPOINTS.MODULE.BASE}/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
