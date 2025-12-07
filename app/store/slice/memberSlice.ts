import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import Fuse, { type IFuseOptions } from "fuse.js";
import { memberService } from "~/services/memberService";
import type { CommonParams } from "~/types/common.interface";
import type { MemberData, MemberStatus } from "~/types/members.interface";
import { filterMembers } from "~/utils/filterMembers";

interface MemberState {
  members: MemberData[];
  selectedMember: MemberData | null;
  totalMembers: number;
  loading: boolean;
  error: string | null;
  searchText: string;
}

const initialState: MemberState = {
  members: [],
  selectedMember: null,
  totalMembers: 0,
  loading: false,
  error: null,
  searchText: "",
};

//#region fetch members
export const fetchMembers = createAsyncThunk(
  "members/fetchMembers",
  async (params: CommonParams, { rejectWithValue }) => {
    try {
      const response = await memberService.getMembers(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

//#region fetch member by id
export const fetchMemberById = createAsyncThunk(
  "members/fetchMemberById",
  async (memberId: number, { rejectWithValue }) => {
    try {
      const response = await memberService.getMemberById(memberId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

//#region create member
export const createMember = createAsyncThunk(
  "members/createMember",
  async (memberData: MemberData, { rejectWithValue }) => {
    try {
      const response = await memberService.createMember(memberData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

//#reion fetch poshak groups
export const fetchPoshakGroups = createAsyncThunk(
  "members/fetchPoshakGroups",
  async (params: CommonParams, { rejectWithValue }) => {
    try {
      const response = await memberService.getPoshakGroup(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

//#region member slice

const memberSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    setMembers: (state, action: PayloadAction<MemberData[]>) => {
      state.members = action.payload;
    },
    setSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    //#region fetch members
    builder
      .addCase(fetchMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload.rows;
        state.totalMembers = action.payload.count;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    //#region fetchMemberById
    builder
      .addCase(fetchMemberById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMemberById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedMember = action.payload;
      })
      .addCase(fetchMemberById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    //#region create member
    builder
      .addCase(createMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMember.fulfilled, (state, action) => {
        state.loading = false;
        state.members.push(action.payload);
      })
      .addCase(createMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setMembers, setSearchText, setLoading, setError } =
  memberSlice.actions;

export const selectFilteredMembers = (state: { members: MemberState }) => {
  const { members, searchText } = state.members;
  return filterMembers(members, searchText);
};

export default memberSlice.reducer;
