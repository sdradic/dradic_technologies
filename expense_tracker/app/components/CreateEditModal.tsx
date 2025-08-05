import { useState, useEffect } from "react";
import { SimpleModal } from "./SimpleModal";
import { Dropdown } from "./Dropdown";
import { DatePicker } from "./DatePicker";
import type {
  Income,
  IncomeCreate,
  IncomeSource,
  IncomeSourceCreate,
  Expense,
  ExpenseCreate,
  ExpenseItem,
  ExpenseItemCreate,
  IncomeSourceWithUser,
  ExpenseItemWithUser,
} from "../modules/types";

type ModalMode = "income" | "income-source" | "expense" | "expense-item";

interface CreateEditModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  mode: ModalMode;
  editData?: Income | IncomeSource | Expense | ExpenseItem;
  onSave: (
    data: IncomeCreate | IncomeSourceCreate | ExpenseCreate | ExpenseItemCreate,
  ) => void;
  incomeSources?: IncomeSourceWithUser[];
  expenseItems?: ExpenseItemWithUser[];
  userId?: string;
}

const CURRENCY_OPTIONS = [
  { value: "CLP", label: "CLP" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
];

const INCOME_CATEGORY_OPTIONS = [
  { value: "salary", label: "Salary" },
  { value: "freelance", label: "Freelance" },
  { value: "investment", label: "Investment" },
  { value: "business", label: "Business" },
  { value: "other", label: "Other" },
];

const EXPENSE_CATEGORY_OPTIONS = [
  { value: "food", label: "Food" },
  { value: "transport", label: "Transport" },
  { value: "utilities", label: "Utilities" },
  { value: "entertainment", label: "Entertainment" },
  { value: "healthcare", label: "Healthcare" },
  { value: "shopping", label: "Shopping" },
  { value: "other", label: "Other" },
];

export const CreateEditModal = ({
  isModalOpen,
  setIsModalOpen,
  mode,
  editData,
  onSave,
  incomeSources = [],
  expenseItems = [],
  userId = "",
}: CreateEditModalProps) => {
  const [formData, setFormData] = useState({
    // Source/Item fields
    name: "",
    category: "",
    isRecurring: false,
    isFixed: false,

    // Income/Expense fields
    sourceId: "",
    itemId: "",
    amount: "",
    currency: "CLP",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (isModalOpen) {
      if (editData) {
        // Populate form with edit data
        setFormData({
          name:
            (editData as any).name ||
            (editData as any).source_name ||
            (editData as any).item_name ||
            "",
          category:
            (editData as any).category ||
            (editData as any).source_category ||
            (editData as any).item_category ||
            "",
          isRecurring: (editData as any).is_recurring || false,
          isFixed: (editData as any).is_fixed || false,
          sourceId: (editData as any).source_id || "",
          itemId: (editData as any).item_id || "",
          amount: (editData as any).amount?.toString() || "",
          currency: (editData as any).currency || "CLP",
          date:
            (editData as any).date || new Date().toISOString().split("T")[0],
          description: (editData as any).description || "",
        });
      } else {
        // Reset for new entry
        setFormData({
          name: "",
          category: "",
          isRecurring: false,
          isFixed: false,
          sourceId: "",
          itemId: "",
          amount: "",
          currency: "CLP",
          date: new Date().toISOString().split("T")[0],
          description: "",
        });
      }
      setErrors({});
    }
  }, [isModalOpen, editData, mode]);

  const getModalTitle = () => {
    const isEdit = !!editData;
    switch (mode) {
      case "income":
        return isEdit ? "Edit Income" : "Add Income";
      case "income-source":
        return isEdit ? "Edit Income Source" : "Add Income Source";
      case "expense":
        return isEdit ? "Edit Expense" : "Add Expense";
      case "expense-item":
        return isEdit ? "Edit Expense Item" : "Add Expense Item";
      default:
        return "Add Item";
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name validation for sources and items
    if (
      ["income-source", "expense-item"].includes(mode) &&
      !formData.name.trim()
    ) {
      newErrors.name = "Name is required";
    }

    // Source/Item selection for incomes and expenses
    if (mode === "income" && !formData.sourceId) {
      newErrors.sourceId = "Income source is required";
    }
    if (mode === "expense" && !formData.itemId) {
      newErrors.itemId = "Expense item is required";
    }

    // Amount validation for incomes and expenses
    if (["income", "expense"].includes(mode)) {
      if (!formData.amount.trim()) {
        newErrors.amount = "Amount is required";
      } else if (
        isNaN(Number(formData.amount)) ||
        Number(formData.amount) <= 0
      ) {
        newErrors.amount = "Amount must be a positive number";
      }
    }

    // Date validation for incomes and expenses
    if (["income", "expense"].includes(mode) && !formData.date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    let saveData: any;

    switch (mode) {
      case "income-source":
        saveData = {
          name: formData.name,
          category: formData.category || undefined,
          is_recurring: formData.isRecurring,
          user_id: userId || "",
        } as IncomeSourceCreate;
        break;

      case "income":
        saveData = {
          source_id: formData.sourceId,
          amount: Number(formData.amount),
          currency: formData.currency,
          date: formData.date,
          description: formData.description || undefined,
        } as IncomeCreate;
        break;

      case "expense-item":
        saveData = {
          name: formData.name,
          category: formData.category || undefined,
          is_fixed: formData.isFixed,
          user_id: userId || "",
        } as ExpenseItemCreate;
        break;

      case "expense":
        saveData = {
          item_id: formData.itemId,
          date: formData.date,
          amount: Number(formData.amount),
          currency: formData.currency,
        } as ExpenseCreate;
        break;
    }

    onSave(saveData);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setErrors({});
  };

  const renderSourceSection = () => {
    if (!["income-source", "income", "expense-item", "expense"].includes(mode))
      return null;

    return (
      <div className="space-y-4">
        {/* Source/Item Selection for Income/Expense */}
        {mode === "income" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Source Name <span className="text-red-500">*</span>
            </label>
            <Dropdown
              options={incomeSources.map((source) => ({
                value: source.id,
                label: source.name,
              }))}
              value={formData.sourceId}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, sourceId: value }))
              }
              placeholder="Select a source"
              className={errors.sourceId ? "border-red-500" : ""}
            />
            {errors.sourceId && (
              <p className="text-red-500 text-sm mt-1">{errors.sourceId}</p>
            )}
          </div>
        )}

        {mode === "expense" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Item Name <span className="text-red-500">*</span>
            </label>
            <Dropdown
              options={expenseItems.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              value={formData.itemId}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, itemId: value }))
              }
              placeholder="Select an item"
              className={errors.itemId ? "border-red-500" : ""}
            />
            {errors.itemId && (
              <p className="text-red-500 text-sm mt-1">{errors.itemId}</p>
            )}
          </div>
        )}

        {/* Name Input for Source/Item Creation */}
        {["income-source", "expense-item"].includes(mode) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Source Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter source name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
        )}

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <Dropdown
            options={
              mode === "income" || mode === "income-source"
                ? INCOME_CATEGORY_OPTIONS
                : EXPENSE_CATEGORY_OPTIONS
            }
            value={formData.category}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, category: value }))
            }
            placeholder="Select an option"
          />
        </div>

        {/* Recurring Toggle for Income Sources */}
        {mode === "income-source" && (
          <div className="flex items-center space-x-3">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={formData.isRecurring}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isRecurring: e.target.checked,
                    }))
                  }
                  className="sr-only"
                />
                <div
                  className={`w-11 h-6 rounded-full transition-colors ${
                    formData.isRecurring
                      ? "bg-primary-600"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                      formData.isRecurring ? "translate-x-5" : "translate-x-0.5"
                    } translate-y-0.5`}
                  />
                </div>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                Recurring source
              </span>
            </label>
          </div>
        )}

        {/* Fixed Toggle for Expense Items */}
        {mode === "expense-item" && (
          <div className="flex items-center space-x-3">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={formData.isFixed}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isFixed: e.target.checked,
                    }))
                  }
                  className="sr-only"
                />
                <div
                  className={`w-11 h-6 rounded-full transition-colors ${
                    formData.isFixed
                      ? "bg-primary-600"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                      formData.isFixed ? "translate-x-5" : "translate-x-0.5"
                    } translate-y-0.5`}
                  />
                </div>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                Fixed expense
              </span>
            </label>
          </div>
        )}
      </div>
    );
  };

  const renderAmountSection = () => {
    if (!["income", "expense"].includes(mode)) return null;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, amount: e.target.value }))
              }
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                errors.amount ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Currency
            </label>
            <Dropdown
              options={CURRENCY_OPTIONS}
              value={formData.currency}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, currency: value }))
              }
            />
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date <span className="text-red-500">*</span>
          </label>
          <DatePicker
            value={formData.date}
            onChange={(date) => setFormData((prev) => ({ ...prev, date }))}
            className={errors.date ? "border-red-500" : ""}
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white resize-none"
            placeholder="Optional description..."
            rows={3}
          />
        </div>
      </div>
    );
  };

  return (
    <SimpleModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      className="w-full max-w-md"
    >
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
          {getModalTitle()}
        </h2>

        <div className="space-y-6">
          {renderSourceSection()}
          {renderAmountSection()}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-8">
          <button
            type="button"
            onClick={handleCancel}
            className="btn-secondary max-w-24"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn-primary max-w-24"
          >
            Save
          </button>
        </div>
      </div>
    </SimpleModal>
  );
};
