import { use, useRef } from "react";
import { useAuth } from "~/contexts/AuthContext";
import { dashboardApi } from "~/modules/apis";
import type { DashboardDataWithExpenses } from "~/modules/types";

// Manual cache to ensure stability
export const expensesCache = new Map<
  string,
  Promise<DashboardDataWithExpenses>
>();

function useExpensesData({
  reloadTrigger,
  year,
  month,
  currency,
}: {
  reloadTrigger: number;
  year: number;
  month: number;
  currency: string;
}) {
  const { user } = useAuth();
  const userId = user?.id;
  const lastReloadTrigger = useRef(0);

  // Create a stable cache key including all parameters
  const cacheKey = `${userId || "no-user"}-${year}-${month}-${currency}`;

  // Only clear cache when reloadTrigger actually changes
  if (reloadTrigger !== lastReloadTrigger.current && reloadTrigger > 0) {
    expensesCache.delete(cacheKey);
    lastReloadTrigger.current = reloadTrigger;
  }

  // Get or create the promise
  if (!expensesCache.has(cacheKey)) {
    const promise = userId
      ? dashboardApi
          .getMonthlyDashboard(year, month, currency, userId)
          .then((res) => ({
            year: res.year,
            month: res.month,
            currency: res.currency,
            cards: res.cards,
            donut_graph: res.donut_graph,
            table: res.table,
            total_expenses: res.total_expenses,
            total_income: res.total_income,
            total_savings: res.total_savings,
            expenses: res.expenses.map((row) => ({
              id: row.id,
              item_name: row.item_name,
              item_category: row.item_category,
              item_is_fixed: row.item_is_fixed,
              user_name: row.user_name,
              user_email: row.user_email,
              group_name: row.group_name,
              item_id: row.item_id,
              date: row.date,
              amount: row.amount,
              currency: row.currency,
              created_at: row.created_at,
            })),
          }))
      : Promise.resolve({
          year,
          month,
          currency,
          cards: [],
          donut_graph: { title: "", description: "", data: [] },
          table: { title: "", description: "", columns: [], data: [] },
          total_expenses: 0,
          total_income: 0,
          total_savings: 0,
          expenses: [],
        } as DashboardDataWithExpenses);
    expensesCache.set(cacheKey, promise);
  }

  return use(expensesCache.get(cacheKey)!);
}

export default useExpensesData;
