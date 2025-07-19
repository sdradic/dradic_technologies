import { useCallback, useEffect, useState } from "react";
import type { SimpleTableProps } from "../components/SimpleTable";
import { useAuth } from "../contexts/AuthContext";
import { useReload } from "../contexts/ReloadContext";
import { useDemoData } from "../demo/useDemoData";
import { ApiError, dashboardApi, incomeSourcesApi } from "../modules/apis";
import { acceptedCurrencies } from "../modules/store";
import type { IncomeSource, IncomeWithDetails } from "../modules/types";
import { formatCurrency, saveIncomeData } from "../modules/utils";

type Currency = (typeof acceptedCurrencies)[number];

export function useIncomeData() {
  const { user, isGuest } = useAuth();
  const { setInitialLoading } = useReload();
  const { guestIncomes, initializeDemoIncomeData, getEmptyIncomeData } =
    useDemoData();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);
  const [hasInitialData, setHasInitialData] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  // Cache expiry time: 1 hour in milliseconds
  const CACHE_EXPIRY = 60 * 60 * 1000;

  const [tableData, setTableData] = useState<SimpleTableProps>({
    title: new Date().toLocaleString("default", { month: "long" }),
    description: "Click on an income to edit it.",
    columns: ["Source", "Amount", "Currency", "Date", "Description"],
    data: [],
  });

  const [allIncomes, setAllIncomes] = useState<IncomeWithDetails[]>([]);
  const [sources, setSources] = useState<IncomeSource[]>([]);

  // Convert dashboard data to UI props
  const convertDashboardToUIProps = useCallback((dashboardData: any) => {
    return {
      tableData: {
        title: dashboardData.table.title,
        description: dashboardData.table.description,
        columns: dashboardData.table.columns,
        data: dashboardData.table.data.map((row: any) => ({
          id: row.id,
          source: row.name,
          category: row.category,
          amount: row.amount,
          date: row.date,
          description: row.description,
        })),
      },
      sources: [], // Will be populated separately if needed
    };
  }, []);

  const fetchIncomeData = useCallback(
    async (forceRefresh = false) => {
      if (!user && !isGuest) return;

      // Prevent duplicate calls during initialization
      if (isInitializing && !forceRefresh) {
        return;
      }

      // Check cache expiry for authenticated users
      if (!forceRefresh && lastFetchTime) {
        const timeSinceLastFetch = Date.now() - lastFetchTime;
        if (timeSinceLastFetch < CACHE_EXPIRY) {
          return; // Use cached data
        }
      }

      setIsLoading(true);
      setError(null);

      try {
        if (isGuest) {
          // For guests, just refresh demo data
          const demoData = initializeDemoIncomeData();
          setSources(demoData.sources);
          setTableData({
            title: new Date().toLocaleString("default", { month: "long" }),
            description: "Demo income data - changes are saved locally only.",
            columns: ["Source", "Amount", "Currency", "Date", "Description"],
            data: demoData.incomes.map((income) => {
              const currency = (income.currency || "CLP") as Currency;
              return {
                id: income.id,
                source: income.source_name,
                amount: formatCurrency(income.amount, currency),
                currency: income.currency,
                date: income.date,
                description: income.description || "",
              };
            }),
          });
          setAllIncomes(demoData.incomes);
          setIsLoading(false);
          setInitialLoading(false);
          return;
        }

        // For authenticated users, fetch fresh data
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        // Fetch data with Promise.all to avoid race conditions
        const [dashboardData, sourcesResponse] = await Promise.all([
          dashboardApi.getMonthlyIncomeDashboard(year, month),
          incomeSourcesApi.getAll({ user_id: user?.id }),
        ]);

        const uiProps = convertDashboardToUIProps(dashboardData);

        setTableData(uiProps.tableData);

        const incomesFromDashboard = dashboardData.table.data.map(
          (row: any) => ({
            id: row.id,
            source_id: "",
            amount: parseFloat(row.amount.replace(/[^\d.-]/g, "")),
            currency: dashboardData.currency,
            date: row.date,
            description: row.description,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            source_name: row.name,
            source_category: row.category,
            user_name: "",
            user_email: "",
            group_name: "",
          }),
        );

        setAllIncomes(incomesFromDashboard);
        setSources(sourcesResponse.sources || []);

        const currentTime = Date.now();
        setLastFetchTime(currentTime);

        saveIncomeData({
          tableData: uiProps.tableData,
          allIncomes: incomesFromDashboard,
          sources: sourcesResponse.sources || [],
          lastFetchTime: currentTime,
        });
        setInitialLoading(false);
      } catch (err) {
        console.error("Error fetching income data:", err);
        setError(err instanceof ApiError ? err.message : "Failed to load data");
        setInitialLoading(false);
      } finally {
        setIsLoading(false);
      }
    },
    [
      user,
      isGuest,
      lastFetchTime,
      CACHE_EXPIRY,
      initializeDemoIncomeData,
      convertDashboardToUIProps,
      setInitialLoading,
      isInitializing,
    ],
  );

  // Initialize data on mount - only run once
  useEffect(() => {
    if (hasInitialData || isInitializing) return;

    setIsInitializing(true);

    const initializeData = async () => {
      if (isGuest) {
        // For guests, always use demo data
        const demoData = initializeDemoIncomeData();
        setSources(demoData.sources);
        setTableData({
          title: new Date().toLocaleString("default", { month: "long" }),
          description: "Demo income data - changes are saved locally only.",
          columns: ["Source", "Amount", "Currency", "Date", "Description"],
          data: demoData.incomes.map((income) => {
            const currency = (income.currency || "CLP") as Currency;
            return {
              id: income.id,
              source: income.source_name,
              amount: formatCurrency(income.amount, currency),
              currency: income.currency,
              date: income.date,
              description: income.description || "",
            };
          }),
        });
        setAllIncomes(demoData.incomes);
        setIsLoading(false);
        setInitialLoading(false);
        setHasInitialData(true);
        setIsInitializing(false);
        return;
      }

      if (!user) {
        // No user - show empty state
        setIsLoading(false);
        setInitialLoading(false);
        setHasInitialData(true);
        setIsInitializing(false);
        return;
      }

      // For authenticated users, fetch fresh data on mount
      try {
        setIsLoading(true);
        setError(null);

        // Get current date for the monthly data
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1; // getMonth() is 0-indexed

        // Fetch unified dashboard data
        const dashboardData = await dashboardApi.getMonthlyIncomeDashboard(
          year,
          month,
        );

        // Fetch income sources separately (needed for modal dropdown)
        const sourcesResponse = await incomeSourcesApi.getAll({
          user_id: user?.id,
        });

        // Convert to UI props
        const uiProps = convertDashboardToUIProps(dashboardData);

        setTableData(uiProps.tableData);

        // Populate allIncomes from dashboard data for row click functionality
        const incomesFromDashboard = dashboardData.table.data.map(
          (row: any) => ({
            id: row.id,
            source_id: "", // Not provided by dashboard, will be fetched separately if needed
            amount: parseFloat(row.amount.replace(/[^\d.-]/g, "")), // Extract number from formatted string
            currency: dashboardData.currency,
            date: row.date,
            description: row.description,
            created_at: new Date().toISOString(), // Not provided by dashboard
            updated_at: new Date().toISOString(), // Not provided by dashboard
            source_name: row.name,
            source_category: row.category,
            user_name: "", // Not provided by dashboard
            user_email: "", // Not provided by dashboard
            group_name: "", // Not provided by dashboard
          }),
        );

        setAllIncomes(incomesFromDashboard);
        setSources(sourcesResponse.sources || []);

        const currentTime = Date.now();
        setLastFetchTime(currentTime);

        // Save to local storage
        saveIncomeData({
          tableData: uiProps.tableData,
          allIncomes: incomesFromDashboard,
          sources: sourcesResponse.sources || [],
          lastFetchTime: currentTime,
        });
        setInitialLoading(false);
        setHasInitialData(true);
        setIsInitializing(false);
      } catch (err) {
        console.error("Error fetching income data:", err);
        setError(err instanceof ApiError ? err.message : "Failed to load data");

        // Fall back to empty data on error
        const emptyData =
          getEmptyIncomeData && typeof getEmptyIncomeData === "function"
            ? getEmptyIncomeData()
            : undefined;
        setTableData(
          emptyData && emptyData.tableData
            ? emptyData.tableData
            : {
                title: new Date().toLocaleString("default", { month: "long" }),
                description: "Click on an income to edit it.",
                columns: [
                  "Source",
                  "Amount",
                  "Currency",
                  "Date",
                  "Description",
                ],
                data: [],
              },
        );
        setSources([]);
        setAllIncomes([]);
        setInitialLoading(false);
        setHasInitialData(true);
        setIsInitializing(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [
    user,
    isGuest,
    hasInitialData,
    isInitializing,
    initializeDemoIncomeData,
    convertDashboardToUIProps,
    getEmptyIncomeData,
    setInitialLoading,
  ]);

  return {
    // Data
    tableData,
    allIncomes,
    sources,
    guestIncomes,

    // Loading states
    isLoading,
    isTableLoading: isLoading, // Simplified to single loading state
    isSourcesLoading: false, // No longer needed with unified API

    // Error state
    error,

    // Actions
    fetchIncomeData,
    setGuestIncomes: () => {}, // Simplified - no longer needed
    updateTableData: () => {}, // Simplified - no longer needed
  };
}
