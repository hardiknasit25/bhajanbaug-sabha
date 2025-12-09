import axiosInstance from "~/interceptor/interceptor";
import { API_ENDPOINTS } from "~/lib/api-endpoints";

export type filterType =
  | "lastSabha"
  | "lastMonthAllSabha"
  | "lastThreeMonthsAllSabha"
  | "lastSixMonthsAllSabha"
  | "lastYearAllSabha"
  | "lastFourSabha"
  | "allSabhaWithDuration";

export const reportService = {
  //#region fetch member report
  getMemberReport: async (filter: filterType) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.REPORT.MEMBER_REPORT,
        {
          params: {
            filter: filter, // <-- this becomes ?filter=value
          },
        }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  //#region fetch group report
  getGroupReport: async (filter: filterType) => {
    try {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.REPORT.GROUP_REPORT}`,
        {
          params: {
            filter: filter, // <-- this becomes ?filter=value
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
