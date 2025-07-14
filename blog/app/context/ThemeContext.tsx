import { createContext, useContext, useEffect, useState } from "react";

type ThemeContextType = {
  theme: "light" | "dark";
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Get theme from localStorage on mount
    const savedTheme = localStorage.getItem("dradic-tech-theme") as
      | "light"
      | "dark"
      | null;
    const initialTheme = savedTheme || "light";

    setTheme(initialTheme);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      // Only apply theme to document after component is mounted
      document.documentElement.className = theme;
      localStorage.setItem("dradic-tech-theme", theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Prevent flash of wrong theme by only rendering children after mount
  if (!mounted) {
    return null;
  }

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
