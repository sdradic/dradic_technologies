import { Link, useLocation } from "react-router";
import { useState } from "react";
import { UserProfile } from "./UserProfile";
import {
  TallyUpLogo,
  AboutIcon,
  SettingsIcon,
  ExpensesIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  LogoutIcon,
  IncomesIcon,
  DashboardIconOutline,
} from "./Icons";
import { ThemeToggle } from "./ThemeToggle";

// Types
interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

// Navigation Data
const navItems: NavItem[] = [
  {
    path: "/",
    label: "Dashboard",
    icon: (
      <DashboardIconOutline className="w-6 h-6 stroke-gray-600 dark:stroke-white" />
    ),
  },
  {
    path: "/incomes",
    label: "Incomes",
    icon: <IncomesIcon className="w-6 h-6 stroke-gray-600 dark:stroke-white" />,
  },
  {
    path: "/expenses",
    label: "Expenses",
    icon: (
      <ExpensesIcon className="w-6 h-6 stroke-gray-600 dark:stroke-white" />
    ),
  },
];

const navOptions: NavItem[] = [
  {
    path: "/settings",
    label: "Settings",
    icon: (
      <SettingsIcon className="w-6 h-6 stroke-gray-600 dark:stroke-white" />
    ),
  },
  {
    path: "/about",
    label: "About",
    icon: <AboutIcon className="w-6 h-6 stroke-gray-600 dark:stroke-white" />,
  },
  {
    path: "/logout",
    label: "Logout",
    icon: (
      <LogoutIcon className="w-6 h-6 stroke-gray-600 dark:stroke-white fill-gray-600 dark:fill-white" />
    ),
  },
];

// Custom Hooks
function useSidebarState() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const location = useLocation();

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const toggleExpand = (path: string) => {
    setExpandedItems((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path],
    );
  };

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return {
    isCollapsed,
    expandedItems,
    isActive,
    toggleExpand,
    toggleCollapse,
  };
}

// Sub-components
interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

function SidebarHeader({ isCollapsed, onToggleCollapse }: SidebarHeaderProps) {
  return (
    <div
      className={`flex items-center mb-6 ${
        isCollapsed ? "justify-center" : "justify-between"
      }`}
    >
      <div className={`flex items-center ${isCollapsed ? "" : "space-x-2"}`}>
        <TallyUpLogo
          className="w-12 h-12 stroke-primary-500 fill-primary-500 dark:stroke-primary-600 dark:fill-primary-600 cursor-pointer"
          onClick={onToggleCollapse}
        />
        {!isCollapsed && (
          <>
            <h2 className="text-2xl text-gray-800 dark:text-white">TallyUp</h2>
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded-lg hover:bg-primary-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-pointer"
            >
              <ChevronLeftIcon className="w-6 h-6 stroke-gray-600 dark:stroke-white" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

interface NavLinkProps {
  item: NavItem;
  isCollapsed: boolean;
  isActive: boolean;
  hasChildren: boolean;
  isExpanded: boolean;
  onToggleExpand: (path: string) => void;
}

function NavLink({
  item,
  isCollapsed,
  isActive,
  hasChildren,
  isExpanded,
  onToggleExpand,
}: NavLinkProps) {
  const handleClick = () => {
    if (hasChildren) {
      onToggleExpand(item.path);
    }
  };

  const NavLinkContent = (
    <div className="flex items-center w-full">
      <span className={`text-xl ${isCollapsed ? "" : "mr-3"}`}>
        {item.icon}
      </span>
      {!isCollapsed && (
        <>
          <span>{item.label}</span>
          {hasChildren && (
            <span className="ml-auto text-gray-500 dark:text-gray-400">
              {isExpanded ? (
                <ChevronDownIcon className="w-4 h-4 stroke-gray-600 dark:stroke-white" />
              ) : (
                <ChevronRightIcon className="w-4 h-4 stroke-gray-600 dark:stroke-white" />
              )}
            </span>
          )}
        </>
      )}
    </div>
  );

  return (
    <Link
      to={item.path}
      onClick={handleClick}
      className={`flex items-center transition-colors px-4 ${
        isActive
          ? "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-white"
          : "hover:bg-primary-100 dark:hover:bg-gray-800"
      } py-2 rounded-xl relative`}
    >
      {isCollapsed ? (
        <div className="group relative flex items-center w-full">
          {NavLinkContent}
          <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 whitespace-nowrap rounded bg-gray-800 text-white text-sm px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-100">
            {item.label}
          </span>
        </div>
      ) : (
        NavLinkContent
      )}
    </Link>
  );
}

interface NavItemComponentProps {
  item: NavItem;
  isCollapsed: boolean;
  isActive: (path: string) => boolean;
  expandedItems: string[];
  onToggleExpand: (path: string) => void;
}

function NavItemComponent({
  item,
  isCollapsed,
  isActive,
  expandedItems,
  onToggleExpand,
}: NavItemComponentProps) {
  const hasChildren = Boolean(item.children && item.children.length > 0);
  const isExpanded = expandedItems.includes(item.path);
  const active = isActive(item.path);

  return (
    <li key={item.path}>
      <div>
        <NavLink
          item={item}
          isCollapsed={isCollapsed}
          isActive={active}
          hasChildren={hasChildren}
          isExpanded={isExpanded}
          onToggleExpand={onToggleExpand}
        />
        {hasChildren && !isCollapsed && isExpanded && item.children && (
          <ul className="ml-8 mt-1 space-y-1">
            {item.children.map((child) => (
              <li key={child.path}>
                <Link
                  to={child.path}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    isActive(child.path)
                      ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-200"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <span className={`text-xl ${isCollapsed ? "" : "mr-3"}`}>
                    {child.icon}
                  </span>
                  <span>{child.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

interface NavigationSectionProps {
  title: string;
  items: NavItem[];
  isCollapsed: boolean;
  isActive: (path: string) => boolean;
  expandedItems: string[];
  onToggleExpand: (path: string) => void;
  onCollapseToggle?: () => void;
}

function NavigationSection({
  title,
  items,
  isCollapsed,
  isActive,
  expandedItems,
  onToggleExpand,
  onCollapseToggle,
}: NavigationSectionProps) {
  return (
    <>
      <h2
        className={`text-gray-500 dark:text-gray-500 px-4 mb-2 text-left ${
          isCollapsed ? "hidden" : ""
        }`}
      >
        {title}
      </h2>
      <ul
        className="space-y-2"
        onClick={() => {
          if (isCollapsed && onCollapseToggle) {
            onCollapseToggle();
          }
        }}
      >
        {items.map((item) => (
          <NavItemComponent
            key={item.path}
            item={item}
            isCollapsed={isCollapsed}
            isActive={isActive}
            expandedItems={expandedItems}
            onToggleExpand={onToggleExpand}
          />
        ))}
      </ul>
    </>
  );
}
// Main Component
export function Sidebar() {
  const { isCollapsed, expandedItems, isActive, toggleExpand, toggleCollapse } =
    useSidebarState();

  return (
    <nav
      className={`h-full bg-primary-50 dark:bg-gray-900 dark:border-r-2 dark:border-gray-800 transition-all duration-300 ${
        isCollapsed ? "w-24" : "w-64"
      }`}
    >
      <div className="p-4 h-full flex flex-col">
        <SidebarHeader
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
        />

        <div className="separator mb-8" />

        <NavigationSection
          title="OPERATIONS"
          items={navItems}
          isCollapsed={isCollapsed}
          isActive={isActive}
          expandedItems={expandedItems}
          onToggleExpand={toggleExpand}
          onCollapseToggle={toggleCollapse}
        />

        <div className="separator mt-8" />

        <div className="flex flex-col h-full pt-4">
          <NavigationSection
            title="SUPPORT"
            items={navOptions}
            isCollapsed={isCollapsed}
            isActive={isActive}
            expandedItems={[]}
            onToggleExpand={() => {}}
          />
          <div className="flex flex-col justify-end items-center h-full pt-4">
            <ThemeToggle />
            <div className="separator my-4" />
          </div>
          <UserProfile isCollapsed={isCollapsed} />
        </div>
      </div>
    </nav>
  );
}
