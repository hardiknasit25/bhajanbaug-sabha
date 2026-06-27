import axiosInstance from "~/interceptor/interceptor";
import { API_ENDPOINTS } from "~/lib/api-endpoints";
import type { RolePayload } from "~/types/role.interface";

export const roleService = {
  //#region get all roles
  getRoles: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.ROLE.BASE);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  //#region get roles for a select dropdown (id, name)
  getRoleSelect: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.ROLE.SELECT);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  //#region create role
  createRole: async (payload: RolePayload) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.ROLE.BASE, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  //#region update role
  updateRole: async (id: number, payload: RolePayload) => {
    try {
      const response = await axiosInstance.put(
        `${API_ENDPOINTS.ROLE.BASE}/${id}`,
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  //#region delete role
  deleteRole: async (id: number) => {
    try {
      const response = await axiosInstance.delete(
        `${API_ENDPOINTS.ROLE.BASE}/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
