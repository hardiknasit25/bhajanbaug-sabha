import { useEffect } from "react";
import {
  redirect,
  useParams,
  type LoaderFunctionArgs,
  type MetaArgs,
} from "react-router";
import RoleForm from "~/components/forms/RoleForm";
import LayoutWrapper from "~/components/shared-component/LayoutWrapper";
import LoadingSpinner from "~/components/shared-component/LoadingSpinner";
import { useRoles } from "~/hooks/useRoles";
import { getTokenFromRequest } from "~/utils/getTokenFromRequest";

export function meta({}: MetaArgs) {
  return [{ title: "Update Role" }];
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const token = getTokenFromRequest(request);
  if (!token) return redirect("/login");
  return null;
};

export default function UpdateRolePage() {
  const { id } = useParams();
  const roleId = Number(id);
  const { roles, loading, fetchRoles } = useRoles();

  // There's no get-by-id endpoint, so make sure the list is loaded then look it up.
  useEffect(() => {
    if (roles.length === 0) fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const role = roles.find((r) => r.id === roleId);

  return (
    <LayoutWrapper
      showTab={false}
      headerConfigs={{
        title: "Update Role",
        iconName: "ArrowLeft",
      }}
      className="p-4"
    >
      {loading && !role ? (
        <LoadingSpinner />
      ) : role ? (
        <RoleForm mode="update" initialData={role} />
      ) : (
        <div className="mt-10 text-center text-textLightColor">
          Role not found
        </div>
      )}
    </LayoutWrapper>
  );
}
