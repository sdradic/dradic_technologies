import { useState, useRef, useEffect } from "react";
import { MenuIcon, ChevronDownIcon, DradicTechLogo } from "./Icons";
import type { NavItem } from "~/modules/types";

interface UnifiedNavProps {
  navConfig: NavItem[];
  selectedPath: string;
  onNavClick: (item: NavItem) => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const NavButton = ({
  item,
  selectedPath,
  onNavClick,
}: {
  item: NavItem;
  selectedPath: string;
  onNavClick: (item: NavItem) => void;
}) => (
  <button
    className={`text-gray-800 dark:text-gray-200 hover:text-primary-500 dark:hover:text-primary-500 cursor-pointer gap-2 px-2 py-1 text-md rounded-md ${
      selectedPath === item.path
        ? "border-b-2 border-primary-500 dark:border-primary-500 rounded-none"
        : ""
    }`}
    onClick={() => onNavClick(item)}
  >
    {item.label}
  </button>
);

const DropdownButton = ({
  item,
  selectedPath,
  onNavClick,
}: {
  item: NavItem;
  selectedPath: string;
  onNavClick: (item: NavItem) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleItemClick = (childItem: NavItem) => {
    onNavClick(childItem);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={`flex group items-center gap-1 text-gray-800 dark:text-gray-200 hover:text-primary-500 dark:hover:text-primary-500 cursor-pointer px-2 py-1 text-md rounded-md ${
          selectedPath === item.path
            ? "border-b-2 border-primary-500 dark:border-primary-500 rounded-none"
            : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {item.label}
        <ChevronDownIcon
          className={`w-4 h-4 transition-transform stroke-2 stroke-gray-500 dark:stroke-white group-hover:stroke-primary-500 dark:group-hover:stroke-primary-500 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white dark:bg-dark-500 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 min-w-48">
          {item.children?.map((child) => (
            <button
              key={child.label}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-primary-100 dark:hover:bg-primary-900 cursor-pointer ${
                selectedPath === child.path
                  ? "bg-primary-100 dark:bg-primary-900 text-primary-500"
                  : "text-gray-800 dark:text-gray-200"
              }`}
              onClick={() => handleItemClick(child)}
            >
              {child.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const SidebarItem = ({
  item,
  selectedPath,
  onNavClick,
  level = 0,
}: {
  item: NavItem;
  selectedPath: string;
  onNavClick: (item: NavItem) => void;
  level?: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    } else {
      onNavClick(item);
    }
  };

  return (
    <div>
      <button
        className={`w-full text-left px-4 py-2 text-sm hover:bg-primary-100 dark:hover:bg-primary-900 flex items-center justify-between cursor-pointer ${
          selectedPath === item.path
            ? "bg-primary-100 dark:bg-primary-900 text-primary-500"
            : "text-gray-800 dark:text-gray-200"
        } ${level > 0 ? "pl-8" : ""}`}
        onClick={handleClick}
      >
        <span>{item.label}</span>
        {hasChildren && (
          <ChevronDownIcon
            className={`w-4 h-4 transition-transform stroke-2 stroke-gray-500 dark:stroke-white ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {hasChildren && isExpanded && (
        <div className="bg-gray-50 dark:bg-dark-600">
          {item.children?.map((child) => (
            <SidebarItem
              key={child.label}
              item={child}
              selectedPath={selectedPath}
              onNavClick={onNavClick}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const UnifiedNav = ({
  navConfig,
  selectedPath,
  onNavClick,
  isSidebarOpen,
  onToggleSidebar,
}: UnifiedNavProps) => {
  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-4">
        {navConfig.map((item) => (
          <div key={item.label}>
            {item.children && item.children.length > 0 ? (
              <DropdownButton
                item={item}
                selectedPath={selectedPath}
                onNavClick={onNavClick}
              />
            ) : (
              <NavButton
                item={item}
                selectedPath={selectedPath}
                onNavClick={onNavClick}
              />
            )}
          </div>
        ))}
      </div>

      {/* Mobile Navigation Button */}
      <div className="flex md:hidden">
        <button className="cursor-pointer" onClick={onToggleSidebar}>
          <MenuIcon
            isSidebarOpen={isSidebarOpen}
            className="w-8 h-8 stroke-1 stroke-gray-500 dark:stroke-white"
          />
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-dark-500 transform transition-transform duration-300 ease-in-out z-20 shadow-lg md:hidden ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-center mt-4">
          <DradicTechLogo className="h-18 stroke-4 stroke-primary-500 dark:stroke-primary-500 dark:fill-dark-500" />
          <div className="flex items-center">
            <div className="h-0.5 w-8 bg-primary-500 rounded-full rotate-90" />
            <div className="flex flex-col">
              <span className="text-2xl font-semibold">Dradic</span>
              <span className="text-sm text-gray-500">Technologies</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col p-6 space-y-2">
          {navConfig.map((item) => (
            <SidebarItem
              key={item.label}
              item={item}
              selectedPath={selectedPath}
              onNavClick={onNavClick}
            />
          ))}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-lg z-10 md:hidden"
          onClick={onToggleSidebar}
        />
      )}
    </>
  );
};
