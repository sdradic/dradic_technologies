import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "~/contexts/AuthContext";
import {
  TallyUpLogo,
  DashboardIconOutline,
  ExpensesIcon,
  IncomesIcon,
  SettingsIcon,
  GroupsIcon,
  ContactIcon,
  LogoutIcon,
  MenuIcon,
} from "./Icons";
import { ThemeToggle } from "./ThemeToggle";

interface NavLinkProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick?: () => void;
}

const NavLink = ({ to, label, icon, active, onClick }: NavLinkProps) => {
  const isCollapsed = !label;
  return (
    <Link
      to={to}
      onClick={onClick}
      title={isCollapsed ? to.replace("/", "") || "Dashboard" : undefined}
      className={`flex items-center rounded-2xl transition-all font-semibold text-sm tracking-tight cursor-pointer ${
        isCollapsed ? "justify-center p-3" : "space-x-2 px-5 py-2.5"
      } ${
        active
          ? "bg-primary-500 text-white shadow-lg shadow-primary-200 dark:shadow-none"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
    >
      <span className={active ? "text-white" : ""}>{icon}</span>
      {label && <span>{label}</span>}
    </Link>
  );
};

interface MobileSidebarLinkProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

const MobileSidebarLink = ({
  to,
  label,
  icon,
  active,
  onClick,
}: MobileSidebarLinkProps) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center space-x-4 p-5 rounded-3xl transition-all cursor-pointer ${
      active
        ? "bg-primary-500 text-white shadow-xl shadow-primary-200 dark:shadow-none"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
    }`}
  >
    <span
      className={
        active ? "text-white" : "text-primary-500 dark:text-primary-400"
      }
    >
      {icon}
    </span>
    <span className="text-xl font-bold tracking-tight">{label}</span>
  </Link>
);

const iconClass = "w-5 h-5";

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const navItems = [
    {
      to: "/",
      label: "Dashboard",
      icon: (
        <DashboardIconOutline
          className={iconClass}
          stroke="currentColor"
          strokeWidth="1.5"
        />
      ),
    },
    {
      to: "/expenses",
      label: "Expenses",
      icon: (
        <ExpensesIcon
          className={iconClass}
          stroke="currentColor"
          strokeWidth="1.5"
        />
      ),
    },
    {
      to: "/incomes",
      label: "Incomes",
      icon: (
        <IncomesIcon
          className={iconClass}
          stroke="currentColor"
          strokeWidth="1.5"
        />
      ),
    },
    {
      to: "/settings",
      label: "Settings",
      icon: (
        <SettingsIcon
          className={iconClass}
          stroke="currentColor"
          strokeWidth="1.5"
        />
      ),
    },
    {
      to: "/groups",
      label: "Groups",
      icon: (
        <GroupsIcon
          className={iconClass}
          stroke="currentColor"
          strokeWidth="1.5"
        />
      ),
    },
    {
      to: "/contact",
      label: "Contact",
      icon: (
        <ContactIcon
          className={iconClass}
          stroke="currentColor"
          strokeWidth="1.5"
        />
      ),
    },
  ];

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const sidebarWidthClass = isSidebarCollapsed ? "md:w-20" : "md:w-64";
  const mainMarginClass = isSidebarCollapsed ? "md:ml-20" : "md:ml-64";
  const headerLeftClass = isSidebarCollapsed ? "md:left-20" : "md:left-64";

  const sidebarContent = (
    <div
      className={`p-4 flex flex-col h-full transition-all duration-300 ${
        isSidebarCollapsed ? "px-3" : "px-6"
      }`}
    >
      <button
        type="button"
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className={`flex items-center mb-6 cursor-pointer group shrink-0 ${
          isSidebarCollapsed ? "justify-center w-full" : "space-x-3"
        }`}
        title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <div className="w-10 h-10 bg-primary-500 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-200 dark:shadow-none transition-transform group-hover:scale-105 group-active:scale-95 shrink-0">
          <TallyUpLogo className="w-6 h-6 stroke-white fill-white" />
        </div>
        {!isSidebarCollapsed && (
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tighter whitespace-nowrap overflow-hidden text-left">
            Tally<span className="text-primary-500">Up</span>
          </h1>
        )}
      </button>

      <nav className="flex-1 space-y-2 overflow-hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            label={isSidebarCollapsed ? "" : item.label}
            icon={item.icon}
            active={isActive(item.to)}
          />
        ))}
      </nav>

      <div className="pt-4 mt-auto border-t border-gray-200 dark:border-gray-800">
        <Link
          to="/logout"
          className={`flex items-center rounded-2xl transition-all font-semibold text-sm tracking-tight cursor-pointer ${
            isSidebarCollapsed ? "justify-center p-3" : "space-x-2 px-5 py-2.5"
          } ${
            location.pathname === "/logout"
              ? "bg-primary-500 text-white"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
          title="Logout"
        >
          <LogoutIcon className={`${iconClass} shrink-0`} />
          {!isSidebarCollapsed && <span>Logout</span>}
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex">
      {/* Desktop sidebar - toggleable on md and above */}
      <aside
        className={`hidden md:flex md:flex-col md:fixed md:top-0 md:left-0 md:bottom-0 md:z-50 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${sidebarWidthClass}`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile header + main content area */}
      <div className={`flex-1 flex flex-col min-w-0 ${mainMarginClass}`}>
        <header
          className={`fixed top-0 left-0 right-0 h-20 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 z-[60] transition-all duration-300 ${headerLeftClass}`}
        >
          <div className="px-4 md:px-6 lg:px-8 h-full flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all active:scale-95 cursor-pointer"
                aria-label="Open navigation menu"
              >
                <MenuIcon className="w-6 h-6 stroke-gray-600 dark:stroke-gray-400" />
              </button>

              <Link
                to="/"
                className="flex items-center space-x-3 group md:hidden"
              >
                <div className="w-10 h-10 bg-primary-500 rounded-2xl flex items-center justify-center">
                  <TallyUpLogo className="w-6 h-6 stroke-white fill-white" />
                </div>
                <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tighter">
                  TallyUp
                </h1>
              </Link>
              <div className="hidden md:block">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  TallyUp
                </h1>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Expense tracking
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {user && (
                <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-gray-800">
                  <div className="w-10 h-10 rounded-3xl bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center font-bold text-primary-600 dark:text-primary-400 text-sm">
                    {user.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="hidden lg:block leading-none">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {user.name?.split(" ")[0] || "User"}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                      {user.email}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-md z-[70] md:hidden cursor-pointer"
            onClick={() => setIsMobileMenuOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setIsMobileMenuOpen(false)}
            role="button"
            tabIndex={0}
            aria-label="Close menu"
          />
        )}

        {/* Mobile slide-in sidebar */}
        <aside
          className={`fixed top-0 left-0 bottom-0 w-[85%] max-w-[340px] bg-white dark:bg-gray-900 z-[80] md:hidden transform transition-all duration-500 ease-in-out shadow-2xl overflow-hidden rounded-r-[40px] ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-8 flex flex-col h-full">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-500 rounded-2xl flex items-center justify-center">
                  <TallyUpLogo className="w-6 h-6 stroke-white fill-white" />
                </div>
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tighter">
                  TallyUp
                </h1>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <nav className="flex-1 space-y-3">
              {navItems.map((item) => (
                <MobileSidebarLink
                  key={item.to}
                  to={item.to}
                  label={item.label}
                  icon={item.icon}
                  active={isActive(item.to)}
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              ))}
            </nav>

            <div className="pt-8 mt-auto border-t border-gray-100 dark:border-gray-800">
              <MobileSidebarLink
                to="/logout"
                label="Logout"
                icon={<LogoutIcon className={iconClass} />}
                active={location.pathname === "/logout"}
                onClick={() => setIsMobileMenuOpen(false)}
              />
            </div>
          </div>
        </aside>

        <main className="pt-24 pb-12 px-4 md:px-6 lg:px-8 flex-1 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
