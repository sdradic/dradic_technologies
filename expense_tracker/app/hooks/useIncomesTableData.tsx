import { use, useRef } from "react";
import SimpleTable from "~/components/SimpleTable";
import { useAuth } from "~/contexts/AuthContext";
import { dashboardApi } from "~/modules/apis";
import { PlusIconOutline } from "~/components/Icons";
import type {
  DashboardTableRowWithRecurring,
  Income,
  DashboardTable,
} from "~/modules/types";
import { months } from "~/modules/store";

// Manual cache to ensure stability
export const incomeSourcesCache = new Map<string, Promise<DashboardTable>>();

function useIncomesTableData({
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

  // Create a stable cache key
  const cacheKey = userId || "no-user";

  // Only clear cache when reloadTrigger actually changes
  if (reloadTrigger !== lastReloadTrigger.current && reloadTrigger > 0) {
    incomeSourcesCache.delete(cacheKey);
    lastReloadTrigger.current = reloadTrigger;
  }

  // Get or create the promise
  if (!incomeSourcesCache.has(cacheKey)) {
    const promise = userId
      ? dashboardApi.getMonthlyIncomeDashboard(year, month, "CLP", userId)
      : Promise.resolve({
          title: "",
          description: "",
          columns: [],
          data: [],
        } as DashboardTable);
    incomeSourcesCache.set(cacheKey, promise);
  }

  return use(incomeSourcesCache.get(cacheKey)!);
}

export function IncomesTableData({
  setIsModalOpen,
  reloadTrigger,
  setSelectedIncome,
  year,
  month,
}: {
  setIsModalOpen: (isOpen: boolean) => void;
  reloadTrigger: number;
  setSelectedIncome: (income: Income | null) => void;
  year: number;
  month: number;
}) {
  const tableData = useIncomesTableData({
    reloadTrigger,
    year,
    month,
  });

  return (
    <SimpleTable
      title={`${months[month - 1]} ${year}`}
      description="Click on an income to edit or delete."
      columns={[
        "Source",
        "Category",
        "Amount",
        "Date",
        "Description",
        "Recurring",
      ]}
      data={tableData.data.map((income) => ({
        id: income.id,
        source: income.name,
        category: income.category,
        amount: income.amount,
        date: income.date,
        description: income.description,
        recurring:
          "recurring" in income
            ? (income as DashboardTableRowWithRecurring).recurring
              ? "Yes"
              : "No"
            : "N/A",
      }))}
      hasButton={true}
      buttonProps={{
        buttonText: "Add income",
        buttonIcon: <PlusIconOutline className="w-6 h-6 stroke-white" />,
        buttonClassName: "btn-primary",
        onClick: () => setIsModalOpen(true),
      }}
      tableContainerClassName="w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-800 min-h-0 sm:min-h-[420px] overflow-x-auto"
      tableClassName="w-full p-6"
      onRowClick={(row) => {
        // For now, pass null to indicate we're adding a new income
        // In the future, you might want to fetch the actual income data
        setSelectedIncome(null);
        setIsModalOpen(true);
      }}
    />
  );
}
