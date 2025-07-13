import { useState } from "react";
import { MoonIcon, SunIcon } from "./Icons";

export function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      className="p-2 rounded-lg hover:bg-primary-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
      aria-label={`Switch to dark mode`}
      onClick={toggleTheme}
    >
      {theme === "light" ? (
        <MoonIcon className="w-6 h-6 stroke-gray-600 dark:stroke-white" />
      ) : (
        <SunIcon className="w-6 h-6 stroke-gray-600 dark:stroke-white" />
      )}
    </button>
  );
}
