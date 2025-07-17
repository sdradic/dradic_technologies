import { type acceptedCurrencies } from "./store";

export function formatCurrency(
  value: number,
  currency: (typeof acceptedCurrencies)[number]
) {
  // Ensure we have a valid currency, fallback to CLP if not
  const validCurrency = currency && currency.length === 3 ? currency : "CLP";

  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: validCurrency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Local storage utilities
const STORAGE_KEY = "expense-tracker-local-state";

interface LocalStorageData {
  theme?: "light" | "dark";
  monthlyData?: {
    cards: any[];
    tableData: any;
    donutGraphData: any;
    allExpenses: any[];
    lastFetchTime: number;
  };
  incomeData?: {
    tableData: any;
    allIncomes: any[];
    sources: any[];
    lastFetchTime: number;
  };
}

export function saveToLocalStorage(data: Partial<LocalStorageData>): void {
  try {
    const existingData = getFromLocalStorage();
    const updatedData = { ...existingData, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
}

export function getFromLocalStorage(): LocalStorageData {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Failed to read from localStorage:", error);
    return {};
  }
}

export function clearLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear localStorage:", error);
  }
}

// Specific getters and setters for better type safety
export function saveTheme(theme: "light" | "dark"): void {
  saveToLocalStorage({ theme });
}

export function getTheme(): "light" | "dark" | undefined {
  return getFromLocalStorage().theme;
}

export function saveMonthlyData(data: LocalStorageData["monthlyData"]): void {
  saveToLocalStorage({ monthlyData: data });
}

export function getMonthlyData(): LocalStorageData["monthlyData"] {
  return getFromLocalStorage().monthlyData;
}

export function saveIncomeData(data: LocalStorageData["incomeData"]): void {
  saveToLocalStorage({ incomeData: data });
}

export function getIncomeData(): LocalStorageData["incomeData"] {
  return getFromLocalStorage().incomeData;
}
