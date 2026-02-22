import { use, useRef } from "react";
import { useAuth } from "~/contexts/AuthContext";
import { dashboardApi } from "~/modules/apis";
import type {
  DashboardDataWithExpenses,
  ExpenseWithDetails,
} from "~/modules/types";

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
      ? dashboardApi.getMonthlyDashboard(year, month, currency).then((res) => {
          const data = res as DashboardDataWithExpenses;
          const expenses = (data.expenses ?? []).map(
            (row: ExpenseWithDetails) => ({
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
            }),
          );
          return {
            year: data.year,
            month: data.month,
            currency: data.currency,
            cards: data.cards,
            donut_graph: data.donut_graph,
            table: data.table,
            total_expenses: data.total_expenses,
            total_income: data.total_income,
            total_savings: data.total_savings,
            expenses,
          };
        })
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
