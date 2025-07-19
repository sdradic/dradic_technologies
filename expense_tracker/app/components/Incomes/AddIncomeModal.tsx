import { useCallback, useState } from "react";
import {
  TwoStepFormModal,
  type ItemFormData,
} from "~/components/TwoStepFormModal";
import {
  TransactionForm,
  type TransactionFormData,
} from "~/components/TransactionForm";
import type {
  IncomeCreate,
  IncomeSourceCreate,
  IncomeSource,
} from "~/modules/types";
import { incomeSourcesApi } from "~/modules/apis";

const categories = [
  "Salary",
  "Freelance",
  "Investment",
  "Business",
  "Rental",
  "Bonus",
  "Gift",
  "Other",
];

const currencies = [
  { value: "USD", label: "USD" },
  { value: "CLP", label: "CLP" },
  { value: "EUR", label: "EUR" },
];

interface AddIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (income: IncomeCreate) => void;
  userId: string;
  sources?: IncomeSource[];
}

export const AddIncomeModal = ({
  isOpen,
  onClose,
  onSubmit,
  userId,
  sources: preloadedSources = [],
}: AddIncomeModalProps) => {
  // Use preloadedSources directly if available, otherwise use local state
  const [localSources, setLocalSources] = useState<IncomeSource[]>([]);
  const sources = preloadedSources.length > 0 ? preloadedSources : localSources;

  const [transactionForm, setTransactionForm] = useState<TransactionFormData>({
    amount: 0,
    currency: "CLP",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSources = useCallback(async () => {
    if (preloadedSources.length > 0) return;

    try {
      setError(null);
      const response = await incomeSourcesApi.getAll(userId);
      setLocalSources(response.items);
    } catch (error) {
      setError("Failed to fetch income sources");
      console.error("Error fetching income sources:", error);
    }
  }, [userId, preloadedSources.length]);

  const handleCreateSource = useCallback(
    async (itemData: ItemFormData) => {
      setIsLoading(true);
      try {
        setError(null);

        // Check if source with same name already exists
        const existingSource = sources.find(
          (source) => source.name.toLowerCase() === itemData.name.toLowerCase(),
        );

        if (existingSource) {
          const errorMsg = `Income source "${itemData.name}" already exists. Please choose a different name or select the existing one.`;
          setError(errorMsg);
          throw new Error(errorMsg);
        }

        const newSource = await incomeSourcesApi.create({
          name: itemData.name,
          category: itemData.category,
          is_recurring: itemData.booleanFlag,
          user_id: userId,
        } as IncomeSourceCreate);

        // Add to local state
        setLocalSources((prev: IncomeSource[]) => [...prev, newSource]);

        return { id: newSource.id };
      } catch (error) {
        setError("Failed to create income source");
        console.error("Error creating income source:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [userId],
  );

  const handleTransactionSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      setError(null);
      const incomeData: IncomeCreate = {
        source_id: transactionForm.item_id!,
        amount: Number(transactionForm.amount),
        currency: transactionForm.currency,
        date: transactionForm.date,
        description: transactionForm.description || undefined,
      };

      await onSubmit(incomeData);

      // Reset form
      setTransactionForm({
        amount: 0,
        currency: "CLP",
        date: new Date().toISOString().split("T")[0],
        description: "",
      });

      onClose();
    } catch (error) {
      setError("Failed to create income");
      console.error("Error creating income:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const step1Config = {
    title: "Select or Create Income Source",
    selectLabel: "Select an existing source",
    createButtonText: "Create New Source",
    items: sources,
    onFetchItems: fetchSources,
    categories: categories,
    itemFormLabels: {
      name: "Source Name",
      category: "Category",
      booleanFlag: "This is a recurring income source",
    },
    onCreateItem: handleCreateSource,
  };

  const step2Config = {
    title: "Add Income Details",
    children: (selectedSource: IncomeSource, onBack: () => void) => {
      // Create transaction form with source_id directly included
      const transactionFormWithSource = {
        ...transactionForm,
        item_id: selectedSource?.id,
      };

      return (
        <TransactionForm
          formData={transactionFormWithSource}
          onChange={setTransactionForm}
          onSubmit={handleTransactionSubmit}
          onBack={onBack}
          selectedItem={selectedSource}
          title="Add Income Details"
          submitButtonText="Save Income"
          includeDescription={true}
          isLoading={isLoading}
          error={error}
        />
      );
    },
  };

  return (
    <TwoStepFormModal
      isOpen={isOpen}
      onClose={onClose}
      userId={userId}
      step1Config={step1Config}
      step2Config={step2Config}
      error={error}
      isLoading={isLoading}
    />
  );
};
