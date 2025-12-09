import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { reportService, type filterType } from "~/services/reportService";
import type { MemberData, PoshakGroupData } from "~/types/members.interface";
import { filterMembers } from "~/utils/filterMembers";

interface ReportState {
  memberReport: MemberData[];
  groupReport: PoshakGroupData[];
  searchText: string;
  sabhaCount: number;
  loading: boolean;
}

const initialState: ReportState = {
  memberReport: [],
  groupReport: [],
  sabhaCount: 0,
  searchText: "",
  loading: false,
};

//#region fetchMemberReport thunk
export const fetchMembersReport = createAsyncThunk(
  "report/fetchMembersReport",
  async (filter: filterType, { rejectWithValue }) => {
    try {
      const response = await reportService.getMemberReport(filter);
      return response.data as {
        sabha_count: number;
        result: MemberData[];
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//#region fetchGroupReport thunk
export const fetchGroupReport = createAsyncThunk(
  "report/fetchGroupReport",
  async (filter: filterType, { rejectWithValue }) => {
    try {
      const response = await reportService.getGroupReport(filter);
      return response.data as {
        sabha_count: number;
        groups: PoshakGroupData[];
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//#region Report Slice

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    setMemberReport(state, action: PayloadAction<any>) {
      state.memberReport = action.payload;
    },
    setGroupReport(state, action: PayloadAction<any>) {
      state.groupReport = action.payload;
    },

    setSearchText(state, action: PayloadAction<string>) {
      state.searchText = action.payload;
    },
  },
  extraReducers: (builder) => {
    //#region fetchMembersReport
    builder
      .addCase(fetchMembersReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMembersReport.fulfilled, (state, action) => {
        state.loading = false;
        state.memberReport = action.payload.result;
        state.sabhaCount = action.payload.sabha_count;
      })
      .addCase(fetchMembersReport.rejected, (state) => {
        state.loading = false;
      });

    //#region fetchGroupReport
    builder
      .addCase(fetchGroupReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGroupReport.fulfilled, (state, action) => {
        state.loading = false;
        state.groupReport = action.payload.groups;
        state.sabhaCount = action.payload.sabha_count;
      })
      .addCase(fetchGroupReport.rejected, (state) => {
        state.loading = false;
      });
  },
});
export const { setMemberReport, setGroupReport, setSearchText } =
  reportSlice.actions;

export const selectFilteredReportMembers = (state: { report: ReportState }) => {
  const { memberReport, searchText } = state.report;
  return filterMembers(memberReport, searchText);
};

export default reportSlice.reducer;
