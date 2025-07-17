import { useCallback, useEffect, useState } from "react";
import type { SimpleTableProps } from "../components/SimpleTable";
import { useAuth } from "../contexts/AuthContext";
import { useDemoData } from "../demo/useDemoData";
import { ApiError, incomesApi, incomeSourcesApi } from "../modules/apis";
import { acceptedCurrencies } from "../modules/store";
import type { IncomeSource, IncomeWithDetails } from "../modules/types";
import {
  formatCurrency,
  getIncomeData,
  saveIncomeData,
} from "../modules/utils";

type Currency = (typeof acceptedCurrencies)[number];

export function useIncomeData() {
  const { user, isGuest } = useAuth();
  const {
    guestIncomes,
    guestIncomeSources,
    initializeDemoIncomeData,
    getEmptyIncomeData,
  } = useDemoData();
  const [isLoading, setIsLoading] = useState(true);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [isSourcesLoading, setIsSourcesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);
  const [hasInitialData, setHasInitialData] = useState(false);

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

  const updateTableData = useCallback(
    (incomes: IncomeWithDetails[]) => {
      const newTableData = {
        title: new Date().toLocaleString("default", { month: "long" }),
        description: isGuest
          ? "Demo income data - changes are saved locally only."
          : "Click on an income to edit it.",
        columns: ["Source", "Amount", "Currency", "Date", "Description"],
        data: incomes.map((income) => {
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
      };

      setTableData(newTableData);
      setIsTableLoading(false);
    },
    [isGuest]
  );

  const fetchIncomeData = useCallback(
    async (forceRefresh = false) => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        setIsTableLoading(true);
        setIsSourcesLoading(true);
        setError(null);

        // Check if data is fresh (unless forcing refresh)
        if (
          !forceRefresh &&
          lastFetchTime &&
          Date.now() - lastFetchTime < CACHE_EXPIRY
        ) {
          setIsLoading(false);
          setIsTableLoading(false);
          setIsSourcesLoading(false);
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

        // Fetch incomes and sources separately for granular loading
        const incomesPromise = incomesApi.getAll({
          user_id: user.id,
          start_date: formatDate(startDate),
          end_date: formatDate(endDate),
        });

        const sourcesPromise = incomeSourcesApi.getAll(user.id);

        // Start both requests
        const [incomesResponse, sourcesResponse] = await Promise.all([
          incomesPromise,
          sourcesPromise,
        ]);

        // Store all incomes for editing
        setAllIncomes(incomesResponse.incomes);

        // Update sources for modal
        setSources(sourcesResponse.items);
        setIsSourcesLoading(false);

        // Update table data
        updateTableData(incomesResponse.incomes);

        const currentTime = Date.now();
        setLastFetchTime(currentTime);

        // Save to local storage
        saveIncomeData({
          tableData: {
            title: new Date().toLocaleString("default", { month: "long" }),
            description: "Click on an income to edit it.",
            columns: ["Source", "Amount", "Currency", "Date", "Description"],
            data: incomesResponse.incomes.map((income) => ({
              id: income.id,
              source: income.source_name,
              amount: formatCurrency(
                income.amount,
                income.currency as Currency
              ),
              currency: income.currency,
              date: income.date,
              description: income.description || "",
            })),
          },
          allIncomes: incomesResponse.incomes,
          sources: sourcesResponse.items,
          lastFetchTime: currentTime,
        });
      } catch (err) {
        console.error("Error fetching income data:", err);
        setError(err instanceof ApiError ? err.message : "Failed to load data");
        console.error("Failed to load income data");

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
              }
        );
        setSources([]);
        setIsTableLoading(false);
        setIsSourcesLoading(false);
      } finally {
        setIsLoading(false);
      }
    },
    [user, lastFetchTime, CACHE_EXPIRY, updateTableData]
  );

  // Initialize data with cache checking
  useEffect(() => {
    if (hasInitialData) return; // Prevent multiple initializations

    if (isGuest) {
      // Use demo data from useDemoData
      initializeDemoIncomeData();
      setSources(guestIncomeSources);
      updateTableData(guestIncomes);
      setIsLoading(false);
      setIsTableLoading(false);
      setIsSourcesLoading(false);
      setHasInitialData(true);
    } else if (user) {
      // Check cache first for authenticated users
      const cachedIncomeData = getIncomeData();
      if (cachedIncomeData && cachedIncomeData.lastFetchTime) {
        const isExpired =
          Date.now() - cachedIncomeData.lastFetchTime > CACHE_EXPIRY;
        if (!isExpired) {
          // Use cached data
          setTableData(
            cachedIncomeData.tableData || {
              title: new Date().toLocaleString("default", { month: "long" }),
              description: "Click on an income to edit it.",
              columns: ["Source", "Amount", "Currency", "Date", "Description"],
              data: [],
            }
          );
          setAllIncomes(cachedIncomeData.allIncomes || []);
          setSources(cachedIncomeData.sources || []);
          setLastFetchTime(cachedIncomeData.lastFetchTime);
          setIsLoading(false);
          setIsTableLoading(false);
          setIsSourcesLoading(false);
          setHasInitialData(true);
          return;
        }
      }

      // Fetch fresh data if no cache or cache expired
      fetchIncomeData(false);
      setHasInitialData(true);
    } else if (!user && !isGuest) {
      // No user and not a guest - show empty state
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
              columns: ["Source", "Amount", "Currency", "Date", "Description"],
              data: [],
            }
      );
      setSources([]);
      setIsLoading(false);
      setIsTableLoading(false);
      setIsSourcesLoading(false);
      setHasInitialData(true);
    }
  }, [
    user,
    isGuest,
    hasInitialData,
    fetchIncomeData,
    updateTableData,
    CACHE_EXPIRY,
    initializeDemoIncomeData,
    guestIncomes,
    guestIncomeSources,
  ]);

  return {
    // State
    isLoading,
    isTableLoading,
    isSourcesLoading,
    error,
    tableData,
    allIncomes,
    sources,
    guestIncomes,
    guestIncomeSources,
    // Actions
    fetchIncomeData,
    updateTableData,
  };
}
