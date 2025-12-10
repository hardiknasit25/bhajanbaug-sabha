import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { sabhaService } from "~/services/sabhaService";
import type { CommonParams } from "~/types/common.interface";
import type { MemberData } from "~/types/members.interface";
import type { SabhaData } from "~/types/sabha.interface";
import { filterMembers } from "~/utils/filterMembers";
import { localJsonStorageService } from "~/lib/localStorage";
import { ABSENT_MEMBER, PRESENT_MEMBER } from "~/constant/constant";
import { setSearchText } from "./memberSlice";

interface SabhaState {
  sabhaList: SabhaData[];
  sabhaMembers: MemberData[];
  selectedSabha: SabhaData | null;
  totalPresentOnSelectedSabha: number;
  totalAbsentOnSelectedSabha: number;
  sabhaFormDialog: boolean;
  searchText: string;
  totalSabha: number;
  loading: boolean;
  error: string | null;
}

const initialState: SabhaState = {
  sabhaList: [],
  sabhaMembers: [],
  selectedSabha: null,
  totalPresentOnSelectedSabha: 0,
  totalAbsentOnSelectedSabha: 0,
  sabhaFormDialog: false,
  searchText: "",
  totalSabha: 0,
  loading: false,
  error: null,
};

//#region fetch sabha list
export const fetchSabhaList = createAsyncThunk(
  "sabha/fetchSabhaList",
  async (sabha_status: string, { rejectWithValue }) => {
    try {
      // Here you can call your service to fetch sabha list
      const response = await sabhaService.getSabhas(sabha_status);
      return response.data as { rows: SabhaData[]; count: number };
    } catch (error) {
      return rejectWithValue("Failed to fetch sabha list");
    }
  }
);

//#regin fetch sabha by id
export const fetchSabhaById = createAsyncThunk(
  "sabha/fetchSabhaById",
  async (sabhaId: number, { rejectWithValue }) => {
    try {
      const response = await sabhaService.getSabhaById(sabhaId);
      return response.data as {
        sabha: SabhaData;
        total_present: number;
        total_absent: number;
        users: MemberData[];
      };
    } catch (error) {
      return rejectWithValue("Failed to fetch sabha details");
    }
  }
);

//#region sync sabha attendance
export const syncSabhaAttendance = createAsyncThunk(
  "sabha/syncSabhaAttendance",
  async (sabhaId: number, { rejectWithValue }) => {
    try {
      const response = await sabhaService.syncSabhaAttendance(sabhaId);
      return response.data as {
        total_present: number;
        total_absent: number;
        users: MemberData[];
      };
    } catch (error) {
      return rejectWithValue("Failed to sync sabha attendance");
    }
  }
);

//#region start sabha by id
export const startSabha = createAsyncThunk(
  "sabha/startSabha",
  async (sabhaId: number, { rejectWithValue }) => {
    try {
      console.log("sabhaId: ", sabhaId);
      const response = await sabhaService.startSabha(sabhaId);
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to start sabha");
    }
  }
);

//#region submit sabha report
export const submitSabhaReport = createAsyncThunk(
  "sabha/submitSabhaReport",
  async (sabhaId: number, { rejectWithValue }) => {
    try {
      const response = await sabhaService.submitSabhaReport(sabhaId);
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to submit sabha report");
    }
  }
);

//#region create sabha
export const createSabha = createAsyncThunk(
  "sabha/createSabha",
  async (title: string, { rejectWithValue }) => {
    try {
      const response = await sabhaService.createSabha(title);
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to create sabha");
    }
  }
);

//#region update sabha
export const updateSabha = createAsyncThunk(
  "sabha/updateSabha",
  async (
    { sabhaId, title }: { sabhaId: number; title: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await sabhaService.updateSabha(sabhaId, title);
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to update sabha");
    }
  }
);

// #region sabha slice
const sabhaSlice = createSlice({
  name: "sabha",
  initialState,
  reducers: {
    setSabhaList(state, action: PayloadAction<SabhaData[]>) {
      state.sabhaList = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setSabhaMemberSearchText(state, action: PayloadAction<string>) {
      state.searchText = action.payload;
    },
    openSabhaFormDialog(state, action: PayloadAction<SabhaData | null>) {
      state.sabhaFormDialog = true;
      state.selectedSabha = action.payload;
    },
    closeSabhaFormDailog(state) {
      state.sabhaFormDialog = false;
      state.selectedSabha = null;
    },
    doMemberPresent: (state, action: PayloadAction<number>) => {
      const userId = action.payload;

      // 1. Find the user
      const findUser = state.sabhaMembers.find(
        (member) => member.id === userId
      );

      // 2. LocalStorage updates
      let presentUsers =
        localJsonStorageService.getItem<number[]>(PRESENT_MEMBER) || [];

      let absentUsers =
        localJsonStorageService.getItem<number[]>(ABSENT_MEMBER) || [];

      // Add to present if not exists
      if (!presentUsers.includes(userId)) {
        presentUsers.push(userId);
      }

      // Remove from absent if exists
      absentUsers = absentUsers.filter((u) => u !== userId);

      // Save back
      localJsonStorageService.setItem(PRESENT_MEMBER, presentUsers);
      localJsonStorageService.setItem(ABSENT_MEMBER, absentUsers);

      if (findUser) {
        // 2. Update state only if currently marked absent
        state.totalPresentOnSelectedSabha += 1;

        if (findUser.is_present === false) {
          // If was absent, decrement absent count
          state.totalAbsentOnSelectedSabha = Math.max(
            0,
            state.totalAbsentOnSelectedSabha - 1
          );
        }
        findUser.is_present = true;
      }
    },
    doMemberAbsent: (state, action: PayloadAction<number>) => {
      const userId = action.payload;

      // 1. Find the user
      const findUser = state.sabhaMembers.find(
        (member) => member.id === userId
      );

      // 2. LocalStorage updates
      let absentUsers =
        localJsonStorageService.getItem<number[]>(ABSENT_MEMBER) || [];

      let presentUsers =
        localJsonStorageService.getItem<number[]>(PRESENT_MEMBER) || [];

      // Add to absent if not exists
      if (!absentUsers.includes(userId)) {
        absentUsers.push(userId);
      }

      // Remove from present if exists
      presentUsers = presentUsers.filter((u) => u !== userId);

      // Save back
      localJsonStorageService.setItem(ABSENT_MEMBER, absentUsers);
      localJsonStorageService.setItem(PRESENT_MEMBER, presentUsers);

      if (findUser) {
        // 2. Update state if currently marked present or not marked
        if (findUser.is_present === true) {
          // If was present, decrement present count
          state.totalPresentOnSelectedSabha = Math.max(
            0,
            state.totalPresentOnSelectedSabha - 1
          );
        }
        findUser.is_present = false;
        state.totalAbsentOnSelectedSabha += 1;
      }
    },
  },
  extraReducers: (builder) => {
    //#region fetch sabha list
    builder
      .addCase(fetchSabhaList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSabhaList.fulfilled,
        (
          state,
          action: PayloadAction<{ rows: SabhaData[]; count: number }>
        ) => {
          state.loading = false;
          state.sabhaList = [...state.sabhaList, ...action.payload.rows];
          state.totalSabha = action.payload.count;
        }
      )
      .addCase(fetchSabhaList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    //#region fetch sabha by id
    builder
      .addCase(fetchSabhaById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSabhaById.fulfilled,
        (
          state,
          action: PayloadAction<{
            sabha: SabhaData;
            total_present: number;
            total_absent: number;
            users: MemberData[];
          }>
        ) => {
          state.loading = false;
          state.selectedSabha = action.payload.sabha;
          state.sabhaMembers = action.payload.users;
          state.totalPresentOnSelectedSabha = action.payload.total_present;
          state.totalAbsentOnSelectedSabha = action.payload.total_absent;
        }
      )

      .addCase(fetchSabhaById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    //#region sync sabha attendance
    builder
      .addCase(syncSabhaAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncSabhaAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.totalPresentOnSelectedSabha = action.payload.total_present;
        state.totalAbsentOnSelectedSabha = action.payload.total_absent;
        state.sabhaMembers = action.payload.users;
      })
      .addCase(syncSabhaAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    //#region start sabha
    builder
      .addCase(startSabha.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startSabha.fulfilled, (state, action) => {
        if (state.selectedSabha) {
          state.selectedSabha.status = "running";
        }
        state.loading = false;
      })
      .addCase(startSabha.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    //#region submit sabha report
    builder
      .addCase(submitSabhaReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitSabhaReport.fulfilled, (state, action) => {
        if (state.selectedSabha) {
          state.selectedSabha.status = "completed";
        }
        state.loading = false;
      })
      .addCase(submitSabhaReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    //#region create sabha
    builder
      .addCase(createSabha.pending, (state) => {
        state.error = null;
      })
      .addCase(createSabha.fulfilled, (state, action) => {
        state.sabhaList.unshift(action.payload);
        state.totalSabha += 1;
        state.sabhaFormDialog = false;
      })
      .addCase(createSabha.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    //#region update sabha
    builder
      .addCase(updateSabha.pending, (state) => {
        state.error = null;
      })
      .addCase(updateSabha.fulfilled, (state, action) => {
        const updatedSabha = action.payload;
        const index = state.sabhaList.findIndex(
          (sabha) => sabha.id === updatedSabha.id
        );
        if (index !== -1) {
          state.sabhaList[index] = updatedSabha;
        }
        state.sabhaFormDialog = false;
      })
      .addCase(updateSabha.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  setSabhaList,
  setLoading,
  setSabhaMemberSearchText,
  openSabhaFormDialog,
  closeSabhaFormDailog,
  doMemberPresent,
  doMemberAbsent,
} = sabhaSlice.actions;

export const selectFilteredSabhaMembers = (state: { sabha: SabhaState }) => {
  const { sabhaMembers, searchText } = state.sabha;
  return filterMembers(sabhaMembers, searchText);
};

export default sabhaSlice.reducer;
