import { ErrorXIcon } from "~/components/Icons";
import { ExpenseModal } from "~/components/ExpenseModal";
import { MonthlyCards, MonthlyCharts } from "~/components/Expenses/Monthly";

import {
  CardsSkeleton,
  ChartsTableSkeleton,
} from "~/components/SkeletonLoader";
import { useAuth } from "~/contexts/AuthContext";
import { useMonthlyData, useExpenseOperations } from "~/hooks";

export default function MonthlyExpensesPage() {
  const { user } = useAuth();

  // Data management
  const {
    isCardsLoading,
    isChartsLoading,
    isTableLoading,
    error,
    cards,
    tableData,
    donutGraphData,
    allExpenses,
    guestExpenses,
    guestExpenseItems,
    fetchMonthlyData,
    addDemoExpense,
    updateDemoExpense,
    deleteDemoExpense,
    updateTableAndChartData,
  } = useMonthlyData();

  // Expense operations
  const {
    isModalOpen,
    isEditModalOpen,
    selectedExpense,
    setIsModalOpen,
    setIsEditModalOpen,
    setSelectedExpense,
    handleAddExpense,
    handleEditExpense,
    handleDeleteExpense,
    handleRowClick,
  } = useExpenseOperations();

  // Error state
  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="alert alert-error flex items-center gap-2 justify-center">
          <ErrorXIcon className="w-6 h-6" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="sm:p-6">
      {/* Cards Section */}
      {isCardsLoading ? <CardsSkeleton /> : <MonthlyCards cards={cards} />}

      {/* Charts and Table Section */}
      {isChartsLoading || isTableLoading ? (
        <ChartsTableSkeleton />
      ) : (
        <MonthlyCharts
          donutGraphData={donutGraphData}
          tableData={tableData}
          onAddExpense={() => setIsModalOpen(true)}
          onRowClick={(row) => handleRowClick(row, allExpenses, guestExpenses)}
        />
      )}

      {/* Add Expense Modal */}
      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(expenseData) =>
          handleAddExpense(
            expenseData,
            {
              addDemoExpense,
              updateTableAndChartData,
              guestExpenses,
            },
            () => fetchMonthlyData(true),
          )
        }
        userId={user?.id || "mock-user-id"}
        items={guestExpenseItems}
      />

      {/* Edit Expense Modal */}
      <ExpenseModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedExpense(null);
        }}
        onSubmit={(expenseData) =>
          handleEditExpense(
            expenseData,
            {
              updateDemoExpense,
              updateTableAndChartData,
              guestExpenses,
            },
            () => fetchMonthlyData(true),
          )
        }
        userId={user?.id || "mock-user-id"}
        expense={selectedExpense}
        items={guestExpenseItems}
        onDelete={(expenseId) =>
          handleDeleteExpense(
            expenseId,
            {
              deleteDemoExpense,
              updateTableAndChartData,
              guestExpenses,
            },
            () => fetchMonthlyData(true),
          )
        }
      />
    </div>
  );
}
