import { useState, useEffect, useRef } from "react";
import { useAuth } from "~/contexts/AuthContext";
import { incomeSourcesApi } from "~/modules/apis";
import type { IncomeSourceResponse } from "~/modules/types";

// Manual cache to prevent duplicate calls
export const incomeSourcesCache = new Map<string, IncomeSourceResponse>();
const loadingStates = new Map<string, boolean>();

function useIncomeSources({ reloadTrigger }: { reloadTrigger: number }) {
  const { user } = useAuth();
  const userId = user?.id;
  const lastReloadTrigger = useRef(0);
  const hasInitialized = useRef(false);
  const [data, setData] = useState<IncomeSourceResponse>({
    sources: [],
    total_count: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Create a stable cache key
  const cacheKey = userId || "no-user";

  useEffect(() => {
    const loadData = async () => {
      if (!userId) {
        setData({ sources: [], total_count: 0 });
        return;
      }

      // Check if we should reload
      const shouldReload =
        reloadTrigger !== lastReloadTrigger.current && reloadTrigger > 0;

      // On first load, check cache
      if (!hasInitialized.current) {
        hasInitialized.current = true;
        if (incomeSourcesCache.has(cacheKey)) {
          setData(incomeSourcesCache.get(cacheKey)!);
          return;
        }
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
        const response = await incomeSourcesApi.getAll();
        incomeSourcesCache.set(cacheKey, response);
        setData(response);
      } catch (error) {
        console.error("Error loading income sources:", error);
        setData({ sources: [], total_count: 0 });
      } finally {
        setIsLoading(false);
        loadingStates.set(cacheKey, false);
      }
    };

    loadData();
  }, [userId, reloadTrigger, cacheKey]);

  return { ...data, isLoading };
}

export default useIncomeSources;
