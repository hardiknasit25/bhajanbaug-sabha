import { cn } from "~/lib/utils";
import type {
  ModulePermission,
  PermissionAction,
  PermissionLevel,
} from "~/types/permission.interface";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import ToggleSwitch from "./ToggleSwitch";

const LEVEL_OPTIONS: { value: PermissionLevel; label: string }[] = [
  { value: "none", label: "None" },
  { value: "mine", label: "Mine" },
  { value: "all", label: "All" },
];

interface ModulePermissionCardProps {
  permission: ModulePermission;
  disabled?: boolean;
  onChange: (action: PermissionAction, value: PermissionLevel | boolean) => void;
}

function LevelSelect({
  label,
  value,
  disabled,
  onChange,
}: {
  label: string;
  value: PermissionLevel;
  disabled?: boolean;
  onChange: (value: PermissionLevel) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm text-textColor">{label}</span>
      <Select
        value={value}
        onValueChange={(v) => onChange(v as PermissionLevel)}
        disabled={disabled}
      >
        <SelectTrigger className="h-9 w-28">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LEVEL_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="pl-2">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function SwitchRow({
  label,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm text-textColor">{label}</span>
      <ToggleSwitch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        aria-label={label}
      />
    </div>
  );
}

// Compact summary chip count shown on the collapsed trigger.
function activeCount(p: ModulePermission) {
  let count = 0;
  if (p.p_create) count++;
  if (p.p_publish) count++;
  (["p_select", "p_read", "p_update", "p_delete"] as const).forEach((k) => {
    if (p[k] !== "none") count++;
  });
  return count;
}

function ModulePermissionCard({
  permission,
  disabled = false,
  onChange,
}: ModulePermissionCardProps) {
  const enabled = activeCount(permission);

  return (
    <AccordionItem
      value={permission.module_key}
      className="rounded-xl border border-borderColor bg-white px-4 shadow-sm"
    >
      <AccordionTrigger className="hover:no-underline">
        <div className="flex flex-1 items-center justify-between gap-2 pr-2">
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold capitalize text-textColor">
              {permission.module_name}
            </span>
            {permission.module_type && (
              <span className="text-xs capitalize text-textLightColor">
                {permission.module_type}
              </span>
            )}
          </div>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium",
              enabled > 0
                ? "bg-eventCardColor text-eventCardBorderColor"
                : "bg-gray-100 text-textLightColor"
            )}
          >
            {enabled}/6
          </span>
        </div>
      </AccordionTrigger>

      <AccordionContent className="space-y-3 border-t border-borderColor/60 pt-3">
        <SwitchRow
          label="Create"
          checked={permission.p_create}
          disabled={disabled}
          onChange={(v) => onChange("p_create", v)}
        />
        <SwitchRow
          label="Publish"
          checked={permission.p_publish}
          disabled={disabled}
          onChange={(v) => onChange("p_publish", v)}
        />
        <LevelSelect
          label="Select"
          value={permission.p_select}
          disabled={disabled}
          onChange={(v) => onChange("p_select", v)}
        />
        <LevelSelect
          label="Read"
          value={permission.p_read}
          disabled={disabled}
          onChange={(v) => onChange("p_read", v)}
        />
        <LevelSelect
          label="Update"
          value={permission.p_update}
          disabled={disabled}
          onChange={(v) => onChange("p_update", v)}
        />
        <LevelSelect
          label="Delete"
          value={permission.p_delete}
          disabled={disabled}
          onChange={(v) => onChange("p_delete", v)}
        />
      </AccordionContent>
    </AccordionItem>
  );
}

export default ModulePermissionCard;
