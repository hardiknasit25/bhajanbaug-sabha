import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  createMember,
  fetchMembers,
  setMembers,
  setSearchText,
  selectFilteredMembers,
  fetchMemberById,
} from "~/store/slice/memberSlice";
import type { CommonParams } from "~/types/common.interface";
import { type MemberData } from "~/types/members.interface";

export const useMembers = () => {
  const dispatch = useAppDispatch();
  const members = useAppSelector((state) => state.members);
  const filteredMembers = useAppSelector(selectFilteredMembers);

  const actions = {
    setAllMembers: (memberList: MemberData[]) =>
      dispatch(setMembers(memberList)),
    setSearchText: (searchText: string) => dispatch(setSearchText(searchText)),
  };

  const methods = {};

  const thunks = {
    fetchMembers: () => dispatch(fetchMembers()),
    fetchMemberById: (memberId: number) => dispatch(fetchMemberById(memberId)),
    createMember: (memberData: MemberData) => {
      dispatch(createMember(memberData));
    },
  };

  return {
    // stats
    ...members,
    filteredMembers,

    // actions
    ...actions,

    // thunks
    ...thunks,
  };
};
