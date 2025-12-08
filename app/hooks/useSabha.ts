import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  closeSabhaFormDailog,
  createSabha,
  doMemberAbsent,
  doMemberPresent,
  fetchSabhaById,
  fetchSabhaList,
  openSabhaFormDialog,
  selectFilteredSabhaMembers,
  setLoading,
  setSabhaList,
  setSabhaMemberSearchText,
  startSabha,
  submitSabhaReport,
  syncSabhaAttendance,
} from "~/store/slice/sabhaSlice";
import type { SabhaData } from "~/types/sabha.interface";

export const useSabha = () => {
  const dispatch = useAppDispatch();
  const sabha = useAppSelector((state) => state.sabha);
  const filteredSabhaMembers = useAppSelector(selectFilteredSabhaMembers);

  const actions = {
    setSabhaList: (sabhaList: SabhaData[]) => dispatch(setSabhaList(sabhaList)),
    setLoading: (loading: boolean) => dispatch(setLoading(loading)),
    setSabhaMemberSearchText: (searchText: string) =>
      dispatch(setSabhaMemberSearchText(searchText)),
    openSabhaFormDialog: (selectedSabha: SabhaData | null) =>
      dispatch(openSabhaFormDialog(selectedSabha)),
    closeSabhaFormDailog: () => dispatch(closeSabhaFormDailog()),
    doMemberPresent: (userId: number) => dispatch(doMemberPresent(userId)),
    doMemberAbsenent: (userId: number) => dispatch(doMemberAbsent(userId)),
  };

  const thunks = {
    fetchSabhaList: (sabha_status: string) =>
      dispatch(fetchSabhaList(sabha_status)),
    fetchSabhaById: (sabhaId: number) => dispatch(fetchSabhaById(sabhaId)),
    syncSabhaAttendance: (sabhaId: number) =>
      dispatch(syncSabhaAttendance(sabhaId)),
    startSabha: (sabhaId: number) => dispatch(startSabha(sabhaId)),
    submitSabhaReport: (sabhaId: number) =>
      dispatch(submitSabhaReport(sabhaId)),
    createSabha: (title: string) => dispatch(createSabha(title)),
  };

  return {
    //statse
    ...sabha,
    filteredSabhaMembers,

    //actions
    ...actions,

    //thunks
    ...thunks,
  };
};
