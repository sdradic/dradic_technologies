import { useState, useEffect } from "react";
import { SimpleModal } from "./SimpleModal";
import { Dropdown } from "./Dropdown";
import { DatePicker } from "./DatePicker";
import { expenseItemsApi, incomeSourcesApi } from "~/modules/apis";
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
  const [needsNewItem, setNeedsNewItem] = useState(false);
  const [isGroupExpense, setIsGroupExpense] = useState(false);
  const [groupMembers, setGroupMembers] = useState<
    Array<{ id: string; name: string; percentage: number }>
  >([]);

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
      setNeedsNewItem(false);
      setIsGroupExpense(false);
      setGroupMembers([]);
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
    if (mode === "income" && !formData.sourceId && !needsNewItem) {
      newErrors.sourceId = "Income source is required";
    }
    if (mode === "expense" && !formData.itemId && !needsNewItem) {
      newErrors.itemId = "Expense item is required";
    }

    // Name validation when creating new items
    if (needsNewItem && !formData.name.trim()) {
      newErrors.name =
        mode === "expense"
          ? "Item name is required"
          : "Source name is required";
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

    // Group expense validation
    if (mode === "expense" && isGroupExpense) {
      if (groupMembers.length === 0) {
        newErrors.groupMembers =
          "At least one group member is required for group expenses";
      } else {
        const totalPercentage = groupMembers.reduce(
          (sum, member) => sum + member.percentage,
          0,
        );
        if (totalPercentage !== 100) {
          newErrors.groupMembers = "Group member percentages must total 100%";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
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
          // Check if we need to create a new income source first
          if (needsNewItem && formData.name) {
            const newSource = await incomeSourcesApi.create({
              name: formData.name,
              category: formData.category || undefined,
              is_recurring: formData.isRecurring,
              user_id: userId || "",
            });

            saveData = {
              source_id: newSource.id,
              amount: Number(formData.amount),
              currency: formData.currency,
              date: formData.date,
              description: formData.description || undefined,
            } as IncomeCreate;
          } else {
            saveData = {
              source_id: formData.sourceId,
              amount: Number(formData.amount),
              currency: formData.currency,
              date: formData.date,
              description: formData.description || undefined,
            } as IncomeCreate;
          }
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
          // Check if we need to create a new expense item first
          if (needsNewItem && formData.name) {
            const newItem = await expenseItemsApi.create({
              name: formData.name,
              category: formData.category || undefined,
              is_fixed: formData.isFixed,
              user_id: userId || "",
            });

            saveData = {
              item_id: newItem.id,
              date: formData.date,
              amount: Number(formData.amount),
              currency: formData.currency,
            } as ExpenseCreate;
          } else {
            saveData = {
              item_id: formData.itemId,
              date: formData.date,
              amount: Number(formData.amount),
              currency: formData.currency,
            } as ExpenseCreate;
          }

          // Add group data if it's a group expense
          if (isGroupExpense) {
            saveData.isGroupExpense = true;
            saveData.groupMembers = groupMembers;
          }
          break;
      }

      // Add mode to the data so the parent knows what was saved
      saveData.mode = mode;
      onSave(saveData);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving:", error);
      // TODO: Add proper error handling
    }
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
              options={[
                ...incomeSources.map((source) => ({
                  value: source.id,
                  label: source.name,
                })),
                { value: "new", label: "+ Create new source" },
              ]}
              value={needsNewItem ? "new" : formData.sourceId}
              onChange={(value) => {
                if (value === "new") {
                  setNeedsNewItem(true);
                  setFormData((prev) => ({ ...prev, sourceId: "" }));
                } else {
                  setNeedsNewItem(false);
                  setFormData((prev) => ({ ...prev, sourceId: value }));
                }
              }}
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
              options={[
                ...expenseItems.map((item) => ({
                  value: item.id,
                  label: item.name,
                })),
                { value: "new", label: "+ Create new item" },
              ]}
              value={needsNewItem ? "new" : formData.itemId}
              onChange={(value) => {
                if (value === "new") {
                  setNeedsNewItem(true);
                  setFormData((prev) => ({ ...prev, itemId: "" }));
                } else {
                  setNeedsNewItem(false);
                  setFormData((prev) => ({ ...prev, itemId: value }));
                }
              }}
              placeholder="Select an item"
              className={errors.itemId ? "border-red-500" : ""}
            />
            {errors.itemId && (
              <p className="text-red-500 text-sm mt-1">{errors.itemId}</p>
            )}
          </div>
        )}

        {/* Name Input for Source/Item Creation */}
        {(["income-source", "expense-item"].includes(mode) || needsNewItem) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {mode === "expense" || mode === "expense-item"
                ? "Item Name"
                : "Source Name"}{" "}
              <span className="text-red-500">*</span>
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
              placeholder={
                mode === "expense" || mode === "expense-item"
                  ? "Enter item name"
                  : "Enter source name"
              }
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
        {/* Group Expense Toggle (only for expenses) */}
        {mode === "expense" && (
          <div className="flex items-center space-x-3">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isGroupExpense}
                  onChange={(e) => {
                    setIsGroupExpense(e.target.checked);
                    if (!e.target.checked) {
                      setGroupMembers([]);
                    }
                  }}
                  className="sr-only"
                />
                <div
                  className={`w-11 h-6 rounded-full transition-colors ${
                    isGroupExpense
                      ? "bg-primary-600"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                      isGroupExpense ? "translate-x-5" : "translate-x-0.5"
                    } translate-y-0.5`}
                  />
                </div>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                Group expense
              </span>
            </label>
          </div>
        )}

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

        {/* Group Members Percentage Distribution */}
        {isGroupExpense && mode === "expense" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Group Members & Percentage Distribution
            </label>
            <div className="space-y-2">
              {groupMembers.map((member, index) => (
                <div key={member.id} className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                    {member.name}
                  </span>
                  <input
                    type="number"
                    value={member.percentage}
                    onChange={(e) => {
                      const newPercentage = Math.max(
                        0,
                        Math.min(100, Number(e.target.value)),
                      );
                      setGroupMembers((prev) =>
                        prev.map((m, i) =>
                          i === index ? { ...m, percentage: newPercentage } : m,
                        ),
                      );
                    }}
                    className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              ))}
              {groupMembers.length > 0 && (
                <div className="text-sm text-gray-500 mt-2">
                  Total:{" "}
                  {groupMembers.reduce(
                    (sum, member) => sum + member.percentage,
                    0,
                  )}
                  %
                  {groupMembers.reduce(
                    (sum, member) => sum + member.percentage,
                    0,
                  ) !== 100 && (
                    <span className="text-red-500 ml-2">(Must equal 100%)</span>
                  )}
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  // For now, add a placeholder member
                  // In a real implementation, you'd select from group members
                  const newMember = {
                    id: `member-${Date.now()}`,
                    name: `Member ${groupMembers.length + 1}`,
                    percentage: 0,
                  };
                  setGroupMembers((prev) => [...prev, newMember]);
                }}
                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
              >
                + Add Member
              </button>
            </div>
            {errors.groupMembers && (
              <p className="text-red-500 text-sm mt-1">{errors.groupMembers}</p>
            )}
          </div>
        )}
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
