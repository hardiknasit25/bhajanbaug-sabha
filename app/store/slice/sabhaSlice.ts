import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { sabhaService } from "~/services/sabhaService";
import type { CommonParams } from "~/types/common.interface";
import type { SabhaData } from "~/types/sabha.interface";

interface SabhaState {
  sabhaList: SabhaData[];
  totalSabha: number;
  loading: boolean;
  error: string | null;
}

const initialState: SabhaState = {
  sabhaList: [],
  totalSabha: 0,
  loading: false,
  error: null,
};

//#region fetch sabha list
export const fetchSabhaList = createAsyncThunk(
  "sabha/fetchSabhaList",
  async (params: CommonParams, { rejectWithValue }) => {
    try {
      // Here you can call your service to fetch sabha list
      const response = await sabhaService.getSabhas(params);
      return response.data as { rows: SabhaData[]; count: number };
    } catch (error) {
      return rejectWithValue("Failed to fetch sabha list");
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
  },
});

export const { setSabhaList, setLoading } = sabhaSlice.actions;
export default sabhaSlice.reducer;
