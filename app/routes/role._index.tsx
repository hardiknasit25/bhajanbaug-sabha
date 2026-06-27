import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import {
  redirect,
  useNavigate,
  type LoaderFunctionArgs,
  type MetaArgs,
} from "react-router";
import LayoutWrapper from "~/components/shared-component/LayoutWrapper";
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
import { useMyPermissions } from "~/hooks/usePermissions";
import { useRoles } from "~/hooks/useRoles";
import type { Role } from "~/types/role.interface";
import { getTokenFromRequest } from "~/utils/getTokenFromRequest";

export function meta({}: MetaArgs) {
  return [
    { title: "User Role" },
    { name: "description", content: "Manage user roles" },
  ];
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const token = getTokenFromRequest(request);
  if (!token) return redirect("/login");
  return null;
};

export default function RolesPage() {
  const navigate = useNavigate();
  const {
    filteredRoles,
    loading,
    searchText,
    fetchRoles,
    setSearchText,
    deleteRole,
  } = useRoles();
  const { can } = useMyPermissions();

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
    <LayoutWrapper
      headerConfigs={{
        title: "User Role",
        className: "flex-col gap-2",
        description: `Total ${filteredRoles.length} Roles`,
        showSearch: true,
        searchPlaceholder: "Search roles...",
        searchValue: searchText,
        onSearchChange: setSearchText,
        children: can("role", "create") ? (
          <button
            type="button"
            onClick={() => navigate("/role/create")}
            className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-primaryColor"
          >
            <Plus size={18} />
            <span className="uppercase">Add</span>
          </button>
        ) : undefined,
      }}
      className="p-4"
    >
      {loading ? (
        <LoadingSpinner />
      ) : filteredRoles.length === 0 ? (
        <div className="mt-10 text-center text-textLightColor">
          No roles found
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredRoles.map((role) => (
            <RoleListCard
              key={role.id}
              role={role}
              canEdit={can("role", "update")}
              canDelete={can("role", "delete")}
              onEdit={(r) => navigate(`/role/update/${r.id}`)}
              onDelete={(r) => {
                setDeleteError(null);
                setRoleToDelete(r);
              }}
            />
          ))}
        </div>
      )}

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

          {deleteError && (
            <p className="text-sm text-errorColor">{deleteError}</p>
          )}

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
    </LayoutWrapper>
  );
}
