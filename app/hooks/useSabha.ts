import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  fetchSabhaList,
  setLoading,
  setSabhaList,
} from "~/store/slice/sabhaSlice";
import type { CommonParams } from "~/types/common.interface";
import type { SabhaData } from "~/types/sabha.interface";

export const useSabha = () => {
  const dispatch = useAppDispatch();
  const sabha = useAppSelector((state) => state.sabha);

  const actions = {
    setSabhaList: (sabhaList: SabhaData[]) => dispatch(setSabhaList(sabhaList)),
    setLoading: (loading: boolean) => dispatch(setLoading(loading)),
  };

  const thunks = {
    fetchSabhaList: (params: CommonParams) => dispatch(fetchSabhaList(params)),
  };

  return {
    //statse
    ...sabha,

    //actions
    ...actions,

    //thunks
    ...thunks,
  };
};
