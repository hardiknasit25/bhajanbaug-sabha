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

  //#region fetch members by poshak group
  getMembersByPoshakGroup: async () => {
    try {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.MEMBERS.BASE}/poshak-group`
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
        API_ENDPOINTS.MEMBERS.BASE,
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

  //#region enter reason for sabha
  enterReasonForSabha: async (
    sabha_id: number,
    user_id: number,
    reason: string
  ) => {
    try {
      const response = await axiosInstance.put(
        `${API_ENDPOINTS.SABHA.REASON}`,
        {
          sabha_id,
          user_id,
          reason,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  //#region fetch group select
  groupSelect: async () => {
    try {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.GROUPS.SELECT}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
