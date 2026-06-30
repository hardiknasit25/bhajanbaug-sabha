import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import RoleForm from "~/components/forms/RoleForm";
import LoadingSpinner from "~/components/shared-component/LoadingSpinner";
import RoleListCard from "~/components/shared-component/RoleListCard";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { usePermission } from "~/hooks/usePermissions";
import { useRoles } from "~/hooks/useRoles";
import type { Role } from "~/types/role.interface";

// Roles tab: list + create/edit (RoleForm in a dialog) + delete.
export default function RoleManager() {
  const { filteredRoles, loading, fetchRoles, deleteRole, setSearchText } =
    useRoles();
  const { canCreate, canUpdate, canDelete } = usePermission("role");

  // null = closed; { } = create; { role } = edit
  const [formState, setFormState] = useState<{ role?: Role } | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    setSearchText("");
    fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteRole(roleToDelete.id).unwrap();
      setRoleToDelete(null);
    } catch (error) {
      setDeleteError(
        typeof error === "string" ? error : "Unable to delete this role."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-textLightColor">
          Total {filteredRoles.length} Roles
        </span>
        {canCreate && (
          <button
            type="button"
            onClick={() => setFormState({})}
            className="flex items-center gap-1 rounded-full bg-primaryColor px-3 py-1.5 text-sm font-medium text-white"
          >
            <Plus size={16} />
            <span className="uppercase">Add Role</span>
          </button>
        )}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filteredRoles.length === 0 ? (
        <div className="mt-8 text-center text-textLightColor">No roles found</div>
      ) : (
        filteredRoles.map((role) => (
          <RoleListCard
            key={role.id}
            role={role}
            canEdit={canUpdate}
            canDelete={canDelete}
            onEdit={(r) => setFormState({ role: r })}
            onDelete={(r) => {
              setDeleteError(null);
              setRoleToDelete(r);
            }}
          />
        ))
      )}

      {/* Create / edit role */}
      <Dialog open={!!formState} onOpenChange={(open) => !open && setFormState(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-textColor">
              {formState?.role ? "Edit Role" : "Create Role"}
            </DialogTitle>
          </DialogHeader>
          {formState && (
            <RoleForm
              mode={formState.role ? "update" : "create"}
              initialData={formState.role}
              onSuccess={() => setFormState(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog
        open={!!roleToDelete}
        onOpenChange={(open) => !open && setRoleToDelete(null)}
      >
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-textColor">Delete Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{roleToDelete?.name}</span>? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {deleteError && <p className="text-sm text-errorColor">{deleteError}</p>}

          <DialogFooter className="flex flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-full"
              onClick={() => setRoleToDelete(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="flex-1 rounded-full bg-deleteButtonColor text-white hover:bg-deleteButtonColor/90"
              onClick={handleConfirmDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
