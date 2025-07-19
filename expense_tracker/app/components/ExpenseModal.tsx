import { useEffect, useState, useCallback } from "react";
import { SimpleModal } from "./SimpleModal";
import { DatePicker } from "./DatePicker";
import { Dropdown } from "./Dropdown";
import { TrashIcon, PlusIconOutline } from "./Icons";
import type {
  ExpenseCreate,
  ExpenseWithDetails,
  ExpenseItem,
  ExpenseItemCreate,
} from "~/modules/types";
import { expenseItemsApi, expensesApi } from "~/modules/apis";

const currencies = [
  { value: "USD", label: "USD" },
  { value: "CLP", label: "CLP" },
  { value: "EUR", label: "EUR" },
];

const categories = [
  "Debt",
  "Food",
  "Transportation",
  "Housing",
  "Utilities",
  "Entertainment",
  "Healthcare",
  "Shopping",
  "Education",
  "Travel",
  "Other",
];

interface ExpenseFormData {
  item_id: string;
  amount: number;
  currency: string;
  date: string;
}

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (expense: ExpenseCreate) => void;
  userId: string;
  expense?: ExpenseWithDetails | null; // If provided, edit mode
  items?: ExpenseItem[]; // Pre-loaded items
  onDelete?: (expenseId: string) => Promise<void>; // Optional delete handler
}

const ExpenseModal = ({
  isOpen,
  onClose,
  onSubmit,
  userId,
  expense = null,
  items: preloadedItems = [],
  onDelete,
}: ExpenseModalProps) => {
  const isEditMode = !!expense;

  // Use preloadedItems directly if available, otherwise use local state
  const [localItems, setLocalItems] = useState<ExpenseItem[]>([]);
  const items =
    preloadedItems && preloadedItems.length > 0 ? preloadedItems : localItems;

  const [expenseForm, setExpenseForm] = useState<ExpenseFormData>({
    item_id: "",
    amount: 0,
    currency: "CLP",
    date: new Date().toISOString().split("T")[0],
  });

  const [showCreateItem, setShowCreateItem] = useState(false);
  const [newItemForm, setNewItemForm] = useState({
    name: "",
    category: "",
    is_fixed: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Populate form when expense prop changes (edit mode)
  useEffect(() => {
    if (expense && isOpen) {
      setExpenseForm({
        item_id: expense.item_id,
        amount: expense.amount,
        currency: expense.currency,
        date: expense.date,
      });
    } else if (!expense && isOpen) {
      // Reset form for add mode
      setExpenseForm({
        item_id: "",
        amount: 0,
        currency: "CLP",
        date: new Date().toISOString().split("T")[0],
      });
    }
  }, [expense, isOpen]);

  // Fetch items only if not preloaded
  const fetchItems = useCallback(async () => {
    if (preloadedItems && preloadedItems.length > 0) return;

    try {
      const response = await expenseItemsApi.getAll({ user_id: userId });
      setLocalItems(response.items);
    } catch (error) {
      setError("Failed to fetch expense items");
      console.error("Error fetching expense items:", error);
    }
  }, [userId, preloadedItems?.length]);

  useEffect(() => {
    if (isOpen && userId) {
      fetchItems();
    }
  }, [isOpen, userId, fetchItems]);

  const handleCreateItem = async () => {
    if (!newItemForm.name.trim()) return;

    setIsLoading(true);
    try {
      setError(null);

      // Check if item already exists
      const existingItem = (items || []).find(
        (item) => item.name.toLowerCase() === newItemForm.name.toLowerCase(),
      );

      if (existingItem) {
        setError(`Item "${newItemForm.name}" already exists`);
        return;
      }

      const newItem = await expenseItemsApi.create({
        name: newItemForm.name,
        category: newItemForm.category,
        is_fixed: newItemForm.is_fixed,
        user_id: userId,
      } as ExpenseItemCreate);

      // Add to local items
      setLocalItems((prev) => [...prev, newItem]);

      // Select the new item
      setExpenseForm((prev) => ({ ...prev, item_id: newItem.id }));

      // Reset and hide create form
      setNewItemForm({ name: "", category: "", is_fixed: false });
      setShowCreateItem(false);
    } catch (error) {
      setError("Failed to create item");
      console.error("Error creating item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    setError(null);

    try {
      const expenseData: ExpenseCreate = {
        item_id: expenseForm.item_id,
        amount: Number(expenseForm.amount),
        currency: expenseForm.currency,
        date: expenseForm.date,
      };

      if (isEditMode && expense) {
        const updatedExpense = await expensesApi.update(
          expense.id,
          expenseData,
        );
        onSubmit(updatedExpense);
      } else {
        const newExpense = await expensesApi.create(expenseData);
        onSubmit(newExpense);
      }

      onClose();
    } catch (error) {
      setError(`Failed to ${isEditMode ? "update" : "create"} expense`);
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} expense:`,
        error,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!expense) return;

    setIsLoading(true);
    try {
      if (onDelete) {
        await onDelete(expense.id);
      } else {
        await expensesApi.delete(expense.id);
      }
      onSubmit(expense); // Trigger refresh
      onClose();
    } catch (error) {
      setError("Failed to delete expense");
      console.error("Error deleting expense:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setShowCreateItem(false);
    setNewItemForm({ name: "", category: "", is_fixed: false });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <SimpleModal isOpen={isOpen} onClose={handleClose}>
      <div className="w-full max-w-md p-6">
        <div className="flex flex-row justify-between items-center mb-6">
          <h2 className="text-2xl text-left">
            {isEditMode ? "Edit Expense" : "Add Expense"}
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
          {/* Item Selection */}
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
              Expense Item *
            </label>

            {!showCreateItem ? (
              <div className="space-y-2">
                <Dropdown
                  options={(items || []).map((item) => ({
                    value: item.id,
                    label: `${item.name} ${
                      item.category ? `(${item.category})` : ""
                    }`,
                  }))}
                  value={expenseForm.item_id}
                  onChange={(value) =>
                    setExpenseForm((prev) => ({ ...prev, item_id: value }))
                  }
                  placeholder="Select an item"
                  disabled={isLoading}
                />

                <button
                  type="button"
                  onClick={() => setShowCreateItem(true)}
                  className="btn-secondary-long"
                  disabled={isLoading}
                >
                  <PlusIconOutline className="w-4 h-4" />
                  Create New Item
                </button>
              </div>
            ) : (
              <div className="space-y-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newItemForm.name}
                    onChange={(e) =>
                      setNewItemForm((prev) => ({
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
                    value={newItemForm.category}
                    onChange={(value) =>
                      setNewItemForm((prev) => ({ ...prev, category: value }))
                    }
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={newItemForm.is_fixed}
                      onChange={(e) =>
                        setNewItemForm((prev) => ({
                          ...prev,
                          is_fixed: e.target.checked,
                        }))
                      }
                      disabled={isLoading}
                    />
                    <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                  <label className="text-sm text-gray-500">
                    Fixed/recurring expense
                  </label>
                </div>

                <div className="flex justify-evenly gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateItem(false)}
                    className="btn-secondary"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateItem}
                    className="btn-primary"
                    disabled={isLoading || !newItemForm.name.trim()}
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
                value={expenseForm.amount || ""}
                onChange={(e) =>
                  setExpenseForm((prev) => ({
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
                value={expenseForm.currency}
                onChange={(value) =>
                  setExpenseForm((prev) => ({ ...prev, currency: value }))
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
              value={expenseForm.date}
              onChange={(date) =>
                setExpenseForm((prev) => ({ ...prev, date: date }))
              }
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
                isLoading || !expenseForm.item_id || expenseForm.amount <= 0
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

export { ExpenseModal };
