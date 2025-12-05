import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import Fuse, { type IFuseOptions } from "fuse.js";
import { memberService } from "~/services/memberService";
import type { CommonParams } from "~/types/common.interface";
import type { MemberData, MemberStatus } from "~/types/members.interface";

interface MemberState {
  members: MemberData[];
  totalMembers: number;
  loading: boolean;
  error: string | null;
  searchText: string;
}

const initialState: MemberState = {
  members: [],
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

// Selector for filtered members using Fuse.js for fuzzy search
// export const selectFilteredMembers = (state: { members: MemberState }) => {
//   const { members: memberList, searchText } = state.members;
//   if (!searchText.trim()) {
//     return memberList;
//   }

//   // Fuse.js options for fuzzy search
//   const fuseOptions: IFuseOptions<MemberData> = {
//     keys: [
//       { name: "first_name", weight: 1 },
//       { name: "last_name", weight: 1 },
//       { name: "middle_name", weight: 1 },
//       { name: "smk_no", weight: 1 },
//       { name: "id", weight: 0.9 },
//     ],
//     threshold: 1, // 0 = exact match, 1 = match anything. 0.4 is good balance
//   };

//   const fuse = new Fuse(memberList, fuseOptions);
//   const results = fuse.search(searchText);

//   // Return just the items, sorted by relevance (score)
//   return results.map((result) => result.item);
// };

export const selectFilteredMembers = (state: { members: MemberState }) => {
  const { members: memberList, searchText } = state.members;

  const query = searchText.trim().toLowerCase();
  if (!query) return memberList;

  const words = query.split(" ").filter(Boolean);

  const normalized = memberList.map((m) => ({
    ...m,
    first: (m.first_name || "").toLowerCase(),
    middle: (m.middle_name || "").toLowerCase(),
    last: (m.last_name || "").toLowerCase(),
    fullName: [m.first_name, m.middle_name, m.last_name]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
    smk: (m.smk_no || "").toString().toLowerCase(),
  }));

  return normalized.filter((m) =>
    words.every(
      (w) =>
        m.first.includes(w) ||
        m.middle.includes(w) ||
        m.last.includes(w) ||
        m.fullName.includes(w) ||
        m.smk.includes(w) ||
        m.id?.toString().includes(w)
    )
  );
};

export default memberSlice.reducer;
