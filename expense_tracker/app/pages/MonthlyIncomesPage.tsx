import { ErrorXIcon } from "~/components/Icons";
import { IncomeModal } from "~/components/Incomes/IncomeModal";
import { LazyIncomeTableWrapper } from "~/components/Incomes/LazyIncomeTable";
import { useAuth } from "~/contexts/AuthContext";
import { useReload } from "~/contexts/ReloadContext";
import { useIncomeData, useIncomeOperations } from "~/hooks";
import { useEffect } from "react";

const MonthlyIncomesPage = () => {
  const { user } = useAuth();
  const { onReloadRequest } = useReload();

  // Data management - simplified
  const {
    isLoading,
    error,
    tableData,
    allIncomes,
    sources,
    guestIncomes,
    fetchIncomeData,
  } = useIncomeData();

  // Income operations
  const {
    isModalOpen,
    isEditModalOpen,
    selectedIncome,
    setIsModalOpen,
    setIsEditModalOpen,
    setSelectedIncome,
    handleAddIncome,
    handleEditIncome,
    handleDeleteIncome,
    handleRowClick,
  } = useIncomeOperations();

  // Set up reload callback
  useEffect(() => {
    onReloadRequest(() => fetchIncomeData(true));
  }, [onReloadRequest, fetchIncomeData]);

  // Error state
  if (error) {
    return (
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-800 min-h-[420px] overflow-x-auto">
        <div className="flex flex-col items-center justify-center h-96">
          <div className="alert alert-error flex items-center gap-2 justify-center">
            <ErrorXIcon className="w-6 h-6" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => fetchIncomeData(true)}
            className="mt-2 btn-secondary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <LazyIncomeTableWrapper
        tableData={tableData}
        onAddIncome={() => setIsModalOpen(true)}
        onRowClick={(row) =>
          handleRowClick(row, allIncomes || [], guestIncomes)
        }
        isLoading={isLoading}
      />

      {/* Add Income Modal */}
      <IncomeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async (incomeData) => {
          await handleAddIncome(
            incomeData,
            {
              updateTableData: () => fetchIncomeData(true), // Refresh data after add
              guestIncomes,
              guestIncomeSources: sources,
            },
            () => fetchIncomeData(true),
          );
        }}
        userId={user?.id || "mock-user-id"}
        sources={sources}
      />

      {/* Edit Income Modal */}
      <IncomeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedIncome(null);
        }}
        onSubmit={async (incomeData) => {
          await handleEditIncome(
            incomeData,
            {
              updateTableData: () => fetchIncomeData(true), // Refresh data after edit
              guestIncomes,
              guestIncomeSources: sources,
            },
            () => fetchIncomeData(true),
          );
        }}
        userId={user?.id || "mock-user-id"}
        income={selectedIncome}
        sources={sources}
        onDelete={async (incomeId) => {
          await handleDeleteIncome(
            incomeId,
            {
              updateTableData: () => fetchIncomeData(true), // Refresh data after delete
              guestIncomes,
            },
            () => fetchIncomeData(true),
          );
        }}
      />
    </div>
  );
};

export { MonthlyIncomesPage };
