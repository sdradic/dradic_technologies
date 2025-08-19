import { useEffect, useRef, useState } from "react";
import { useAuth } from "~/contexts/AuthContext";
import { dashboardApi } from "~/modules/apis";
import type { DashboardTableWithIncomes } from "~/modules/types";

// Manual cache to ensure stability
export const incomeDashboardCache = new Map<
  string,
  DashboardTableWithIncomes
>();
const loadingStates = new Map<string, boolean>();

export function useIncomesTableData({
  reloadTrigger,
  year,
  month,
}: {
  reloadTrigger: number;
  year: number;
  month: number;
}) {
  const { user } = useAuth();
  const userId = user?.id;
  const lastReloadTrigger = useRef(0);
  const hasInitialized = useRef(false);
  const [data, setData] = useState<DashboardTableWithIncomes>({
    table: {
      title: "",
      description: "",
      columns: [],
      data: [],
    },
    incomes: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // Create a stable cache key including all parameters
  const cacheKey = `${userId || "no-user"}-${year}-${month}-CLP`;

  useEffect(() => {
    const loadData = async () => {
      if (!userId) {
        setData({
          table: {
            title: "",
            description: "",
            columns: [],
            data: [],
          },
          incomes: [],
        });
        setIsLoading(false);
        return;
      }

      // Check if we should reload
      const shouldReload =
        reloadTrigger !== lastReloadTrigger.current && reloadTrigger > 0;

      // On first load, check cache
      if (!hasInitialized.current) {
        hasInitialized.current = true;
        if (incomeDashboardCache.has(cacheKey)) {
          setData(incomeDashboardCache.get(cacheKey)!);
          setIsLoading(false);
          return;
        }
        // No cache on first load, we need to load data
      } else if (!shouldReload) {
        // Not first load and no reload needed
        return;
      }

      // Prevent duplicate requests
      if (loadingStates.get(cacheKey)) {
        return;
      }

      // Update reload trigger reference
      if (shouldReload) {
        lastReloadTrigger.current = reloadTrigger;
      }

      try {
        setIsLoading(true);
        loadingStates.set(cacheKey, true);
        const response = await dashboardApi.getMonthlyIncomeDashboard(
          year,
          month,
          "CLP",
        );
        incomeDashboardCache.set(cacheKey, response);
        setData(response);
      } catch (error) {
        console.error("Error loading income dashboard:", error);
        setData({
          table: {
            title: "",
            description: "",
            columns: [],
            data: [],
          },
          incomes: [],
        });
      } finally {
        setIsLoading(false);
        loadingStates.set(cacheKey, false);
      }
    };

    loadData();
  }, [userId, year, month, reloadTrigger, cacheKey]);

  return { ...data, isLoading };
}
