import { useCallback, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useDemoData } from "../demo/useDemoData";
import { ApiError, incomesApi } from "../modules/apis";
import type {
  IncomeCreate,
  IncomeSource,
  IncomeWithDetails,
} from "../modules/types";

export function useIncomeOperations() {
  const { isGuest } = useAuth();
  const { addDemoIncome, updateDemoIncome, deleteDemoIncome } = useDemoData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedIncome, setSelectedIncome] =
    useState<IncomeWithDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddIncome = useCallback(
    async (
      incomeData: IncomeCreate,
      demoOperations?: {
        updateTableData: (incomes: IncomeWithDetails[]) => void;
        guestIncomes: IncomeWithDetails[];
        guestIncomeSources: IncomeSource[];
      },
      fetchIncomeData?: () => Promise<void>,
    ) => {
      try {
        setError(null);
        console.log("Adding income:", incomeData);

        if (isGuest && demoOperations) {
          // Handle locally for guest users
          const newIncome = addDemoIncome(
            incomeData,
            demoOperations.guestIncomeSources,
          );
          const updatedIncomes = [...demoOperations.guestIncomes, newIncome];
          demoOperations.updateTableData(updatedIncomes);
          setIsModalOpen(false);
        } else if (fetchIncomeData) {
          // Handle via API for authenticated users
          console.log("Calling incomesApi.create...");
          await incomesApi.create(incomeData);
          console.log("Income created successfully, fetching updated data...");
          await fetchIncomeData();
          setIsModalOpen(false);
        }
      } catch (err) {
        console.error("Error adding income:", err);
        setError(
          err instanceof ApiError ? err.message : "Failed to add income",
        );
      }
    },
    [isGuest, addDemoIncome],
  );

  const handleEditIncome = useCallback(
    async (
      incomeData: IncomeCreate,
      demoOperations?: {
        updateTableData: (incomes: IncomeWithDetails[]) => void;
        guestIncomes: IncomeWithDetails[];
        guestIncomeSources: IncomeSource[];
      },
      fetchIncomeData?: () => Promise<void>,
    ) => {
      try {
        setError(null);
        console.log(
          "Editing income:",
          incomeData,
          "selectedIncome:",
          selectedIncome,
        );

        if (isGuest && demoOperations && selectedIncome) {
          // Handle locally for guest users
          updateDemoIncome(
            selectedIncome.id,
            incomeData,
            demoOperations.guestIncomeSources,
          );
          const updatedIncomes = demoOperations.guestIncomes.map((income) =>
            income.id === selectedIncome.id
              ? {
                  ...income,
                  amount: incomeData.amount,
                  currency: incomeData.currency,
                  date: incomeData.date,
                  description: incomeData.description || "",
                  source_id: incomeData.source_id,
                  source_name:
                    demoOperations.guestIncomeSources.find(
                      (s) => s.id === incomeData.source_id,
                    )?.name || "Unknown",
                  source_category:
                    demoOperations.guestIncomeSources.find(
                      (s) => s.id === incomeData.source_id,
                    )?.category || "",
                  updated_at: new Date().toISOString(),
                }
              : income,
          );
          demoOperations.updateTableData(updatedIncomes);
          setIsEditModalOpen(false);
          setSelectedIncome(null);
        } else if (fetchIncomeData && selectedIncome) {
          // Handle via API for authenticated users
          console.log("Calling incomesApi.update...");
          await incomesApi.update(selectedIncome.id, incomeData);
          console.log("Income updated successfully, fetching updated data...");
          await fetchIncomeData();
          setIsEditModalOpen(false);
          setSelectedIncome(null);
        }
      } catch (err) {
        console.error("Error updating income:", err);
        setError(
          err instanceof ApiError ? err.message : "Failed to update income",
        );
      }
    },
    [isGuest, selectedIncome, updateDemoIncome],
  );

  const handleDeleteIncome = useCallback(
    async (
      incomeId: string,
      demoOperations?: {
        updateTableData: (incomes: IncomeWithDetails[]) => void;
        guestIncomes: IncomeWithDetails[];
      },
      fetchIncomeData?: () => Promise<void>,
    ) => {
      try {
        setError(null);
        console.log("Deleting income:", incomeId);

        if (isGuest && demoOperations) {
          // Handle locally for guest users
          deleteDemoIncome(incomeId);
          const updatedIncomes = demoOperations.guestIncomes.filter(
            (income) => income.id !== incomeId,
          );
          demoOperations.updateTableData(updatedIncomes);
        } else if (fetchIncomeData) {
          // Handle via API for authenticated users
          console.log("Calling incomesApi.delete...");
          await incomesApi.delete(incomeId);
          console.log("Income deleted successfully, fetching updated data...");
          await fetchIncomeData();
        }
      } catch (err) {
        console.error("Error deleting income:", err);
        setError(
          err instanceof ApiError ? err.message : "Failed to delete income",
        );
      }
    },
    [isGuest, deleteDemoIncome],
  );

  const handleRowClick = useCallback(
    (
      row: { [key: string]: string | number },
      allIncomes: IncomeWithDetails[],
      guestIncomes?: IncomeWithDetails[],
    ) => {
      const incomes = isGuest ? guestIncomes : allIncomes;
      const income = incomes?.find((inc) => inc.id === row.id);

      if (income) {
        setSelectedIncome(income);
        setIsEditModalOpen(true);
      }
    },
    [isGuest],
  );

  return {
    // State
    isModalOpen,
    isEditModalOpen,
    selectedIncome,
    error,

    // Actions
    setIsModalOpen,
    setIsEditModalOpen,
    setSelectedIncome,
    handleAddIncome,
    handleEditIncome,
    handleDeleteIncome,
    handleRowClick,
  };
}
