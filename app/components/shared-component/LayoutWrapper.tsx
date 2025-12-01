import type { ReactNode } from "react";
import type { HeaderProps } from "./Header";
import Header from "./Header";
import { cn } from "~/lib/utils";
import Tab from "./Tab";

function LayoutWrapper({
  children,
  showHeader = true,
  showTab = true,
  headerConfigs,
  className,
}: {
  children: ReactNode;
  showHeader?: boolean;
  showTab?: boolean;
  headerConfigs?: HeaderProps;
  className?: string;
}) {
  return (
    <div className="h-dvh w-full flex flex-col overflow-hidden">
      {/* Header */}
      {showHeader && headerConfigs && (
        <div className="sticky top-0 z-10 flex-shrink-0">
          <Header
            title={headerConfigs.title}
            iconName={headerConfigs.iconName}
            href={headerConfigs.href}
          >
            {headerConfigs.children}
          </Header>
        </div>
      )}

      <div
        className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden",
          showTab ? "mb-16" : "",
          className
        )}
      >
        {children}
      </div>

      {/* Bottom Tab Bar - Fixed positioning - Always at bottom when showTab is true */}
      {showTab && (
        <div className="fixed bottom-0 left-0 right-0 z-20 w-full">
          <Tab />
        </div>
      )}
    </div>
  );
}

export default LayoutWrapper;
