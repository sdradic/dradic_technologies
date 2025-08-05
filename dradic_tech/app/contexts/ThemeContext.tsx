import { createContext, useContext, useEffect, useState } from "react";
import { localState } from "~/modules/utils";

type ThemeContextType = {
  theme: "light" | "dark";
  toggleTheme: () => void;
  mounted: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Safe default theme that works during SSR
const getDefaultTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") {
    return "light"; // Default for SSR
  }

  // Check system preference
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">(getDefaultTheme());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    try {
      // Get theme from utils local state
      const savedTheme = localState.getTheme() as "light" | "dark";
      const initialTheme = savedTheme || getDefaultTheme();

      setTheme(initialTheme);

      // Apply theme to document
      if (initialTheme === "dark") {
        document.documentElement.className = "dark";
      } else {
        document.documentElement.className = "";
      }
    } catch (error) {
      // Fallback to system preference
      const fallbackTheme = getDefaultTheme();
      setTheme(fallbackTheme);

      if (fallbackTheme === "dark") {
        document.documentElement.className = "dark";
      } else {
        document.documentElement.className = "";
      }
      throw error;
    } finally {
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      // Only change theme if no saved preference exists
      const savedTheme = localState.getTheme();
      if (!savedTheme) {
        const newTheme = e.matches ? "dark" : "light";
        setTheme(newTheme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    // Apply theme to document and save to local state
    if (theme === "dark") {
      document.documentElement.className = "dark";
    } else {
      document.documentElement.className = "";
    }
    localState.setTheme(theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
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
