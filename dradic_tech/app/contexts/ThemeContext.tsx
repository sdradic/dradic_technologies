import { createContext, useContext, useEffect, useState } from "react";
import { localState } from "~/modules/utils";

type ThemeContextType = {
  theme: "light" | "dark";
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const ThemeDefault =
  typeof window !== "undefined" &&
  window?.matchMedia("(prefers-color-scheme: dark)")?.matches
    ? "dark"
    : "light";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">(ThemeDefault);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Get theme from utils local state
    const savedTheme = localState.getTheme() as "light" | "dark";
    const initialTheme = savedTheme || "light";

    setTheme(initialTheme);
    setMounted(true);

    // Ensure the theme is applied to document (in case the head script didn't run)
    if (initialTheme === "dark") {
      document.documentElement.className = "dark";
    } else {
      document.documentElement.className = "";
    }
  }, []);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? "dark" : "light";
      setTheme(newTheme);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    if (mounted) {
      // Apply theme to document and save to local state
      if (theme === "dark") {
        document.documentElement.className = "dark";
      } else {
        document.documentElement.className = "";
      }
      localState.setTheme(theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
