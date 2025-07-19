import { useCallback, useEffect, useState } from "react";
import type { SimpleCardProps } from "../components/SimpleCard";
import type { SimpleDonutGraphProps } from "../components/SimpleDonutGraph";
import type { SimpleTableProps } from "../components/SimpleTable";
import { useAuth } from "../contexts/AuthContext";
import { useReload } from "../contexts/ReloadContext";
import { useDemoData } from "../demo/useDemoData";
import { calculateCardsFromData, getEmptyMonthlyData } from "../mocks/mockData";
import { ApiError, dashboardApi } from "../modules/apis";
import type { DashboardData, ExpenseWithDetails } from "../modules/types";

export function useMonthlyData() {
  const { user, isGuest } = useAuth();
  const { onReloadRequest, setInitialLoading } = useReload();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);
  const [hasInitialData, setHasInitialData] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  // Cache expiry time: 1 hour in milliseconds
  const CACHE_EXPIRY = 60 * 60 * 1000;

  // State for UI components
  const [cards, setCards] = useState<SimpleCardProps[]>([]);
  const [tableData, setTableData] = useState<SimpleTableProps>({
    title: new Date().toLocaleString("default", { month: "long" }),
    description: "Click on an expense to edit it.",
    columns: ["Name", "Category", "Amount", "Date", "Description"],
    data: [],
  });
  const [donutGraphData, setDonutGraphData] = useState<SimpleDonutGraphProps>({
    title: "Categories",
    description: "Top 4 Expenses Categories",
    data: [],
  });

  // State for actual expense data (needed for edit modal)
  const [authenticatedExpenses, setAuthenticatedExpenses] = useState<
    ExpenseWithDetails[]
  >([]);

  // Demo data management
  const {
    guestExpenses,
    guestExpenseItems,
    guestIncomes,
    initializeDemoData,
    addDemoExpense,
    updateDemoExpense,
    deleteDemoExpense,
  } = useDemoData();

  // Convert dashboard data to UI props
  const convertDashboardToUIProps = useCallback(
    (dashboardData: DashboardData) => {
      // Convert cards
      const uiCards: SimpleCardProps[] = dashboardData.cards.map((card) => ({
        title: card.title,
        description: card.description,
        value: card.value,
        currency: card.currency as any, // Type assertion for accepted currencies
        previousValue: card.previous_value,
      }));

      // Convert donut graph
      const uiDonutGraph: SimpleDonutGraphProps = {
        title: dashboardData.donut_graph.title,
        description: dashboardData.donut_graph.description,
        data: dashboardData.donut_graph.data,
      };

      // Convert table
      const uiTable: SimpleTableProps = {
        title: dashboardData.table.title,
        description: dashboardData.table.description,
        columns: dashboardData.table.columns,
        data: dashboardData.table.data.map((row) => ({
          id: row.id,
          name: row.name,
          category: row.category,
          amount: row.amount,
          date: row.date,
          description: row.description,
        })),
      };

      return { cards: uiCards, donutGraph: uiDonutGraph, table: uiTable };
    },
    [],
  );

  // Stable fetch function that doesn't change on every render
  const fetchMonthlyData = useCallback(
    async (forceRefresh = false) => {
      // Prevent duplicate calls during initialization
      if (isInitializing && !forceRefresh) {
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Check if data is fresh (unless forcing refresh)
        if (
          !forceRefresh &&
          lastFetchTime &&
          Date.now() - lastFetchTime < CACHE_EXPIRY
        ) {
          setIsLoading(false);
          return;
        }

        // Get current date for the monthly data
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1; // getMonth() is 0-indexed

        // Fetch unified dashboard data
        const dashboardData = await dashboardApi.getMonthlyDashboard(
          year,
          month,
        );

        // Convert to UI props
        const uiProps = convertDashboardToUIProps(dashboardData);

        setCards(uiProps.cards);
        setDonutGraphData(uiProps.donutGraph);
        setTableData(uiProps.table);

        // Set the actual expenses from the dashboard response
        setAuthenticatedExpenses(dashboardData.expenses || []);

        setLastFetchTime(Date.now());
        setIsLoading(false);
        setInitialLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err instanceof ApiError ? err.message : "Failed to load data");

        // Fall back to empty data on error
        const emptyData = getEmptyMonthlyData();
        setCards(emptyData.cards || []);
        setTableData(
          emptyData.tableData || {
            title: new Date().toLocaleString("default", { month: "long" }),
            description: "Click on an expense to edit it.",
            columns: ["Name", "Category", "Amount", "Date", "Description"],
            data: [],
          },
        );
        setDonutGraphData(
          emptyData.donutGraphData || {
            title: "Expenses by category",
            description: "Expenses by category",
            data: [],
          },
        );
        setAuthenticatedExpenses([]);
        setIsLoading(false);
        setInitialLoading(false);
      }
    },
    [
      lastFetchTime,
      CACHE_EXPIRY,
      convertDashboardToUIProps,
      setInitialLoading,
      isInitializing,
    ],
  );

  // Function to recalculate cards for guest mode
  const recalculateGuestCards = useCallback(() => {
    if (isGuest && guestIncomes && guestExpenses) {
      const calculatedCards = calculateCardsFromData(
        guestIncomes,
        guestExpenses,
        "CLP",
      );
      setCards(calculatedCards);
    }
  }, [isGuest, guestIncomes, guestExpenses]);

  // Initialize data - only run once
  useEffect(() => {
    if (hasInitialData || isInitializing) return; // Prevent multiple initializations

    setIsInitializing(true);

    if (isGuest) {
      // Use demo data for guest users
      const demoData = initializeDemoData();
      setCards(demoData.cards);
      // For demo data, we need to create table and donut data from expenses
      const demoTableData = {
        title: new Date().toLocaleString("default", { month: "long" }),
        description: "Demo expense data - changes are saved locally only.",
        columns: ["Name", "Category", "Amount", "Date", "Description"],
        data: demoData.expenses.map((expense) => ({
          id: expense.id,
          name: expense.item_name,
          category: expense.item_category || "Uncategorized",
          amount: `${expense.currency} ${Math.abs(expense.amount).toLocaleString()}`,
          date: new Date(expense.date).toLocaleDateString(),
          description: expense.item_name,
        })),
      };
      setTableData(demoTableData);

      // Create donut data from expenses
      const categoryTotals = demoData.expenses.reduce(
        (acc, expense) => {
          const category = expense.item_category || "Uncategorized";
          acc[category] = (acc[category] || 0) + Math.abs(expense.amount);
          return acc;
        },
        {} as Record<string, number>,
      );

      const demoDonutData = {
        title: "Expenses by category",
        description: "Top 4 expense categories",
        data: Object.entries(categoryTotals)
          .map(([label, value]) => ({ label, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 4), // Limit to top 4 categories
      };
      setDonutGraphData(demoDonutData);
      setIsLoading(false);
      setInitialLoading(false);
      setHasInitialData(true);
      setIsInitializing(false);
    } else if (user) {
      // Fetch fresh data for authenticated users
      fetchMonthlyData(false);
      setHasInitialData(true);
      setIsInitializing(false);
    } else {
      // No user and not a guest - show empty state
      const emptyData = getEmptyMonthlyData();
      setCards(emptyData.cards);
      setTableData(emptyData.tableData);
      setDonutGraphData(emptyData.donutGraphData);
      setIsLoading(false);
      setInitialLoading(false);
      setHasInitialData(true);
      setIsInitializing(false);
    }
  }, [
    user,
    isGuest,
    hasInitialData,
    isInitializing,
    initializeDemoData,
    setInitialLoading,
    fetchMonthlyData,
  ]);

  // Recalculate cards when guest data changes
  useEffect(() => {
    if (isGuest) {
      recalculateGuestCards();
    }
  }, [isGuest, recalculateGuestCards]);

  // Register the reload callback with the context - only once
  useEffect(() => {
    onReloadRequest(async () => {
      await fetchMonthlyData(true);
    });
  }, [onReloadRequest, fetchMonthlyData]);

  return {
    // State
    isLoading,
    error,
    cards,
    tableData,
    donutGraphData,

    // Demo data
    guestExpenses,
    guestExpenseItems,

    // Authenticated user data
    authenticatedExpenses,

    // Actions
    fetchMonthlyData,
    addDemoExpense,
    updateDemoExpense,
    deleteDemoExpense,
  };
}
