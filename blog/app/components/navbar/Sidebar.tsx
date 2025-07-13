import type { NavConfig } from "./types";
import { DradicTechLogo } from "../Icons";

interface SidebarProps {
  navConfig: NavConfig;
  selectedPath: string;
  isOpen: boolean;
  onNavClick: (item: { label: string; path: string }) => void;
  onClose: () => void;
}

export const Sidebar = ({
  navConfig,
  selectedPath,
  isOpen,
  onNavClick,
  onClose,
}: SidebarProps) => {
  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-dark-500 transform transition-transform duration-300 ease-in-out z-20 shadow-lg ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-center mt-4">
          <DradicTechLogo className="h-18 stroke-primary-500 dark:stroke-primary-500 dark:fill-dark-500" />
          <div className="flex items-center">
            <div className="h-0.5 w-8 bg-primary-500 rounded-full rotate-90" />
            <div className="flex flex-col">
              <span className="text-2xl font-semibold">Dradic</span>
              <span className="text-sm text-gray-500">Technologies</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col p-6 space-y-4">
          {navConfig.map((item) => (
            <button
              key={item.label}
              className={`text-gray-800 dark:text-gray-200 text-left text-md cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900 rounded-md p-2 ${
                selectedPath === item.path
                  ? "border-b-2 border-primary-500 dark:border-primary-500 rounded-none"
                  : ""
              }`}
              onClick={() => onNavClick(item)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 backdrop-blur-lg z-10 md:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
};
