import axiosInstance from "~/interceptor/interceptor";
import { API_ENDPOINTS } from "~/lib/api-endpoints";
import type { CommonParams } from "~/types/common.interface";

export const sabhaService = {
  //#region get all sabhas
  getSabhas: async (params: CommonParams) => {
    try {
      const { page, limit, sabah_status } = params;
      const response = await axiosInstance.get(API_ENDPOINTS.SABHA.BASE, {
        params: {
          page,
          limit,
          status: sabah_status,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
