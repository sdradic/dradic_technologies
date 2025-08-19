import { useEffect, useRef, useState } from "react";
import SimpleTable from "~/components/SimpleTable";
import { useAuth } from "~/contexts/AuthContext";
import { dashboardApi } from "~/modules/apis";
import { PlusIconOutline } from "~/components/Icons";
import Loader from "~/components/Loader";
import type {
  DashboardTableRowWithRecurring,
  Income,
  DashboardTableWithIncomes,
} from "~/modules/types";
import { months } from "~/modules/store";

// Manual cache to ensure stability
export const incomeDashboardCache = new Map<
  string,
  DashboardTableWithIncomes
>();
const loadingStates = new Map<string, boolean>();

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
  const { table, incomes, isLoading } = useIncomesTableData({
    reloadTrigger,
    year,
    month,
  });

  if (isLoading) {
    return <Loader message="Loading incomes..." />;
  }

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
        table?.data?.map((income) => ({
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
        const fullIncome = incomes?.find((income) => income.id === row.id);
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
