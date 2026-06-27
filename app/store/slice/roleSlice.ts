import {
  createAsyncThunk,
  createSelector,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { roleService } from "~/services/roleService";
import type { Role, RolePayload, RoleSelect } from "~/types/role.interface";

interface RoleState {
  roles: Role[];
  roleSelect: RoleSelect[];
  loading: boolean;
  error: string | null;
  searchText: string;
}

const initialState: RoleState = {
  roles: [],
  roleSelect: [],
  loading: false,
  error: null,
  searchText: "",
};

//#region fetch roles
export const fetchRoles = createAsyncThunk(
  "roles/fetchRoles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await roleService.getRoles();
      return response.data as Role[];
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

//#region fetch roles for select dropdown
export const fetchRoleSelect = createAsyncThunk(
  "roles/fetchRoleSelect",
  async (_, { rejectWithValue }) => {
    try {
      const response = await roleService.getRoleSelect();
      return response.data as RoleSelect[];
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

//#region create role
export const createRole = createAsyncThunk(
  "roles/createRole",
  async (payload: RolePayload, { rejectWithValue }) => {
    try {
      const response = await roleService.createRole(payload);
      return response.data as Role;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

//#region update role
export const updateRole = createAsyncThunk(
  "roles/updateRole",
  async (
    payload: { id: number; data: RolePayload },
    { rejectWithValue }
  ) => {
    try {
      const response = await roleService.updateRole(payload.id, payload.data);
      return response.data as Role;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

//#region delete role
export const deleteRole = createAsyncThunk(
  "roles/deleteRole",
  async (id: number, { rejectWithValue }) => {
    try {
      await roleService.deleteRole(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

const roleSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    setRoleSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    },
    setRoleError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    //#region fetch roles
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload ?? [];
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        // An empty list comes back as a 400 from the API; treat it as "no roles".
        state.roles = [];
        state.error = action.payload as string;
      });

    //#region fetch role select
    builder.addCase(fetchRoleSelect.fulfilled, (state, action) => {
      state.roleSelect = action.payload ?? [];
    });

    //#region create role
    builder
      .addCase(createRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) state.roles.push(action.payload);
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    //#region update role
    builder
      .addCase(updateRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.roles.findIndex((r) => r.id === action.payload?.id);
        if (index !== -1) state.roles[index] = action.payload;
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    //#region delete role
    builder
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.roles = state.roles.filter((r) => r.id !== action.payload);
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setRoleSearchText, setRoleError } = roleSlice.actions;

export const selectFilteredRoles = createSelector(
  [
    (state: { roles: RoleState }) => state.roles.roles,
    (state: { roles: RoleState }) => state.roles.searchText,
  ],
  (roles, searchText) => {
    const q = searchText.trim().toLowerCase();
    if (!q) return roles;
    return roles.filter(
      (r) =>
        r.name?.toLowerCase().includes(q) ||
        r.user_type?.toLowerCase().includes(q)
    );
  }
);

export default roleSlice.reducer;
