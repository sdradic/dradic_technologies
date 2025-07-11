import { useEffect, useState } from "react";
import { SimpleModal } from "./SimpleModal";
import { DatePicker } from "./DatePicker";
import { Dropdown } from "./Dropdown";
import type {
  IncomeCreate,
  IncomeWithDetails,
  IncomeSource,
} from "~/modules/types";
import { incomeSourcesApi, incomesApi } from "~/modules/apis";
import { TrashIcon } from "./Icons";

const currencies = [
  { value: "USD", label: "USD" },
  { value: "CLP", label: "CLP" },
  { value: "EUR", label: "EUR" },
];

interface IncomeFormData {
  source_id: string;
  amount: number;
  currency: string;
  date: string;
  description: string;
}

interface EditIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (income: IncomeCreate) => void;
  userId: string;
  income: IncomeWithDetails | null;
  sources?: IncomeSource[]; // Pre-loaded sources
}

const EditIncomeModal = ({
  isOpen,
  onClose,
  onSubmit,
  userId,
  income,
  sources: preloadedSources = [],
}: EditIncomeModalProps) => {
  const [incomeForm, setIncomeForm] = useState<IncomeFormData>({
    source_id: "",
    amount: 0,
    currency: "CLP",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });
  // Use preloadedSources directly if available, otherwise use local state
  const [localSources, setLocalSources] = useState<IncomeSource[]>([]);
  const sources = preloadedSources.length > 0 ? preloadedSources : localSources;
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Populate form when income prop changes
  useEffect(() => {
    if (income && isOpen) {
      setIncomeForm({
        source_id: income.source_id,
        amount: income.amount,
        currency: income.currency,
        date: income.date,
        description: income.description || "",
      });
    }
  }, [income, isOpen]);

  // Fetch sources only if not preloaded
  useEffect(() => {
    const fetchSources = async () => {
      try {
        const response = await incomeSourcesApi.getAll(userId);
        setLocalSources(response.items);
      } catch (error) {
        setError("Failed to fetch income sources");
        console.error("Error fetching income sources:", error);
      }
    };

    if (isOpen && userId && preloadedSources.length === 0) {
      fetchSources();
    }
  }, [userId, isOpen, preloadedSources.length]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!income) return;

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

      const updatedIncome = await incomesApi.update(income.id, incomeData);
      onSubmit(updatedIncome);
      onClose();
    } catch (error) {
      setError("Failed to update income");
      console.error("Error updating income:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const handleDelete = async () => {
    if (!income) return;
    await incomesApi.delete(income.id);
    onSubmit(income);
    onClose();
  };

  if (!income) return null;

  return (
    <SimpleModal isOpen={isOpen} onClose={handleClose}>
      <div className="w-full max-w-md p-6">
        <div className="flex flex-row justify-between items-center mb-6">
          <h2 className="text-2xl text-left">Edit Income</h2>
          <div
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded-md p-2"
            onClick={handleDelete}
          >
            <TrashIcon className="w-6 h-6 stroke-gray-500" />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
              Income Source *
            </label>
            <Dropdown
              options={sources.map((source) => ({
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
          </div>

          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
              Amount *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={incomeForm.amount}
              onChange={(e) =>
                setIncomeForm((prev) => ({
                  ...prev,
                  amount: parseFloat(e.target.value) || 0,
                }))
              }
              className="input-primary w-full"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
              Currency *
            </label>
            <Dropdown
              options={currencies}
              value={incomeForm.currency}
              onChange={(value) =>
                setIncomeForm((prev) => ({ ...prev, currency: value }))
              }
              placeholder="Select currency"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
              Date *
            </label>
            <DatePicker
              value={incomeForm.date}
              onChange={(date) => setIncomeForm((prev) => ({ ...prev, date }))}
              disabled={isLoading}
            />
          </div>

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
              className="input-primary w-full"
              rows={3}
              placeholder="Optional description"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary flex-1"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </SimpleModal>
  );
};

export { EditIncomeModal };
