import { useCallback, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ApiError, expensesApi } from "../modules/apis";
import type { ExpenseCreate, ExpenseWithDetails } from "../modules/types";

export function useExpenseOperations() {
  const { user, isGuest } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] =
    useState<ExpenseWithDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddExpense = useCallback(
    async (
      expenseData: ExpenseCreate,
      demoOperations?: {
        addDemoExpense: (expenseData: ExpenseCreate) => any;
        updateTableAndChartData: (expenses: ExpenseWithDetails[]) => void;
        guestExpenses: ExpenseWithDetails[];
      },
      fetchMonthlyData?: () => Promise<void>
    ) => {
      try {
        setError(null);

        if (isGuest && demoOperations) {
          // Handle locally for guest users
          const newExpense = demoOperations.addDemoExpense(expenseData);
          const updatedExpenses = [...demoOperations.guestExpenses, newExpense];
          demoOperations.updateTableAndChartData(updatedExpenses);
          setIsModalOpen(false);
        } else if (fetchMonthlyData) {
          // Handle via API for authenticated users
          await expensesApi.create(expenseData);
          await fetchMonthlyData();
          setIsModalOpen(false);
        }
      } catch (err) {
        console.error("Error adding expense:", err);
        setError(
          err instanceof ApiError ? err.message : "Failed to add expense"
        );
      }
    },
    [isGuest]
  );

  const handleEditExpense = useCallback(
    async (
      expenseData: ExpenseCreate,
      demoOperations?: {
        updateDemoExpense: (
          expenseId: string,
          expenseData: ExpenseCreate
        ) => void;
        updateTableAndChartData: (expenses: ExpenseWithDetails[]) => void;
        guestExpenses: ExpenseWithDetails[];
      },
      fetchMonthlyData?: () => Promise<void>
    ) => {
      try {
        setError(null);

        if (isGuest && demoOperations && selectedExpense) {
          // Handle locally for guest users
          demoOperations.updateDemoExpense(selectedExpense.id, expenseData);
          const updatedExpenses = demoOperations.guestExpenses.map((expense) =>
            expense.id === selectedExpense.id
              ? { ...expense, ...expenseData }
              : expense
          );
          demoOperations.updateTableAndChartData(updatedExpenses);
          setIsEditModalOpen(false);
          setSelectedExpense(null);
        } else if (fetchMonthlyData) {
          // Handle via API for authenticated users
          await fetchMonthlyData();
          setIsEditModalOpen(false);
          setSelectedExpense(null);
        }
      } catch (err) {
        console.error("Error updating expense:", err);
        setError(
          err instanceof ApiError ? err.message : "Failed to update expense"
        );
      }
    },
    [isGuest, selectedExpense]
  );

  const handleDeleteExpense = useCallback(
    async (
      expenseId: string,
      demoOperations?: {
        deleteDemoExpense: (expenseId: string) => void;
        updateTableAndChartData: (expenses: ExpenseWithDetails[]) => void;
        guestExpenses: ExpenseWithDetails[];
      },
      fetchMonthlyData?: () => Promise<void>
    ) => {
      try {
        setError(null);

        if (isGuest && demoOperations) {
          // Handle locally for guest users
          demoOperations.deleteDemoExpense(expenseId);
          const updatedExpenses = demoOperations.guestExpenses.filter(
            (expense) => expense.id !== expenseId
          );
          demoOperations.updateTableAndChartData(updatedExpenses);
        } else if (fetchMonthlyData) {
          // Handle via API for authenticated users
          await expensesApi.delete(expenseId);
          await fetchMonthlyData();
        }
      } catch (err) {
        console.error("Error deleting expense:", err);
        setError(
          err instanceof ApiError ? err.message : "Failed to delete expense"
        );
      }
    },
    [isGuest]
  );

  const handleRowClick = useCallback(
    (
      row: { [key: string]: string | number },
      allExpenses: ExpenseWithDetails[],
      guestExpenses?: ExpenseWithDetails[]
    ) => {
      const expenses = isGuest ? guestExpenses : allExpenses;
      const expense = expenses?.find((exp) => exp.id === row.id);

      if (expense) {
        setSelectedExpense(expense);
        setIsEditModalOpen(true);
      }
    },
    [isGuest]
  );

  return {
    // State
    isModalOpen,
    isEditModalOpen,
    selectedExpense,
    error,

    // Actions
    setIsModalOpen,
    setIsEditModalOpen,
    setSelectedExpense,
    handleAddExpense,
    handleEditExpense,
    handleDeleteExpense,
    handleRowClick,
  };
}
