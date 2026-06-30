import type { ReactNode } from "react";
import { useMyPermissions } from "~/hooks/usePermissions";
import type { CanAction } from "~/types/permission.interface";

interface CanProps {
  // The module key as returned by GET /permission/my (e.g. "user", "role").
  module: string;
  // Which action to check. Defaults to "read".
  action?: CanAction;
  children: ReactNode;
  // Rendered when the user is NOT allowed (defaults to nothing).
  fallback?: ReactNode;
}

/**
 * Declarative permission gate. Renders `children` only when the logged-in user
 * is allowed to perform `action` on `module`, otherwise renders `fallback`.
 * Self-loads the permission map, so it works anywhere.
 *
 *   <Can module="user" action="create">
 *     <AddMemberButton />
 *   </Can>
 */
export default function Can({
  module,
  action = "read",
  children,
  fallback = null,
}: CanProps) {
  const { can } = useMyPermissions();
  return <>{can(module, action) ? children : fallback}</>;
}
