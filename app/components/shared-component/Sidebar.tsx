import { KeyRound, LogOut, ShieldCheck, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AUTH_TOKEN } from "~/constant/constant";
import { useMyPermissions } from "~/hooks/usePermissions";
import sessionStorageService from "~/lib/sessionStorage";
import { authService } from "~/services/authService";
import { cn } from "~/lib/utils";
import type { UserProfile } from "~/types/auth.interface";
import { deleteCookie } from "~/utils/cookie";
import { SheetClose } from "../ui/sheet";

function Sidebar() {
  const navigate = useNavigate();
  const { can } = useMyPermissions();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Load the logged-in user's profile for the drawer header.
  useEffect(() => {
    let active = true;
    authService
      .getMe()
      .then((res) => {
        if (active) setProfile(res?.data ?? null);
      })
      .catch(() => {
        if (active) setProfile(null);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleLogOut = () => {
    deleteCookie(AUTH_TOKEN);
    sessionStorageService.removeItem(AUTH_TOKEN);
    navigate("/login");
  };

  // Gated management links (only shown when the user can read that module).
  const managementItems = [
    {
      key: "role",
      label: "User Role",
      icon: ShieldCheck,
      onClick: () => navigate("/role"),
      visible: can("role", "read"),
    },
    {
      key: "permission",
      label: "User Permission",
      icon: KeyRound,
      onClick: () => navigate("/permission"),
      visible: can("permission", "read"),
    },
  ].filter((item) => item.visible);

  return (
    <div className="flex h-full w-full flex-col items-center justify-start">
      <div className="flex w-full flex-col items-center justify-start gap-4 border-b border-borderColor py-5">
        <img
          src="/images/avatar-placeholder.png"
          alt=""
          className="size-36 rounded-full border-[4px] border-blue-400"
        />
        <div className="flex flex-col items-center justify-center gap-1">
          <span className="font-poppins text-lg font-medium uppercase text-textColor">
            {profile?.name || "—"}
          </span>
          <span className="text-textLightColor">
            SMK Id: {profile?.smk_no || "—"}
          </span>
        </div>
      </div>

      <div className="flex w-full flex-col items-start justify-start gap-1 p-6">
        {/* Profile */}
        <SheetClose asChild>
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-2 py-3 text-textColor transition-colors hover:bg-gray-100"
          >
            <User size={20} className="text-textLightColor" />
            <span className="text-lg font-light uppercase">profile</span>
          </button>
        </SheetClose>

        {/* Log out */}
        <SheetClose asChild>
          <button
            type="button"
            onClick={handleLogOut}
            className="flex w-full items-center gap-3 rounded-lg px-2 py-3 text-textColor transition-colors hover:bg-gray-100"
          >
            <LogOut size={20} className="text-textLightColor" />
            <span className="text-lg font-light uppercase">log out</span>
          </button>
        </SheetClose>

        {/* Management (role / permission) — below profile & logout, gated by access */}
        {managementItems.length > 0 && (
          <>
            <div className="my-3 w-full border-t border-borderColor" />
            <span className="px-2 pb-1 text-xs font-medium uppercase tracking-wider text-textLightColor">
              Management
            </span>
            {managementItems.map((item) => {
              const Icon = item.icon;
              return (
                <SheetClose asChild key={item.key}>
                  <button
                    type="button"
                    onClick={item.onClick}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-2 py-3 text-textColor transition-colors hover:bg-gray-100"
                    )}
                  >
                    <Icon size={20} className="text-textLightColor" />
                    <span className="text-lg font-light uppercase">
                      {item.label}
                    </span>
                  </button>
                </SheetClose>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
