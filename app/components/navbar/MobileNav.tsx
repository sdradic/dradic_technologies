import { MenuIcon } from "../Icons";

interface MobileNavProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const MobileNav = ({
  isSidebarOpen,
  onToggleSidebar,
}: MobileNavProps) => {
  return (
    <button
      className="md:hidden text-gray-800 cursor-pointer"
      onClick={onToggleSidebar}
    >
      <MenuIcon isSidebarOpen={isSidebarOpen} className="w-6 h-6" />
    </button>
  );
};
