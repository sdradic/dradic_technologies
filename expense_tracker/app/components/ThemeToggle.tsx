import { useTheme } from "../contexts/ThemeContext";
import { MoonIcon, SunIcon } from "./Icons";
import { darkModeState } from "~/modules/store";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { setIsDarkMode } = darkModeState();

  return (
    <button
      onClick={() => {
        toggleTheme();
        setIsDarkMode(theme === "light");
      }}
      className="p-2 rounded-lg hover:bg-primary-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <MoonIcon className="w-5 h-5 stroke-gray-600 dark:stroke-white" />
      ) : (
        <SunIcon className="w-5 h-5 stroke-gray-600 dark:stroke-white" />
      )}
    </button>
  );
}
