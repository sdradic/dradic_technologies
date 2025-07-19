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
  const { user, isGuest } = useAuth();

  // Simplified data management using unified API
  const {
    isLoading,
    error,
    cards,
    tableData,
    donutGraphData,
    guestExpenses,
    guestExpenseItems,
    authenticatedExpenses,
    fetchMonthlyData,
    addDemoExpense,
    updateDemoExpense,
    deleteDemoExpense,
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
      {isLoading ? <CardsSkeleton /> : <MonthlyCards cards={cards} />}

      {/* Charts and Table Section */}
      {isLoading ? (
        <ChartsTableSkeleton />
      ) : (
        <MonthlyCharts
          donutGraphData={donutGraphData}
          tableData={tableData}
          onAddExpense={() => setIsModalOpen(true)}
          onRowClick={(row) => {
            const expenses = isGuest ? guestExpenses : authenticatedExpenses;
            handleRowClick(row, expenses || [], expenses || []);
          }}
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
              updateTableAndChartData: () => fetchMonthlyData(true),
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
              updateTableAndChartData: () => fetchMonthlyData(true),
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
              updateTableAndChartData: () => fetchMonthlyData(true),
              guestExpenses,
            },
            () => fetchMonthlyData(true),
          )
        }
      />
    </div>
  );
}
