import * as LucideIcons from "lucide-react";
import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router";
import { cn } from "~/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import Sidebar from "./Sidebar";

export interface HeaderProps {
  className?: string;
  iconName?: keyof typeof LucideIcons;
  title: string;
  children?: ReactNode;
  href?: string;
  description?: string;
  showSearch?: boolean;
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  showSorting?: boolean;
}

function Header({
  className,
  iconName = "Menu",
  title,
  children,
  href,
  description,
  showSearch,
  searchValue,
  searchPlaceholder,
  onSearchChange,
  showSorting,
}: HeaderProps) {
  const navigate = useNavigate();
  const IconComponent = LucideIcons[iconName] as React.ComponentType<any>;

  const handleIconClick = () => {
    if (href) {
      // normal navigation handled by Link
      return;
    }
    navigate(-1); // go back
  };

  // Icon element (wrapped in Link if href exists)
  const IconElement = href ? (
    <Link to={href}>
      <IconComponent size={20} />
    </Link>
  ) : iconName ? (
    <IconComponent size={20} onClick={handleIconClick} />
  ) : (
    <Sheet>
      <SheetTrigger asChild>
        <IconComponent size={20} />
      </SheetTrigger>
      <SheetContent side={"left"} showCloseIcon={false} className="p-0">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );

  return (
    <div
      className={cn(
        "w-full bg-primaryColor min-h-14 flex justify-between items-center text-white py-2 px-2 z-40",
        className
      )}
    >
      <div className="w-full flex justify-between items-center">
        <div className="flex-1 flex justify-start items-center gap-3">
          {IconElement}
          <div className="flex-1 flex flex-col justify-start items-start">
            <span className="uppercase text-base font-medium font-poppins">
              {title}
            </span>
            {description && (
              <span className="w-full text-xs text-white/70 font-normal font-poppins">
                {description}
              </span>
            )}
          </div>
        </div>

        {children && <div>{children}</div>}
      </div>

      {showSearch && onSearchChange && (
        <div className="w-full flex justify-start items-start gap-2">
          <div className="relative w-full h-10 bg-white rounded-full flex justify-start items-center gap-2 p-2 mb-1">
            <LucideIcons.Search size={20} className="text-textLightColor" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-transparent placeholder:text-textLightColor text-textColor outline-none"
              placeholder={searchPlaceholder || "Search member..."}
            />
            {searchValue && (
              <LucideIcons.X
                size={20}
                onClick={() => onSearchChange("")}
                className="text-textLightColor absolute right-3 cursor-pointer"
              />
            )}
          </div>
          {showSorting && (
            <div className="flex h-10 px-4 rounded-full justify-center items-center gap-2 border border-white">
              <LucideIcons.ListFilter size={16} />
              <span className="uppercase text-sm">sort</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Header;
