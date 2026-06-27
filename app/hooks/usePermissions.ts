import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  changeAllPermissions,
  changePermission,
  clearModulePermissions,
  fetchMyPermissions,
  fetchRolePermissions,
} from "~/store/slice/permissionSlice";
import type {
  CanAction,
  ChangeAllPermissionPayload,
  ChangePermissionPayload,
} from "~/types/permission.interface";

export const usePermissions = () => {
  const dispatch = useAppDispatch();
  const permissions = useAppSelector((state) => state.permissions);
  const { myPermissions, myLoaded } = permissions;

  // Load the current user's permission map once (used for menu gating).
  const ensureMyPermissions = useCallback(() => {
    if (!myLoaded) dispatch(fetchMyPermissions());
  }, [dispatch, myLoaded]);

  // True when the user is allowed to perform `action` on `moduleKey`.
  const can = useCallback(
    (moduleKey: string, action: CanAction = "read") => {
      const perm = myPermissions.find((p) => p.module_key === moduleKey);
      if (!perm) return false;
      switch (action) {
        case "create":
          return !!perm.p_create;
        case "publish":
          return !!perm.p_publish;
        case "select":
          return perm.p_select !== "none";
        case "read":
          return perm.p_read !== "none";
        case "update":
          return perm.p_update !== "none";
        case "delete":
          return perm.p_delete !== "none";
        default:
          return false;
      }
    },
    [myPermissions]
  );

  return {
    // state
    ...permissions,

    // gating helpers
    can,
    ensureMyPermissions,

    // thunks
    fetchMyPermissions: () => dispatch(fetchMyPermissions()),
    fetchRolePermissions: (roleId: number) =>
      dispatch(fetchRolePermissions(roleId)),
    changePermission: (payload: ChangePermissionPayload) =>
      dispatch(changePermission(payload)),
    changeAllPermissions: (payload: ChangeAllPermissionPayload) =>
      dispatch(changeAllPermissions(payload)),
    clearModulePermissions: () => dispatch(clearModulePermissions()),
  };
};

// Convenience hook that guarantees the user's permission map is loaded.
export const useMyPermissions = () => {
  const api = usePermissions();
  useEffect(() => {
    api.ensureMyPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return api;
};
