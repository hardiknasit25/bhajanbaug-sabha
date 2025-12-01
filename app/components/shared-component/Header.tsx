import * as LucideIcons from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

export interface HeaderProps {
  iconName?: keyof typeof LucideIcons;
  title: string;
  children?: ReactNode;
  href?: string;
}

function Header({ iconName = "Menu", title, children, href }: HeaderProps) {
  const IconComponent = LucideIcons[iconName] as React.ComponentType<any>;

  // Icon element (wrapped in Link if href exists)
  const IconElement = href ? (
    <Link to={href}>
      <IconComponent size={16} />
    </Link>
  ) : (
    <IconComponent size={16} />
  );

  return (
    <div className="w-full bg-primaryColor h-12 flex justify-between items-center text-white p-2 px-3 z-40">
      <div className="flex justify-start items-center gap-2">
        {IconElement}
        <span className="uppercase text-sm">{title}</span>
      </div>

      {children && <div>{children}</div>}
    </div>
  );
}

export default Header;
