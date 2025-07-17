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

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

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

export function Sidebar() {
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
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  const renderNavItem = (item: NavItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.path);

    return (
      <li key={item.path}>
        <div className="relative">
          <Link
            to={item.path}
            onClick={() => {
              hasChildren && toggleExpand(item.path);
            }}
            className={`flex items-center justify-center ${
              isCollapsed ? "" : "justify-start px-4"
            } py-2 rounded-xl ${
              isActive(item.path)
                ? "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-white"
                : "hover:bg-primary-100 dark:hover:bg-gray-800"
            }`}
          >
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
          </Link>
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
  };

  return (
    <nav
      className={`h-full bg-primary-50 dark:bg-gray-900 dark:border-r-2 dark:border-gray-800 transition-all duration-300 ${
        isCollapsed ? "w-24" : "w-64"
      }`}
    >
      <div className="p-4 h-full flex flex-col">
        {/* Header */}
        <div
          className={`flex items-center mb-6 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          <div
            className={`flex items-center ${isCollapsed ? "" : "space-x-2"}`}
          >
            <TallyUpLogo
              className="w-12 h-12 stroke-primary-500 fill-primary-500 dark:stroke-primary-600 dark:fill-primary-600 cursor-pointer"
              onClick={() => setIsCollapsed(!isCollapsed)}
            />
            {!isCollapsed && (
              <>
                <h2 className="text-2xl text-gray-800 dark:text-white">
                  TallyUp
                </h2>
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="p-1 rounded-lg hover:bg-primary-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-pointer"
                >
                  <ChevronLeftIcon className="w-6 h-6 stroke-gray-600 dark:stroke-white" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="separator mb-8" />

        <h2
          className={`text-gray-500 dark:text-gray-500 px-4 mb-2 text-left ${
            isCollapsed ? "hidden" : ""
          }`}
        >
          OPERATIONS
        </h2>
        <ul
          className="space-y-2"
          onClick={() => isCollapsed && setIsCollapsed(!isCollapsed)}
        >
          {navItems.map(renderNavItem)}
        </ul>
        <div className="separator mt-8" />
        <div className="flex flex-col justify-between h-full pt-4">
          <h2
            className={`text-gray-500 dark:text-gray-500 px-4 mb-2 text-left ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            SUPPORT
          </h2>
          <div className="flex flex-col justify-between h-full">
            <ul className="space-y-2">{navOptions.map(renderNavItem)}</ul>
            <div className="md:flex hidden justify-center">
              <ThemeToggle />
            </div>
          </div>
          <div>
            <div className="separator my-4" />
            <UserProfile isCollapsed={isCollapsed} />
          </div>
        </div>
      </div>
    </nav>
  );
}
