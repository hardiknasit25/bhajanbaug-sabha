import { useEffect, useMemo, useState } from "react";
import {
  redirect,
  type LoaderFunctionArgs,
  type MetaArgs,
} from "react-router";
import LayoutWrapper from "~/components/shared-component/LayoutWrapper";
import LoadingSpinner from "~/components/shared-component/LoadingSpinner";
import ModulePermissionCard from "~/components/shared-component/ModulePermissionCard";
import ToggleSwitch from "~/components/shared-component/ToggleSwitch";
import { Accordion } from "~/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useMyPermissions } from "~/hooks/usePermissions";
import { useRoles } from "~/hooks/useRoles";
import type {
  ModulePermission,
  PermissionAction,
  PermissionLevel,
} from "~/types/permission.interface";
import { getTokenFromRequest } from "~/utils/getTokenFromRequest";

export function meta({}: MetaArgs) {
  return [
    { title: "User Permission" },
    { name: "description", content: "Manage role permissions" },
  ];
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const token = getTokenFromRequest(request);
  if (!token) return redirect("/login");
  return null;
};

const LEVELS: { value: PermissionLevel; label: string }[] = [
  { value: "none", label: "None" },
  { value: "mine", label: "Mine" },
  { value: "all", label: "All" },
];

export default function PermissionPage() {
  const { roleSelect, fetchRoleSelect } = useRoles();
  const {
    modulePermissions,
    loading,
    can,
    fetchRolePermissions,
    changePermission,
    changeAllPermissions,
    clearModulePermissions,
  } = useMyPermissions();

  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  // Local UI state for the "apply to all" controls (they fire bulk updates).
  const [bulk, setBulk] = useState({
    p_create: false,
    p_publish: false,
    p_select: "none" as PermissionLevel,
    p_read: "none" as PermissionLevel,
    p_update: "none" as PermissionLevel,
    p_delete: "none" as PermissionLevel,
  });

  // Editing requires create access on the permission module (POST is gated by it).
  const readOnly = !can("permission", "create");

  useEffect(() => {
    fetchRoleSelect();
    return () => {
      clearModulePermissions();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Default to the first role once the list arrives.
  useEffect(() => {
    if (selectedRoleId === null && roleSelect.length > 0) {
      setSelectedRoleId(roleSelect[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleSelect]);

  useEffect(() => {
    if (selectedRoleId !== null) {
      fetchRolePermissions(selectedRoleId);
      setBulk({
        p_create: false,
        p_publish: false,
        p_select: "none",
        p_read: "none",
        p_update: "none",
        p_delete: "none",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoleId]);

  const handleModuleChange = (
    perm: ModulePermission,
    action: PermissionAction,
    value: PermissionLevel | boolean
  ) => {
    if (selectedRoleId === null || readOnly) return;
    changePermission({
      role_id: selectedRoleId,
      module_id: perm.module_id,
      p_select: perm.p_select,
      p_read: perm.p_read,
      p_create: perm.p_create,
      p_update: perm.p_update,
      p_delete: perm.p_delete,
      p_publish: perm.p_publish,
      [action]: value,
    });
  };

  const applyAll = (type: PermissionAction, value: PermissionLevel | boolean) => {
    if (selectedRoleId === null || readOnly) return;
    setBulk((prev) => ({ ...prev, [type]: value }));
    changeAllPermissions({ role_id: selectedRoleId, type, value });
  };

  const selectedRoleName = useMemo(
    () => roleSelect.find((r) => r.id === selectedRoleId)?.name ?? "",
    [roleSelect, selectedRoleId]
  );

  return (
    <LayoutWrapper
      headerConfigs={{
        title: "User Permission",
        description: selectedRoleName ? `Role: ${selectedRoleName}` : undefined,
      }}
      className="p-4"
    >
      <div className="flex flex-col gap-4">
        {/* Role selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-textColor">Role</label>
          <Select
            value={selectedRoleId !== null ? String(selectedRoleId) : ""}
            onValueChange={(v) => setSelectedRoleId(Number(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {roleSelect.map((role) => (
                <SelectItem
                  key={role.id}
                  value={String(role.id)}
                  className="pl-2"
                >
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {readOnly && (
          <p className="rounded-lg bg-yellow-50 px-3 py-2 text-xs text-yellow-700">
            You have view-only access to permissions.
          </p>
        )}

        {/* Apply-to-all controls */}
        {!readOnly && modulePermissions.length > 0 && (
          <div className="rounded-xl border border-borderColor bg-eventCardColor/40 p-4">
            <h3 className="mb-3 text-sm font-semibold text-textColor">
              Apply to all modules
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-textColor">Create</span>
                <ToggleSwitch
                  checked={bulk.p_create}
                  onChange={(v) => applyAll("p_create", v)}
                  aria-label="Set create for all modules"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-textColor">Publish</span>
                <ToggleSwitch
                  checked={bulk.p_publish}
                  onChange={(v) => applyAll("p_publish", v)}
                  aria-label="Set publish for all modules"
                />
              </div>
              {(
                [
                  ["p_select", "Select"],
                  ["p_read", "Read"],
                  ["p_update", "Update"],
                  ["p_delete", "Delete"],
                ] as [PermissionAction, string][]
              ).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-textColor">{label}</span>
                  <Select
                    value={bulk[key as keyof typeof bulk] as string}
                    onValueChange={(v) =>
                      applyAll(key, v as PermissionLevel)
                    }
                  >
                    <SelectTrigger className="h-9 w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LEVELS.map((opt) => (
                        <SelectItem
                          key={opt.value}
                          value={opt.value}
                          className="pl-2"
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Module list */}
        {loading ? (
          <LoadingSpinner />
        ) : modulePermissions.length === 0 ? (
          <div className="mt-6 text-center text-textLightColor">
            {selectedRoleId === null
              ? "Select a role to manage permissions"
              : "No modules found"}
          </div>
        ) : (
          <Accordion type="single" collapsible className="flex flex-col gap-3">
            {modulePermissions.map((perm) => (
              <ModulePermissionCard
                key={perm.module_key}
                permission={perm}
                disabled={readOnly}
                onChange={(action, value) =>
                  handleModuleChange(perm, action, value)
                }
              />
            ))}
          </Accordion>
        )}
      </div>
    </LayoutWrapper>
  );
}
