import { redirect, type LoaderFunctionArgs, type MetaArgs } from "react-router";
import RoleForm from "~/components/forms/RoleForm";
import LayoutWrapper from "~/components/shared-component/LayoutWrapper";
import { getTokenFromRequest } from "~/utils/getTokenFromRequest";

export function meta({}: MetaArgs) {
  return [{ title: "Create Role" }];
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const token = getTokenFromRequest(request);
  if (!token) return redirect("/login");
  return null;
};

export default function CreateRolePage() {
  return (
    <LayoutWrapper
      showTab={false}
      headerConfigs={{
        title: "Create Role",
        iconName: "ArrowLeft",
      }}
      className="p-4"
    >
      <RoleForm mode="create" />
    </LayoutWrapper>
  );
}
