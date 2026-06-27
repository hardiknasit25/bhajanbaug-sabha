import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import { permissionService } from "~/services/permissionService";
import type {
  ChangeAllPermissionPayload,
  ChangePermissionPayload,
  ModulePermission,
  MyPermission,
} from "~/types/permission.interface";

interface PermissionState {
  // The logged-in user's own permissions (for menu/feature gating).
  myPermissions: MyPermission[];
  myLoaded: boolean;
  myLoading: boolean;
  // The full module list + permissions for the role being edited.
  modulePermissions: ModulePermission[];
  loading: boolean;
  error: string | null;
}

const initialState: PermissionState = {
  myPermissions: [],
  myLoaded: false,
  myLoading: false,
  modulePermissions: [],
  loading: false,
  error: null,
};

//#region fetch my permissions (gating)
export const fetchMyPermissions = createAsyncThunk(
  "permissions/fetchMyPermissions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await permissionService.getMyPermissions();
      return response.data as MyPermission[];
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

//#region fetch a role's module permissions (editor)
export const fetchRolePermissions = createAsyncThunk(
  "permissions/fetchRolePermissions",
  async (roleId: number, { rejectWithValue }) => {
    try {
      const response = await permissionService.getRolePermissions(roleId);
      return response.data as ModulePermission[];
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

//#region change a single module permission
export const changePermission = createAsyncThunk(
  "permissions/changePermission",
  async (payload: ChangePermissionPayload, { rejectWithValue }) => {
    try {
      const response = await permissionService.changePermission(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

//#region apply a permission type to every module
export const changeAllPermissions = createAsyncThunk(
  "permissions/changeAllPermissions",
  async (payload: ChangeAllPermissionPayload, { rejectWithValue }) => {
    try {
      const response = await permissionService.changeAllPermissions(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

const permissionSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    clearModulePermissions: (state) => {
      state.modulePermissions = [];
    },
  },
  extraReducers: (builder) => {
    //#region my permissions
    builder
      .addCase(fetchMyPermissions.pending, (state) => {
        state.myLoading = true;
      })
      .addCase(fetchMyPermissions.fulfilled, (state, action) => {
        state.myLoading = false;
        state.myLoaded = true;
        state.myPermissions = action.payload ?? [];
      })
      .addCase(fetchMyPermissions.rejected, (state) => {
        state.myLoading = false;
        state.myLoaded = true;
        state.myPermissions = [];
      });

    //#region role module permissions
    builder
      .addCase(fetchRolePermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.modulePermissions = [];
      })
      .addCase(fetchRolePermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.modulePermissions = action.payload ?? [];
      })
      .addCase(fetchRolePermissions.rejected, (state, action) => {
        state.loading = false;
        state.modulePermissions = [];
        state.error = action.payload as string;
      });

    //#region single change — optimistic via the request payload
    builder
      .addCase(changePermission.pending, (state, action) => {
        const arg = action.meta.arg;
        const idx = state.modulePermissions.findIndex(
          (m) => m.module_id === arg.module_id
        );
        if (idx !== -1) {
          state.modulePermissions[idx] = {
            ...state.modulePermissions[idx],
            p_select: arg.p_select,
            p_read: arg.p_read,
            p_create: arg.p_create,
            p_update: arg.p_update,
            p_delete: arg.p_delete,
            p_publish: arg.p_publish,
          };
        }
      })
      .addCase(changePermission.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    //#region bulk change — optimistic apply to every module
    builder
      .addCase(changeAllPermissions.pending, (state, action) => {
        const { type, value } = action.meta.arg;
        state.modulePermissions = state.modulePermissions.map((m) => ({
          ...m,
          [type]: value,
        }));
      })
      .addCase(changeAllPermissions.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearModulePermissions } = permissionSlice.actions;

export default permissionSlice.reducer;
