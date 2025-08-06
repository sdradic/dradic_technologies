import { useState } from "react";

export const acceptedCurrencies = ["CLP", "USD", "EUR"] as const;

export function useDarkModeState() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return {
    isDarkMode,
    setIsDarkMode,
  };
}

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
