import { useState, useEffect, useRef } from "react";
import { useAuth } from "~/contexts/AuthContext";
import { expenseItemsApi } from "~/modules/apis";
import type { ExpenseItemResponse } from "~/modules/types";

// Manual cache to prevent duplicate calls
export const expenseItemsCache = new Map<string, ExpenseItemResponse>();
const loadingStates = new Map<string, boolean>();

function useExpenseItems({ reloadTrigger }: { reloadTrigger: number }) {
  const { user } = useAuth();
  const userId = user?.id;
  const lastReloadTrigger = useRef(0);
  const hasInitialized = useRef(false);
  const [data, setData] = useState<ExpenseItemResponse>({
    items: [],
    total_count: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Create a stable cache key
  const cacheKey = userId || "no-user";

  useEffect(() => {
    const loadData = async () => {
      if (!userId) {
        setData({ items: [], total_count: 0 });
        return;
      }

      // Check if we should reload
      const shouldReload =
        reloadTrigger !== lastReloadTrigger.current && reloadTrigger > 0;

      // On first load, check cache
      if (!hasInitialized.current) {
        hasInitialized.current = true;
        if (expenseItemsCache.has(cacheKey)) {
          setData(expenseItemsCache.get(cacheKey)!);
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
        const response = await expenseItemsApi.getAll();
        expenseItemsCache.set(cacheKey, response);
        setData(response);
      } catch (error) {
        console.error("Error loading expense items:", error);
        setData({ items: [], total_count: 0 });
      } finally {
        setIsLoading(false);
        loadingStates.set(cacheKey, false);
      }
    };

    loadData();
  }, [userId, reloadTrigger, cacheKey]);

  return { ...data, isLoading };
}

export default useExpenseItems;
