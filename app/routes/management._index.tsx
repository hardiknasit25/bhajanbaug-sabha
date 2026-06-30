import {
  redirect,
  type LoaderFunctionArgs,
  type MetaArgs,
} from "react-router";
import LayoutWrapper from "~/components/shared-component/LayoutWrapper";
import ModuleManager from "~/components/shared-component/ModuleManager";
import RoleManager from "~/components/shared-component/RoleManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { usePermission } from "~/hooks/usePermissions";
import { getTokenFromRequest } from "~/utils/getTokenFromRequest";

export function meta({}: MetaArgs) {
  return [
    { title: "Roles & Modules" },
    { name: "description", content: "Manage roles and modules" },
  ];
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const token = getTokenFromRequest(request);
  if (!token) return redirect("/login");
  return null;
};

export default function ManagementPage() {
  const role = usePermission("role");
  const mod = usePermission("module");

  // Stay permissive until the permission map has loaded, then gate each tab.
  const showRoles = !role.loaded || role.canRead;
  const showModules = !mod.loaded || mod.canRead;
  const defaultTab = showRoles ? "roles" : "modules";

  return (
    <LayoutWrapper headerConfigs={{ title: "Roles & Modules" }}>
      <Tabs
        defaultValue={defaultTab}
        className="flex h-full w-full flex-col justify-start"
      >
        <TabsList className="h-10 w-full justify-evenly rounded-none bg-primaryColor pb-2">
          {showRoles && <TabsTrigger value="roles">Roles</TabsTrigger>}
          {showModules && <TabsTrigger value="modules">Modules</TabsTrigger>}
        </TabsList>

        {showRoles && (
          <TabsContent value="roles" className="h-full w-full overflow-y-auto p-4">
            <RoleManager />
          </TabsContent>
        )}
        {showModules && (
          <TabsContent value="modules" className="h-full w-full overflow-y-auto p-4">
            <ModuleManager />
          </TabsContent>
        )}
      </Tabs>
    </LayoutWrapper>
  );
}
