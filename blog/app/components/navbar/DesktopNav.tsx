import type { NavItem } from "./types";

interface DesktopNavProps {
  navConfig: NavItem[];
  selectedPath: string;
  onNavClick: (item: NavItem) => void;
}

const NavButton = ({
  item,
  selectedPath,
  onNavClick,
}: {
  item: NavItem;
  selectedPath: string;
  onNavClick: (item: NavItem) => void;
}) => (
  <button
    className={`text-gray-800 dark:text-gray-200 hover:text-primary-500 dark:hover:text-primary-500 cursor-pointer gap-2 px-2 py-1 text-md rounded-md ${
      selectedPath === item.path
        ? "border-b-2 border-primary-600 rounded-none"
        : ""
    }`}
    onClick={() => onNavClick(item)}
  >
    {item.label}
  </button>
);

export const DesktopNav = ({
  navConfig,
  selectedPath,
  onNavClick,
}: DesktopNavProps) => {
  return (
    <div className="hidden md:flex gap-4">
      {navConfig.map((item) => (
        <NavButton
          key={item.label}
          item={item}
          selectedPath={selectedPath}
          onNavClick={onNavClick}
        />
      ))}
    </div>
  );
};
