import { useEffect } from "react";
import { MoonIcon, SunIcon } from "./Icons";
import { useTheme } from "~/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-center justify-between w-14 h-7 p-1 rounded-full border border-gray-500 dark:border-gray-400">
        <div className="flex justify-center items-center w-1/2 h-full rounded-full">
          <SunIcon className="w-3 h-3 fill-yellow-400 stroke-yellow-400" />
        </div>
        <div className="flex justify-center items-center w-1/2 h-full rounded-full">
          <MoonIcon className="w-3 h-3 fill-gray-400 stroke-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={toggleTheme}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleTheme();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className="flex items-center justify-between w-14 h-7 p-1 rounded-full cursor-pointer bg-gray-100 dark:bg-dark-400 border border-gray-200 dark:border-dark-300"
    >
      <div
        className={`
        flex justify-center items-center w-1/2 h-full rounded-full transition-colors duration-200
        ${theme === "light" ? "bg-yellow-100" : "bg-transparent"}
      `}
      >
        <SunIcon
          className={`w-3 h-3 ${theme === "light" ? "fill-yellow-400 stroke-yellow-400" : "fill-gray-400 stroke-gray-400"}`}
        />
      </div>
      <div
        className={`
        flex justify-center items-center w-1/2 h-full rounded-full transition-colors duration-200
        ${theme === "dark" ? "bg-indigo-900" : "bg-transparent"}
      `}
      >
        <MoonIcon
          className={`w-3 h-3 ${theme === "dark" ? "fill-gray-400 stroke-gray-400" : "fill-gray-400 stroke-gray-400"}`}
        />
      </div>
    </div>
  );
}
