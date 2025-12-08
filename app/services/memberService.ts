import axiosInstance from "~/interceptor/interceptor";
import { API_ENDPOINTS } from "~/lib/api-endpoints";
import type { CommonParams } from "~/types/common.interface";
import type { MemberPayload } from "~/types/members.interface";

export const memberService = {
  //#region get members
  getMembers: async () => {
    try {
      const response = await axiosInstance(API_ENDPOINTS.MEMBERS.BASE);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  //#region get member by id
  getMemberById: async (memberId: number) => {
    try {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.MEMBERS.BASE}/${memberId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  //#create member
  createMember: async (memberData: MemberPayload) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.MEMBERS.CREATE,
        memberData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  //#region fetch members by group
  getPoshakGroup: async (params: CommonParams) => {
    try {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.MEMBERS.POSHAK_GROUP}`,
        {
          params: {
            page: params.page,
            limit: params.limit,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
