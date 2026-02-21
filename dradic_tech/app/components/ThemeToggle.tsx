import { useEffect } from "react";
import { MoonIcon, SunIcon } from "./Icons";
import { useTheme } from "~/contexts/ThemeContext";

// Matches Dradic Tech color conventions for brand and bg
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

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
      className={`flex items-center justify-between w-14 h-7 p-1 rounded-full cursor-pointer
        bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors duration-200`}
    >
      {/* Light - highlight if active, plain if not */}
      <div
        className={`
          flex justify-center items-center w-1/2 h-full rounded-full transition-colors duration-200
          ${theme === "light" ? "bg-yellow-100" : "bg-transparent"}
        `}
      >
        <SunIcon
          className={`w-4 h-4
            fill-yellow-400 stroke-yellow-400
          `}
        />
      </div>
      {/* Dark - highlight if active, plain if not */}
      <div
        className={`
          flex justify-center items-center w-1/2 h-full rounded-full transition-colors duration-200
          ${theme === "dark" ? "bg-brand-600" : "bg-transparent"}
        `}
      >
        <MoonIcon
          className={`w-4 h-4
            ${
              theme === "dark"
                ? "fill-slate-100 stroke-slate-100"
                : "fill-slate-400 stroke-slate-400"
            }
          `}
        />
      </div>
    </div>
  );
}
