export type RoleUserType = "admin" | "user";

export interface Role {
  id: number;
  user_type: RoleUserType;
  name: string;
  role_level: number | null;
  same_level_edit: boolean | null;
}

export interface RolePayload {
  user_type: RoleUserType;
  name: string;
  role_level: number;
  same_level_edit: boolean;
}

export interface RoleSelect {
  id: number;
  name: string;
}
