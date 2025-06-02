import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { DesktopNav } from "./navbar/DesktopNav";
import { MobileNav } from "./navbar/MobileNav";
import { Sidebar } from "./navbar/Sidebar";
import { Logo } from "./navbar/Logo";
import type { NavConfig } from "./navbar/types";

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPath = location.pathname;

  const navConfig: NavConfig = [
    { label: "Home", path: "/" },
    { label: "Projects", path: "/projects" },
    { label: "Blog", path: "/blog" },
    { label: "About", path: "/about" },
  ];

  const handleNavClick = (item: { label: string; path: string }) => {
    navigate(item.path);
    setIsSidebarOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full nav-background z-10">
        <div className="max-w-6xl max-h-18 mx-auto px-4 mt-2 py-1 flex justify-between items-center">
          <Logo className="w-auto" />

          <DesktopNav
            navConfig={navConfig}
            selectedPath={selectedPath}
            onNavClick={handleNavClick}
          />

          <MobileNav
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
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
