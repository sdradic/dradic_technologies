import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { DesktopNav } from "./navbar/DesktopNav";
import { MobileNav } from "./navbar/MobileNav";
import { Sidebar } from "./navbar/Sidebar";
import type { NavConfig } from "./navbar/types";
import { Logo } from "./navbar/Logo";

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
    { label: "Contact", path: "/contact" },
  ];

  const handleNavClick = (item: { label: string; path: string }) => {
    navigate(item.path);
    setIsSidebarOpen(false);
  };

  return (
    <>
      <nav>
        <div className="px-4 flex justify-between items-center max-w-6xl mx-auto">
          <Logo />

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
