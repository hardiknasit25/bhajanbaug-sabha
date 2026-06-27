export type PermissionLevel = "none" | "mine" | "all";

export type PermissionAction =
  | "p_select"
  | "p_read"
  | "p_create"
  | "p_update"
  | "p_delete"
  | "p_publish";

// A simple read action used for menu/feature gating on the client.
export type CanAction = "select" | "read" | "create" | "update" | "delete" | "publish";

// One module row with the effective permission for a given role.
export interface ModulePermission {
  module_id: number;
  module_name: string;
  module_key: string;
  module_type?: "user" | "admin";
  p_select: PermissionLevel;
  p_read: PermissionLevel;
  p_create: boolean;
  p_update: PermissionLevel;
  p_delete: PermissionLevel;
  p_publish: boolean;
}

// The logged-in user's own permission map (returned by GET /permission/my).
export interface MyPermission {
  module_id: number;
  module_name: string;
  module_key: string;
  p_select: PermissionLevel;
  p_read: PermissionLevel;
  p_create: boolean;
  p_update: PermissionLevel;
  p_delete: PermissionLevel;
  p_publish: boolean;
}

export interface ChangePermissionPayload {
  role_id: number;
  module_id: number;
  p_select: PermissionLevel;
  p_read: PermissionLevel;
  p_create: boolean;
  p_update: PermissionLevel;
  p_delete: PermissionLevel;
  p_publish: boolean;
}

export interface ChangeAllPermissionPayload {
  role_id: number;
  type: PermissionAction;
  value: PermissionLevel | boolean;
}
