import { ABSENT_MEMBER, PRESENT_MEMBER } from "~/constant/constant";
import axiosInstance from "~/interceptor/interceptor";
import { API_ENDPOINTS } from "~/lib/api-endpoints";
import { localJsonStorageService } from "~/lib/localStorage";

export const sabhaService = {
  //#region get all sabhas
  getSabhas: async (sabha_status: string) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.SABHA.BASE, {
        params: {
          status: sabha_status,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  //#region fetch sabha by id
  getSabhaById: async (sabhaId: number) => {
    try {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.SABHA.BASE}/${sabhaId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  //#region sync sabha attendance by id
  syncSabhaAttendance: async (sabhaId: number) => {
    try {
      const presentUserIds =
        localJsonStorageService.getItem<number[]>(PRESENT_MEMBER) || [];
      const absentUserIds =
        localJsonStorageService.getItem<number[]>(ABSENT_MEMBER) || [];
      const response = await axiosInstance.post(`${API_ENDPOINTS.SABHA.SYNC}`, {
        sabha_id: sabhaId,
        parent_user_id: presentUserIds,
        absent_user_id: absentUserIds,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  //#region preset attendance for userId by sabhaId
  presetAttendance: async (sabhaId: number, userId: number) => {
    try {
      const response = await axiosInstance.post(
        `${API_ENDPOINTS.SABHA.ATTENDANCE_PRESENT}`,
        {
          sabha_id: sabhaId,
          user_id: userId,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  //#region absent attendance for userId by sabhaId
  absentAttendance: async (sabhaId: number, userId: number) => {
    try {
      const response = await axiosInstance.post(
        `${API_ENDPOINTS.SABHA.ATTENDANCE_ABSENT}`,
        {
          sabha_id: sabhaId,
          user_id: userId,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  //#region start sabha by id
  startSabha: async (sabhaId: number) => {
    try {
      console.log("sabhaId", sabhaId);
      const response = await axiosInstance.put(
        `${API_ENDPOINTS.SABHA.START_SABHA}/${sabhaId}`,
        {
          sabha_date: new Date().toISOString(),
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  //#region complete sabha by id
  submitSabhaReport: async (sabhaId: number) => {
    try {
      const response = await axiosInstance.put(
        `${API_ENDPOINTS.SABHA.SUBMIT_SABHA_REPORT}/${sabhaId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  //#region create sabha
  createSabha: async (title: string) => {
    try {
      const response = await axiosInstance.post(`${API_ENDPOINTS.SABHA.BASE}`, {
        title,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
