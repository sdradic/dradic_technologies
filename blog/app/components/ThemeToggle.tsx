import { useEffect } from "react";
import { MoonIcon, SunIcon } from "./Icons";
import { useTheme } from "~/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <div
      onClick={toggleTheme}
      className="flex items-center justify-between w-14 h-6 p-1 rounded-full cursor-pointer border border-gray-500 dark:border-gray-400"
    >
      <div
        className={`
        flex justify-center items-center w-1/2 h-full rounded-full
        ${theme === "light" ? "bg-yellow-50" : ""}
      `}
      >
        <SunIcon className="w-3 h-3 fill-yellow-400 stroke-yellow-500" />
      </div>
      <div
        className={`
        flex justify-center items-center w-1/2 h-full rounded-full
        ${theme === "dark" ? "bg-[#18196F]" : ""}
      `}
      >
        <MoonIcon className="w-3 h-3 fill-gray-400 stroke-gray-500" />
      </div>
    </div>
  );
}
