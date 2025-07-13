import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { DesktopNav } from "./navbar/DesktopNav";
import { MobileNav } from "./navbar/MobileNav";
import { Sidebar } from "./navbar/Sidebar";
import type { NavConfig } from "./navbar/types";
import { Logo } from "./navbar/Logo";
import { SearchIcon } from "./Icons";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPath = location.pathname;

  const navConfig: NavConfig = [
    { label: "Blog", path: "/blog" },
    { label: "About", path: "/about" },
  ];

  const handleNavClick = (item: { label: string; path: string }) => {
    navigate(item.path);
    setIsSidebarOpen(false);
  };

  return (
    <>
      <nav className="flex flex-row items-center justify-between w-full px-4 max-w-6xl mx-auto">
        <Logo />
        <div className="flex justify-end items-center gap-2">
          <DesktopNav
            navConfig={navConfig}
            selectedPath={selectedPath}
            onNavClick={handleNavClick}
          />

          <ThemeToggle />
          <div className="cursor-pointer rounded-xl p-2" onClick={() => {}}>
            <SearchIcon className="w-6 h-6 stroke-gray-500 dark:stroke-white hover:stroke-primary-500 dark:hover:stroke-primary-500" />
          </div>
          <MobileNav
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          <button className="sm:flex hidden bg-primary-500 dark:bg-primary-600 text-white cursor-pointer gap-2 px-4 py-2 text-sm rounded-full hover:bg-primary-600 dark:hover:bg-primary-500">
            Subscribe
          </button>
        </div>
      </nav>

      <Sidebar
        navConfig={navConfig}
        selectedPath={selectedPath}
        isOpen={isSidebarOpen}
        onNavClick={handleNavClick}
        onClose={() => setIsSidebarOpen(false)}
      />
    </>
  );
}
