import { useCallback, useEffect, useState } from "react";
import type { SimpleCardProps } from "../components/SimpleCard";
import type { SimpleDonutGraphProps } from "../components/SimpleDonutGraph";
import type { SimpleTableProps } from "../components/SimpleTable";
import { useAuth } from "../contexts/AuthContext";
import { useReload } from "../contexts/ReloadContext";
import { useDemoData } from "../demo/useDemoData";
import { ApiError, expensesApi, incomesApi } from "../modules/apis";
import { acceptedCurrencies } from "../modules/store";
import type { ExpenseWithDetails } from "../modules/types";
import { getMonthlyData, saveMonthlyData } from "../modules/utils";

type Currency = (typeof acceptedCurrencies)[number];

export function useMonthlyData() {
  const { user, isGuest } = useAuth();
  const { onReloadRequest } = useReload();
  const [isLoading, setIsLoading] = useState(true);
  const [isCardsLoading, setIsCardsLoading] = useState(true);
  const [isChartsLoading, setIsChartsLoading] = useState(true);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);
  const [hasInitialData, setHasInitialData] = useState(false);

  // Cache expiry time: 1 hour in milliseconds
  const CACHE_EXPIRY = 60 * 60 * 1000;

  const [cards, setCards] = useState<SimpleCardProps[]>([]);
  const [tableData, setTableData] = useState<SimpleTableProps>({
    title: new Date().toLocaleString("default", { month: "long" }),
    description: "Click on an expense to edit it.",
    columns: ["Name", "Category", "Amount", "Date", "Description"],
    data: [],
  });
  const [donutGraphData, setDonutGraphData] = useState<SimpleDonutGraphProps>({
    title: "Expenses by category",
    description: "Expenses by category",
    data: [],
  });

  const [allExpenses, setAllExpenses] = useState<ExpenseWithDetails[]>([]);

  // Demo data management
  const {
    guestExpenses,
    guestExpenseItems,
    initializeDemoData,
    addDemoExpense,
    updateDemoExpense,
    deleteDemoExpense,
    getEmptyData,
  } = useDemoData();

  const updateTableAndChartData = useCallback(
    (expenses: ExpenseWithDetails[]) => {
      // Update table data
      const tableDataItems = expenses.map((expense) => {
        const currency = (expense.currency || "CLP") as Currency;
        return {
          id: expense.id,
          name: expense.item_name,
          category: expense.item_category || "Uncategorized",
          amount: formatCurrency(Math.abs(expense.amount), currency),
          date: new Date(expense.date).toLocaleDateString(),
          description: expense.item_name || "",
        };
      });

      const newTableData = {
        title: new Date().toLocaleString("default", { month: "long" }),
        description: isGuest
          ? "Demo expense data - changes are saved locally only."
          : "Click on an expense to edit it.",
        columns: ["Name", "Category", "Amount", "Date", "Description"],
        data: tableDataItems,
      };

      setTableData(newTableData);
      setIsTableLoading(false);

      // Update donut chart data (group expenses by category)
      const categories = new Map<string, number>();
      expenses.forEach((expense: ExpenseWithDetails) => {
        const category = expense.item_category || "Uncategorized";
        const expenseAmount = Math.abs(expense.amount);
        categories.set(
          category,
          (categories.get(category) || 0) + expenseAmount,
        );
      });

      const donutData = Array.from(categories.entries())
        .map(([label, value]) => ({
          label,
          value,
        }))
        .filter((item) => item.value > 0)
        .sort((a, b) => b.value - a.value);

      const newDonutGraphData = {
        title: "Expenses by category",
        description: "Expenses by category",
        data: donutData,
      };

      setDonutGraphData(newDonutGraphData);
      setIsChartsLoading(false);
    },
    [isGuest],
  );

  const fetchMonthlyData = useCallback(
    async (forceRefresh = false) => {
      try {
        setIsLoading(true);
        setIsCardsLoading(true);
        setIsChartsLoading(true);
        setIsTableLoading(true);
        setError(null);

        // Check if data is fresh (unless forcing refresh)
        if (
          !forceRefresh &&
          lastFetchTime &&
          Date.now() - lastFetchTime < CACHE_EXPIRY
        ) {
          setIsLoading(false);
          setIsCardsLoading(false);
          setIsChartsLoading(false);
          setIsTableLoading(false);
          return;
        }

        // Get current date for the monthly data
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1; // getMonth() is 0-indexed

        // Format dates for the API request
        const formatDate = (date: Date) => {
          return date.toISOString().split("T")[0];
        };

        const startDate = new Date(year, month - 1, 1); // Month is 0-indexed in JS
        const endDate = new Date(year, month, 0); // Last day of the current month

        // Fetch both expenses and income in parallel
        const [expenses, income] = await Promise.all([
          expensesApi.getAll({
            user_id: user?.id,
            start_date: formatDate(startDate),
            end_date: formatDate(endDate),
          }),
          incomesApi.getAll({
            user_id: user?.id,
            start_date: formatDate(startDate),
            end_date: formatDate(endDate),
          }),
        ]);

        // Get currency from expenses or default to CLP
        const currency = expenses.summary.currency as Currency;

        // Get total income and expenses from the summary
        const totalIncome = income.summary.total_amount || 0;
        const totalExpenses = expenses.summary.total_amount || 0;

        // Create a new card with proper typing
        const createCard = (
          title: string,
          description: string,
          value: number,
        ): SimpleCardProps => {
          // Ensure we have a valid currency
          let validCurrency: Currency;
          if (currency === "USD" || currency === "EUR" || currency === "CLP") {
            validCurrency = currency;
          } else {
            validCurrency = "CLP";
          }

          // Create the card with explicit type assertion
          const card: SimpleCardProps = {
            title,
            description,
            value,
            currency: validCurrency,
            previousValue: 0,
          };

          return card;
        };

        // Store all expenses for editing
        setAllExpenses(expenses.expenses);

        // Update cards with real data
        const updatedCards: SimpleCardProps[] = [
          createCard("Total Income", "Total income for the month", totalIncome),
          createCard(
            "Total Expenses",
            "Total expenses for the month",
            totalExpenses,
          ),
          createCard(
            "Total Savings",
            "Total savings for the month",
            totalIncome - totalExpenses,
          ),
        ];
        setCards(updatedCards);
        setIsCardsLoading(false);

        updateTableAndChartData(expenses.expenses);
        const currentTime = Date.now();
        setLastFetchTime(currentTime);

        // Save to local storage (only for authenticated users)
        saveMonthlyData({
          cards: updatedCards,
          tableData: {
            title: new Date().toLocaleString("default", { month: "long" }),
            description: "Click on an expense to edit it.",
            columns: ["Name", "Category", "Amount", "Date", "Description"],
            data: expenses.expenses.map((expense) => {
              const currency = (expense.currency || "CLP") as Currency;
              return {
                id: expense.id,
                name: expense.item_name,
                category: expense.item_category || "Uncategorized",
                amount: formatCurrency(Math.abs(expense.amount), currency),
                date: new Date(expense.date).toLocaleDateString(),
                description: expense.item_name || "",
              };
            }),
          },
          donutGraphData: {
            title: "Expenses by category",
            description: "Expenses by category",
            data: Array.from(
              expenses.expenses.reduce((categories, expense) => {
                const category = expense.item_category || "Uncategorized";
                const expenseAmount = Math.abs(expense.amount);
                categories.set(
                  category,
                  (categories.get(category) || 0) + expenseAmount,
                );
                return categories;
              }, new Map<string, number>()),
            )
              .map(([label, value]) => ({ label, value }))
              .filter((item) => item.value > 0)
              .sort((a, b) => b.value - a.value),
          },
          allExpenses: expenses.expenses,
          lastFetchTime: currentTime,
        });
      } catch (err) {
        console.error("Error fetching monthly data:", err);
        setError(err instanceof ApiError ? err.message : "Failed to load data");
        console.error("Failed to load monthly data");

        // Fall back to empty data on error
        const emptyData = getEmptyData();
        setCards(emptyData.cards);
        setTableData(emptyData.tableData);
        setDonutGraphData(emptyData.donutGraphData);
        setIsCardsLoading(false);
        setIsChartsLoading(false);
        setIsTableLoading(false);
      } finally {
        setIsLoading(false);
      }
    },
    [user, lastFetchTime, CACHE_EXPIRY, updateTableAndChartData, getEmptyData],
  );

  // Initialize data with cache checking
  useEffect(() => {
    if (hasInitialData) return; // Prevent multiple initializations

    if (isGuest) {
      // Use demo data for guest users (no caching needed)
      const demoData = initializeDemoData();
      setCards(demoData.cards);
      updateTableAndChartData(demoData.expenses);
      setIsLoading(false);
      setIsCardsLoading(false);
      setIsChartsLoading(false);
      setIsTableLoading(false);
      setHasInitialData(true);
    } else if (user) {
      // Check cache first for authenticated users
      const cachedMonthlyData = getMonthlyData();
      if (cachedMonthlyData && cachedMonthlyData.lastFetchTime) {
        const isExpired =
          Date.now() - cachedMonthlyData.lastFetchTime > CACHE_EXPIRY;
        if (!isExpired) {
          // Use cached data
          setCards(cachedMonthlyData.cards || []);
          setTableData(
            cachedMonthlyData.tableData || {
              title: new Date().toLocaleString("default", { month: "long" }),
              description: "Click on an expense to edit it.",
              columns: ["Name", "Category", "Amount", "Date", "Description"],
              data: [],
            },
          );
          setDonutGraphData(
            cachedMonthlyData.donutGraphData || {
              title: "Expenses by category",
              description: "Expenses by category",
              data: [],
            },
          );
          setAllExpenses(cachedMonthlyData.allExpenses || []);
          setLastFetchTime(cachedMonthlyData.lastFetchTime);
          setIsLoading(false);
          setIsCardsLoading(false);
          setIsChartsLoading(false);
          setIsTableLoading(false);
          setHasInitialData(true);
          return;
        } else {
          console.log("Cache expired, fetching fresh data");
        }
      }

      // Fetch fresh data if no cache or cache expired
      fetchMonthlyData(false);
      setHasInitialData(true);
    } else if (!user && !isGuest) {
      // No user and not a guest - show empty state
      const emptyData = getEmptyData();
      setCards(emptyData.cards);
      setTableData(emptyData.tableData);
      setDonutGraphData(emptyData.donutGraphData);
      setIsLoading(false);
      setIsCardsLoading(false);
      setIsChartsLoading(false);
      setIsTableLoading(false);
      setHasInitialData(true);
    }
  }, [
    user,
    isGuest,
    hasInitialData,
    fetchMonthlyData,
    initializeDemoData,
    updateTableAndChartData,
    getEmptyData,
    CACHE_EXPIRY,
  ]);

  // Register the reload callback with the context
  useEffect(() => {
    onReloadRequest(async () => {
      await fetchMonthlyData(true);
    });
  }, [onReloadRequest, fetchMonthlyData]);

  return {
    // State
    isLoading,
    isCardsLoading,
    isChartsLoading,
    isTableLoading,
    error,
    cards,
    tableData,
    donutGraphData,
    allExpenses,

    // Demo data
    guestExpenses,
    guestExpenseItems,

    // Actions
    fetchMonthlyData,
    addDemoExpense,
    updateDemoExpense,
    deleteDemoExpense,
    updateTableAndChartData,
  };
}

// Helper function for currency formatting
function formatCurrency(amount: number, currency: Currency): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}
