import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { DesktopNav, MobileMenuButton, MobileSidebar } from "./UnifiedNav";
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
  const [isScrolled, setIsScrolled] = useState(() =>
    typeof window !== "undefined" ? window.scrollY > 10 : false,
  );
  const navConfig: NavConfig = [
    { label: "Home", path: "/#home" },
    { label: "Services", path: "/#services" },
    { label: "About", path: "/#about" },
    { label: "Insights", path: "/#insights" },
    { label: "Contact", path: "/#contact" },
    {
      label: "Blog",
      path: "/blog",
    },
  ];

  const handleNavClick = (item: NavItem) => {
    if (item.path.startsWith("/#")) {
      const sectionId = item.path.substring(2);
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          document
            .getElementById(sectionId)
            ?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(item.path);
    }
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    setIsBlog(location.pathname.startsWith("/blog"));
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 z-30 w-full ${isScrolled ? "glass shadow-sm" : "bg-transparent"}`}
        id="navbar"
      >
        <div
          className={`max-w-7xl mx-auto px-6 flex flex-row items-center justify-between ${isScrolled ? "py-3" : "py-5"}`}
        >
          <Logo />
          <div className="flex justify-end items-center gap-2">
            <DesktopNav
              navConfig={navConfig}
              selectedPath={selectedPath}
              onNavClick={handleNavClick}
            />
            <MobileMenuButton
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
        </div>
      </nav>

      <MobileSidebar
        navConfig={navConfig}
        selectedPath={selectedPath}
        onNavClick={handleNavClick}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </>
  );
}
