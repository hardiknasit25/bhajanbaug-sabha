export type ModuleType = "user" | "admin";

export interface ModuleItem {
  id: number;
  name: string;
  key: string;
  type: ModuleType | null;
}

export interface ModulePayload {
  name: string;
  type: ModuleType;
}
