import axiosInstance from "~/interceptor/interceptor";
import { API_ENDPOINTS } from "~/lib/api-endpoints";
import type {
  ChangeAllPermissionPayload,
  ChangePermissionPayload,
} from "~/types/permission.interface";

export const permissionService = {
  //#region logged-in user's own permission map (for menu gating)
  getMyPermissions: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.PERMISSION.MY);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  //#region all modules merged with a role's permission (for the editor)
  getRolePermissions: async (roleId: number) => {
    try {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.PERMISSION.BY_ROLE}/${roleId}/all`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  //#region upsert one module's permission for a role
  changePermission: async (payload: ChangePermissionPayload) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.PERMISSION.BASE,
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  //#region apply one permission type to every module of a role
  changeAllPermissions: async (payload: ChangeAllPermissionPayload) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.PERMISSION.CHANGE_ALL,
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
