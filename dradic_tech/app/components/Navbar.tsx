import { useEffect, useState, useLayoutEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );
  const [isScrolled, setIsScrolled] = useState(() =>
    typeof window !== "undefined" ? window.scrollY > 10 : false,
  );
  const [enableTransition, setEnableTransition] = useState(false);
  const navConfig: NavConfig = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    {
      label: "Blog",
      path: "/blog",
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

  useLayoutEffect(() => {
    // Establish initial layout state before first paint to avoid transition flicker
    setIsMobile(window.innerWidth < 768);
    setIsScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", checkIsMobile);
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Enable transitions only after initial mount to prevent on-load animations
    setEnableTransition(true);
  }, []);

  return (
    <>
      {/*
        On scroll: fixed, centered, blurred, rounded, max-w-3xl.
        At top: full width, at top, no blur, no rounding.
      */}
      <nav
        className={`${enableTransition && !isMobile ? "transition-all duration-300" : ""}
          ${
            !isMobile
              ? isScrolled
                ? "fixed top-6 left-1/2 z-30 -translate-x-1/2 flex flex-row items-center justify-between w-full max-w-3xl px-4 rounded-2xl bg-white/70 dark:bg-dark-500/70 backdrop-blur-md shadow-lg"
                : "relative top-0 left-1/2 -translate-x-1/2 flex flex-row items-center justify-between w-full max-w-4xl sm:max-w-6xl px-4 bg-transparent"
              : "flex flex-row items-center justify-between w-full px-4 max-w-6xl mx-auto"
          }
        `}
        id="navbar"
      >
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
