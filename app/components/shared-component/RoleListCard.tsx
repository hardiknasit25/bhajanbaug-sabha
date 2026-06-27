import { Pencil, Trash2 } from "lucide-react";
import { cn } from "~/lib/utils";
import type { Role } from "~/types/role.interface";

interface RoleListCardProps {
  role: Role;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

function RoleListCard({
  role,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
}: RoleListCardProps) {
  return (
    <div className="w-full rounded-xl border border-borderColor bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-1 flex-col gap-2">
          <h3 className="text-base font-semibold capitalize text-textColor">
            {role.name}
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-eventCardColor px-2.5 py-0.5 text-xs font-medium capitalize text-eventCardBorderColor">
              {role.user_type}
            </span>
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-textLightColor">
              Level: {role.role_level ?? "N/A"}
            </span>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-medium",
                role.same_level_edit
                  ? "bg-green-100 text-greenTextColor"
                  : "bg-red-100 text-redTextColor"
              )}
            >
              Same Level Edit: {role.same_level_edit ? "Yes" : "No"}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {canEdit && (
            <button
              type="button"
              onClick={() => onEdit(role)}
              aria-label={`Edit ${role.name}`}
              className="flex size-9 items-center justify-center rounded-full text-textLightColor transition-colors hover:bg-gray-100 hover:text-primaryColor"
            >
              <Pencil size={18} />
            </button>
          )}
          {canDelete && (
            <button
              type="button"
              onClick={() => onDelete(role)}
              aria-label={`Delete ${role.name}`}
              className="flex size-9 items-center justify-center rounded-full text-deleteButtonColor transition-colors hover:bg-red-50"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoleListCard;
