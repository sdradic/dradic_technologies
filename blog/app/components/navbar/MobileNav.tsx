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
    <>
      <div className="flex flex-row items-center justify-end gap-2">
        <button
          className="flex md:hidden cursor-pointer"
          onClick={onToggleSidebar}
        >
          <MenuIcon
            isSidebarOpen={isSidebarOpen}
            className="w-8 h-8 stroke-gray-500 dark:stroke-gray-400"
          />
        </button>
      </div>
    </>
  );
};
