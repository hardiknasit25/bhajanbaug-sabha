import { Component } from "react";
import { Link, useLocation } from "react-router";
import { tabsConfig } from "~/config/tabs.config";
import type { TabItem } from "~/types/tab.interface";
import { useMyPermissions } from "~/hooks/usePermissions";

class Tab extends Component {
  render() {
    return <TabRenderer />;
  }
}

function TabRenderer() {
  const location = useLocation();
  const { can, hasModule, myLoaded } = useMyPermissions();

  // Each tab maps to a permission module. A tab is hidden ONLY when its module
  // is defined for the user AND read access is denied. We stay permissive while
  // the map loads, and "fail open" for modules that aren't configured yet (e.g.
  // a brand-new tab module the admin hasn't created), so the nav never breaks.
  const visibleTabs = tabsConfig.filter((tab: TabItem) => {
    if (tab.show === false) return false;
    if (!tab.moduleKey) return true;
    if (!myLoaded) return true;
    const action = tab.action ?? "read";
    // Strict tabs require explicit access (module exists on the backend).
    if (tab.strict) return can(tab.moduleKey, action);
    // Otherwise fail open: only hide once the module is defined AND denied.
    if (!hasModule(tab.moduleKey)) return true;
    return can(tab.moduleKey, action);
  });

  return (
    <div className="h-16 w-full flex justify-around items-center bg-primaryColor shadow-lg">
      {visibleTabs.map((tab: TabItem) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;

          return (
            <Link
              key={tab.id}
              to={tab.path}
              className={`flex flex-col items-center gap-1 ${
                isActive ? "text-selectionColor" : "text-white"
              }`}
            >
              <Icon size={22} strokeWidth={2} />
              <span className="text-[9px] uppercase">{tab.label}</span>
            </Link>
          );
        })}
    </div>
  );
}

export default Tab;
