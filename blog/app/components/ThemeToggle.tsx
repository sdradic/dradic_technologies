import { useState } from "react";
import { MoonIcon, SunIcon } from "./Icons";

export function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      className="transition-colors cursor-pointer"
      aria-label={`Switch to dark mode`}
      onClick={toggleTheme}
    >
      {theme === "light" ? (
        <MoonIcon className="w-6 h-6 stroke-gray-600 dark:stroke-white hover:stroke-primary-500 dark:hover:stroke-primary-500" />
      ) : (
        <SunIcon className="w-6 h-6 stroke-gray-600 dark:stroke-white hover:stroke-primary-500 dark:hover:stroke-primary-500" />
      )}
    </button>
  );
}
