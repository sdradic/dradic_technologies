import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { UnifiedNav } from "./UnifiedNav";
import type { NavConfig, NavItem } from "~/modules/types";
import { Logo } from "./Logo";
import { SearchIcon } from "./Icons";
import { ThemeToggle } from "./ThemeToggle";
import { SearchModal } from "./SearchModal";

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPath = location.pathname;
  const [isBlog, setIsBlog] = useState(false);
  const navConfig: NavConfig = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    {
      label: "Blog",
      path: "/blog",
    },
    {
      label: "Contact",
      path: "/contact",
    },
    {
      label: "Portfolio",
      path: "/portfolio",
      children: [
        { label: "Apps", path: "/portfolio/" },
        { label: "Projects", path: "/portfolio/projects" },
      ],
    },
  ];

  const handleNavClick = (item: NavItem) => {
    navigate(item.path);
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    setIsBlog(location.pathname.startsWith("/blog"));
  }, [location.pathname]);

  return (
    <>
      <nav className="flex flex-row items-center justify-between w-full px-4 max-w-6xl mx-auto">
        <Logo />
        <div className="flex justify-end items-center gap-2">
          <UnifiedNav
            navConfig={navConfig}
            selectedPath={selectedPath}
            onNavClick={handleNavClick}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          <ThemeToggle />
          {isBlog && (
            <div
              className="cursor-pointer rounded-xl p-2"
              onClick={() => setIsSearchModalOpen(!isSearchModalOpen)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setIsSearchModalOpen(!isSearchModalOpen);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="Open search modal"
            >
              <SearchIcon className="size-5 stroke-gray-500 dark:stroke-white hover:stroke-primary-500 dark:hover:stroke-primary-500" />
            </div>
          )}
        </div>
      </nav>

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </>
  );
}
