import { useEffect, useState, useCallback } from "react";
import { SimpleModal } from "../SimpleModal";
import { DatePicker } from "../DatePicker";
import { Dropdown } from "../Dropdown";
import { TrashIcon, PlusIconOutline } from "../Icons";
import type {
  IncomeCreate,
  IncomeWithDetails,
  IncomeSource,
  IncomeSourceCreate,
} from "~/modules/types";
import { incomeSourcesApi, incomesApi } from "~/modules/apis";

const currencies = [
  { value: "USD", label: "USD" },
  { value: "CLP", label: "CLP" },
  { value: "EUR", label: "EUR" },
];

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

interface IncomeFormData {
  source_id: string;
  amount: number;
  currency: string;
  date: string;
  description: string;
}

interface IncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (income: IncomeCreate) => void;
  userId: string;
  income?: IncomeWithDetails | null; // If provided, edit mode
  sources?: IncomeSource[]; // Pre-loaded sources
  onDelete?: (incomeId: string) => Promise<void>; // Optional delete handler
}

const IncomeModal = ({
  isOpen,
  onClose,
  onSubmit,
  userId,
  income = null,
  sources: preloadedSources = [],
  onDelete,
}: IncomeModalProps) => {
  const isEditMode = !!income;

  // Use preloadedSources directly if available, otherwise use local state
  const [localSources, setLocalSources] = useState<IncomeSource[]>([]);
  const sources =
    preloadedSources && preloadedSources.length > 0
      ? preloadedSources
      : localSources;

  const [incomeForm, setIncomeForm] = useState<IncomeFormData>({
    source_id: "",
    amount: 0,
    currency: "CLP",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  const [showCreateSource, setShowCreateSource] = useState(false);
  const [newSourceForm, setNewSourceForm] = useState({
    name: "",
    category: "",
    is_recurring: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Populate form when income prop changes (edit mode)
  useEffect(() => {
    if (income && isOpen) {
      setIncomeForm({
        source_id: income.source_id,
        amount: income.amount,
        currency: income.currency,
        date: income.date,
        description: income.description || "",
      });
    } else if (!income && isOpen) {
      // Reset form for add mode
      setIncomeForm({
        source_id: "",
        amount: 0,
        currency: "CLP",
        date: new Date().toISOString().split("T")[0],
        description: "",
      });
    }
  }, [income, isOpen]);

  // Fetch sources only if not preloaded
  const fetchSources = useCallback(async () => {
    if (preloadedSources && preloadedSources.length > 0) {
      setLocalSources(preloadedSources);
      return;
    }

    try {
      setError(null);
      const response = await incomeSourcesApi.getAll({ user_id: userId });
      setLocalSources(response.items);
    } catch (error) {
      setError("Failed to fetch income sources");
      console.error("Error fetching income sources:", error);
    }
  }, [userId, preloadedSources]);

  useEffect(() => {
    if (isOpen && userId) {
      fetchSources();
    }
  }, [isOpen, userId, fetchSources]);

  const handleCreateSource = async () => {
    if (!newSourceForm.name.trim()) return;

    setIsLoading(true);
    try {
      setError(null);

      // Check if source already exists
      const existingSource = (sources || []).find(
        (source) =>
          source.name.toLowerCase() === newSourceForm.name.toLowerCase(),
      );

      if (existingSource) {
        setError(`Source "${newSourceForm.name}" already exists`);
        return;
      }

      const newSource = await incomeSourcesApi.create({
        name: newSourceForm.name,
        category: newSourceForm.category,
        is_recurring: newSourceForm.is_recurring,
        user_id: userId,
      } as IncomeSourceCreate);

      // Add to local sources
      setLocalSources((prev) => [...prev, newSource]);

      // Select the new source
      setIncomeForm((prev) => ({ ...prev, source_id: newSource.id }));

      // Reset and hide create form
      setNewSourceForm({ name: "", category: "", is_recurring: false });
      setShowCreateSource(false);
    } catch (error) {
      setError("Failed to create source");
      console.error("Error creating source:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    setError(null);

    try {
      const incomeData: IncomeCreate = {
        source_id: incomeForm.source_id,
        amount: Number(incomeForm.amount),
        currency: incomeForm.currency,
        date: incomeForm.date,
        description: incomeForm.description || undefined,
      };

      if (isEditMode && income) {
        const updatedIncome = await incomesApi.update(income.id, incomeData);
        onSubmit(updatedIncome);
      } else {
        const newIncome = await incomesApi.create(incomeData);
        onSubmit(newIncome);
      }

      onClose();
    } catch (error) {
      setError(`Failed to ${isEditMode ? "update" : "create"} income`);
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} income:`,
        error,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!income) return;

    setIsLoading(true);
    try {
      if (onDelete) {
        await onDelete(income.id);
      } else {
        await incomesApi.delete(income.id);
      }
      onSubmit(income); // Trigger refresh
      onClose();
    } catch (error) {
      setError("Failed to delete income");
      console.error("Error deleting income:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setShowCreateSource(false);
    setNewSourceForm({ name: "", category: "", is_recurring: false });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <SimpleModal isOpen={isOpen} onClose={handleClose}>
      <div className="w-full max-w-md p-6">
        <div className="flex flex-row justify-between items-center mb-6">
          <h2 className="text-2xl text-left">
            {isEditMode ? "Edit Income" : "Add Income"}
          </h2>
          {isEditMode && (
            <div
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded-md p-2"
              onClick={handleDelete}
            >
              <TrashIcon className="w-6 h-6 stroke-gray-500" />
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Source Selection */}
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
              Income Source *
            </label>

            {!showCreateSource ? (
              <div className="space-y-2">
                <Dropdown
                  options={(sources || []).map((source) => ({
                    value: source.id,
                    label: `${source.name} ${
                      source.category ? `(${source.category})` : ""
                    }`,
                  }))}
                  value={incomeForm.source_id}
                  onChange={(value) =>
                    setIncomeForm((prev) => ({ ...prev, source_id: value }))
                  }
                  placeholder="Select a source"
                  disabled={isLoading}
                />

                <button
                  type="button"
                  onClick={() => setShowCreateSource(true)}
                  className="btn-secondary-long"
                  disabled={isLoading}
                >
                  <PlusIconOutline className="w-4 h-4" />
                  Create New Source
                </button>
              </div>
            ) : (
              <div className="space-y-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Source Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newSourceForm.name}
                    onChange={(e) =>
                      setNewSourceForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-200 rounded-lg"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Category
                  </label>
                  <Dropdown
                    options={categories.map((category) => ({
                      value: category,
                      label: category,
                    }))}
                    value={newSourceForm.category}
                    onChange={(value) =>
                      setNewSourceForm((prev) => ({ ...prev, category: value }))
                    }
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={newSourceForm.is_recurring}
                      onChange={(e) =>
                        setNewSourceForm((prev) => ({
                          ...prev,
                          is_recurring: e.target.checked,
                        }))
                      }
                      disabled={isLoading}
                    />
                    <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                  <label className="text-sm text-gray-500">
                    Recurring source
                  </label>
                </div>

                <div className="flex justify-evenly gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateSource(false)}
                    className="btn-secondary"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateSource}
                    className="btn-primary"
                    disabled={isLoading || !newSourceForm.name.trim()}
                  >
                    Create
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Amount and Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                Amount *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={incomeForm.amount || ""}
                onChange={(e) =>
                  setIncomeForm((prev) => ({
                    ...prev,
                    amount: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full p-2 border border-gray-200 rounded-lg"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                Currency
              </label>
              <Dropdown
                options={currencies}
                value={incomeForm.currency}
                onChange={(value) =>
                  setIncomeForm((prev) => ({ ...prev, currency: value }))
                }
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
              Date *
            </label>
            <DatePicker
              value={incomeForm.date}
              onChange={(date) =>
                setIncomeForm((prev) => ({ ...prev, date: date }))
              }
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
              Description
            </label>
            <textarea
              value={incomeForm.description}
              onChange={(e) =>
                setIncomeForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full p-2 border border-gray-200 rounded-lg"
              rows={3}
              placeholder="Optional description..."
              disabled={isLoading}
            />
          </div>

          {/* Submit buttons */}
          <div className="flex justify-evenly gap-4 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={
                isLoading || !incomeForm.source_id || incomeForm.amount <= 0
              }
            >
              {isLoading ? "Saving..." : isEditMode ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </SimpleModal>
  );
};

export { IncomeModal };
