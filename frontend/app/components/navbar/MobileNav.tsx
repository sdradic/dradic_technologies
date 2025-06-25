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
    <button className="md:hidden cursor-pointer" onClick={onToggleSidebar}>
      <MenuIcon
        isSidebarOpen={isSidebarOpen}
        className="w-8 h-8 stroke-primary-600"
      />
    </button>
  );
};
