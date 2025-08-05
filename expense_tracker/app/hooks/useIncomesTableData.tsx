import { use, useRef } from "react";
import SimpleTable from "~/components/SimpleTable";
import { useAuth } from "~/contexts/AuthContext";
import { formatDate, incomeSourcesApi } from "~/modules/apis";
import { PlusIconOutline } from "~/components/Icons";
import type { IncomeSource, IncomeSourceResponse } from "~/modules/types";

// Manual cache to ensure stability
export const incomeSourcesCache = new Map<
  string,
  Promise<IncomeSourceResponse>
>();

function useIncomesTableData({ reloadTrigger }: { reloadTrigger: number }) {
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
      ? incomeSourcesApi.getAll({ user_id: userId })
      : Promise.resolve({
          sources: [],
          total_count: 0,
        } as IncomeSourceResponse);
    incomeSourcesCache.set(cacheKey, promise);
  }

  return use(incomeSourcesCache.get(cacheKey)!);
}

export function IncomesTableData({
  setIsModalOpen,
  reloadTrigger,
}: {
  setIsModalOpen: (isOpen: boolean) => void;
  reloadTrigger: number;
}) {
  const tableData = useIncomesTableData({
    reloadTrigger,
  });
  return (
    <SimpleTable
      title={new Date().toLocaleDateString("en-US", { month: "long" })}
      description="Click on an income to edit or delete."
      columns={["Source", "Category", "Recurring", "Created At", "Updated At"]}
      data={tableData.sources?.map((income: IncomeSource) => ({
        id: income.id,
        source: income.name,
        category: income.category || "",
        recurring: income.is_recurring ? "Yes" : "No",
        created_at: formatDate(income.created_at),
        updated_at: formatDate(income.updated_at),
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
      onRowClick={() => {}}
    />
  );
}
