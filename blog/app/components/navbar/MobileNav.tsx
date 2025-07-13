import { MenuIcon, SearchIcon } from "../Icons";
import { ThemeToggle } from "../ThemeToggle";

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
        <ThemeToggle />
        <div
          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl p-2"
          onClick={() => {}}
        >
          <SearchIcon className="w-6 h-6 stroke-gray-500 dark:stroke-white" />
        </div>
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
