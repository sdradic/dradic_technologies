import { use, useRef } from "react";
import SimpleTable from "~/components/SimpleTable";
import { useAuth } from "~/contexts/AuthContext";
import { dashboardApi } from "~/modules/apis";
import { PlusIconOutline } from "~/components/Icons";
import type {
  DashboardTableRowWithRecurring,
  Income,
  DashboardTableWithIncomes,
} from "~/modules/types";
import { months } from "~/modules/store";

// Manual cache to ensure stability
export const incomeSourcesCache = new Map<
  string,
  Promise<DashboardTableWithIncomes>
>();

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

  // Create a stable cache key including all parameters
  const cacheKey = `${userId || "no-user"}-${year}-${month}-CLP`;

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
          table: {
            title: "",
            description: "",
            columns: [],
            data: [],
          },
          incomes: [],
        } as DashboardTableWithIncomes);
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
  const dashboardData = useIncomesTableData({
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
      data={
        dashboardData?.table?.data?.map((income) => ({
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
        })) || []
      }
      hasButton={true}
      buttonProps={{
        buttonText: "Add income",
        buttonIcon: <PlusIconOutline className="w-6 h-6 stroke-white" />,
        buttonClassName: "btn-primary",
        onClick: () => {
          setSelectedIncome(null);
          setIsModalOpen(true);
        },
      }}
      tableContainerClassName="w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-800 min-h-0 sm:min-h-[420px] overflow-x-auto"
      tableClassName="w-full p-6"
      onRowClick={(row) => {
        // Find the full income object from the incomes array
        const fullIncome = dashboardData?.incomes?.find(
          (income) => income.id === row.id,
        );
        if (fullIncome) {
          // Use the full income object with all required fields
          const incomeToEdit: Income = {
            id: fullIncome.id,
            source_id: fullIncome.source_id,
            amount: fullIncome.amount,
            currency: fullIncome.currency,
            date: fullIncome.date,
            description: fullIncome.description || "",
            created_at: fullIncome.created_at,
            updated_at: fullIncome.updated_at,
          };
          setSelectedIncome(incomeToEdit);
        }
        setIsModalOpen(true);
      }}
    />
  );
}
