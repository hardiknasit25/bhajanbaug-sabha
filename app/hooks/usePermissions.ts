import { useCallback, useEffect, useMemo } from "react";
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

  // Whether the user's role has a permission row for this module — i.e. the
  // module is "defined" for them. GET /permission/my only returns modules the
  // role was assigned, so an absent module means "not configured yet".
  const hasModule = useCallback(
    (moduleKey: string) => myPermissions.some((p) => p.module_key === moduleKey),
    [myPermissions]
  );

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
    hasModule,
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

/**
 * Convenience hook for gating a single module's UI. Ensures the permission map
 * is loaded and returns ready-to-use booleans for each action, e.g.:
 *
 *   const { canCreate, canUpdate } = usePermission("user");
 */
export const usePermission = (moduleKey: string) => {
  const { can, myLoaded, myLoading } = useMyPermissions();
  return useMemo(
    () => ({
      canSelect: can(moduleKey, "select"),
      canRead: can(moduleKey, "read"),
      canCreate: can(moduleKey, "create"),
      canUpdate: can(moduleKey, "update"),
      canDelete: can(moduleKey, "delete"),
      canPublish: can(moduleKey, "publish"),
      // True once the map has been fetched (use to avoid hiding UI mid-load).
      loaded: myLoaded,
      loading: myLoading,
    }),
    [can, moduleKey, myLoaded, myLoading]
  );
};
