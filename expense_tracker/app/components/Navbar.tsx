import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Sidebar } from "./Sidebar";
import { TallyUpLogo, MenuIcon } from "./Icons";
import { useNavigate } from "react-router";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      {/* Top Navbar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <TallyUpLogo className="w-10 h-10 stroke-primary-500 fill-primary-500 dark:stroke-primary-600 dark:fill-primary-600" />
              <h1 className="text-2xl text-gray-800 dark:text-white">
                TallyUp
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <MenuIcon className="w-6 h-6 stroke-gray-600 dark:stroke-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu using Sidebar */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <Sidebar />
        </div>
      )}
    </>
  );
}
