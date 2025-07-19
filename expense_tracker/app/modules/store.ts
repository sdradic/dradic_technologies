import { useState } from "react";

export const acceptedCurrencies = ["CLP", "USD", "EUR"] as const;

export function useDarkModeState() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return {
    isDarkMode,
    setIsDarkMode,
  };
}
