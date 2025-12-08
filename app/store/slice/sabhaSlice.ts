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
      return response.data;
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

      if (findUser && !findUser.is_present) {
        // 2. Update state only if currently marked absent
        findUser.is_present = true;
        state.totalPresentOnSelectedSabha += 1;
        state.totalAbsentOnSelectedSabha = Math.max(
          0,
          state.totalAbsentOnSelectedSabha - 1
        );
      }
    },
    doMemberAbsent: (state, action: PayloadAction<number>) => {
      const userId = action.payload;

      // 1. Find the user
      const findUser = state.sabhaMembers.find(
        (member) => member.id === userId
      );

      if (findUser && findUser.is_present !== false) {
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
          state.sabhaList = [...state.sabhaList, ...action.payload.rows];
          state.totalSabha = action.payload.count;
          state.loading = false;
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
            users: MemberData[];
          }>
        ) => {
          // Get localStorage arrays
          const presentFromStorage =
            localJsonStorageService.getItem<number[]>(PRESENT_MEMBER) || [];
          const absentFromStorage =
            localJsonStorageService.getItem<number[]>(ABSENT_MEMBER) || [];

          // Update state from response
          state.selectedSabha = action.payload.sabha;
          state.sabhaMembers = action.payload.users;

          // Sync localStorage with response data
          let updatedPresentStorage = [...presentFromStorage];
          let updatedAbsentStorage = [...absentFromStorage];

          action.payload.users.forEach((user) => {
            const userId = user.id;

            // If is_present is null in response, use localStorage value
            if (user.is_present === null || user.is_present === undefined) {
              // Check if user was marked as present in localStorage
              if (updatedPresentStorage.includes(userId)) {
                user.is_present = true;
              }
              // Check if user was marked as absent in localStorage
              else if (updatedAbsentStorage.includes(userId)) {
                user.is_present = false;
              }
            } else {
              // Response has a value (true or false), sync localStorage
              if (user.is_present === true) {
                // Add to present, remove from absent
                if (!updatedPresentStorage.includes(userId)) {
                  updatedPresentStorage.push(userId);
                }
                updatedAbsentStorage = updatedAbsentStorage.filter(
                  (id) => id !== userId
                );
              } else if (user.is_present === false) {
                // Add to absent, remove from present
                if (!updatedAbsentStorage.includes(userId)) {
                  updatedAbsentStorage.push(userId);
                }
                updatedPresentStorage = updatedPresentStorage.filter(
                  (id) => id !== userId
                );
              }
            }
          });

          // Update localStorage with synced data
          localJsonStorageService.setItem(
            PRESENT_MEMBER,
            updatedPresentStorage
          );
          localJsonStorageService.setItem(ABSENT_MEMBER, updatedAbsentStorage);

          // Calculate totals based on synced user data
          state.totalPresentOnSelectedSabha = state.sabhaMembers.filter(
            (u) => u.is_present === true
          ).length;
          state.totalAbsentOnSelectedSabha = state.sabhaMembers.filter(
            (u) => u.is_present === false
          ).length;

          state.loading = false;
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
