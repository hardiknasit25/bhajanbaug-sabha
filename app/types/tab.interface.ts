import type { LucideIcon } from "lucide-react";
import type { CanAction } from "./permission.interface";

export interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon; // Lucide icon component type
  path: string;
  show?: boolean; // optional: defaults to true
  // Permission module that gates this tab. When set, the tab is only shown if
  // the user `can(moduleKey, action)`. Omit for always-visible tabs (e.g. Home).
  moduleKey?: string;
  action?: CanAction; // defaults to "read"
  // When true, the tab requires explicit access — it is hidden unless the user
  // is granted read on `moduleKey` (no fail-open). Use this once the module
  // actually exists on the backend (e.g. the "sabha" module).
  strict?: boolean;
}
