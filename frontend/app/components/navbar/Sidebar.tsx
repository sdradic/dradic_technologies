import type { NavConfig } from "./types";

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
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-20 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <img
          src="/dradic_tech_logo_w_title.png"
          alt="Dradic Technologies"
          className="w-full h-14 mt-8 mb-4 object-contain"
        />
        <div className="flex flex-col p-6 space-y-4">
          {navConfig.map((item) => (
            <button
              key={item.label}
              className={`text-gray-800 text-left text-lg cursor-pointer hover:bg-primary-100 rounded-md p-2 ${
                selectedPath === item.path
                  ? "border-b-2 border-primary-600 rounded-none"
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
