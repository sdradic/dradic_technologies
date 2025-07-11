import { useState } from "react";

export const acceptedCurrencies = ["CLP", "USD", "EUR"] as const;

export function darkModeState() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return {
    isDarkMode,
    setIsDarkMode,
  };
}
