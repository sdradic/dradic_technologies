"use client";

import { useEffect, useState } from "react";
import { expensesApi, expenseItemsApi } from "@/lib/apis";
import type {
  ExpenseWithDetails,
  ExpenseItem,
  ExpenseCreate,
} from "@/lib/types";
import Loader from "@/components/Loader";
import { AuthGuard } from "@/components/AuthGuard";
import { formatCurrency, formatDate, formatDateForInput } from "@/lib/utils";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function ExpensesPage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<ExpenseWithDetails[]>([]);
  const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] =
    useState<ExpenseWithDetails | null>(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [currency, setCurrency] = useState("CLP");

  // Form state
  const [formData, setFormData] = useState({
    item_id: "",
    date: formatDateForInput(new Date()),
    amount: "",
    currency: "CLP",
  });

  // Item form state
  const [itemFormData, setItemFormData] = useState({
    name: "",
    category: "",
    is_fixed: false,
  });

  useEffect(() => {
    loadExpenses();
    loadExpenseItems();
  }, [currency]);

  const loadExpenses = async () => {
    try {
      setIsLoading(true);
      const response = await expensesApi.getAll({ currency });
      setExpenses(response.expenses);
      setTotalAmount(response.summary.total_amount);
    } catch (error) {
      console.error("Failed to load expenses:", error);
      toast.error("Failed to load expenses");
    } finally {
      setIsLoading(false);
    }
  };

  const loadExpenseItems = async () => {
    try {
      const response = await expenseItemsApi.getAll();
      setExpenseItems(response.items);
    } catch (error) {
      console.error("Failed to load expense items:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.item_id || !formData.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const expenseData: ExpenseCreate = {
        item_id: formData.item_id,
        date: formData.date,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
      };

      if (editingExpense) {
        await expensesApi.update(editingExpense.id, expenseData);
        toast.success("Expense updated successfully");
      } else {
        await expensesApi.create(expenseData);
        toast.success("Expense created successfully");
      }

      setIsModalOpen(false);
      resetForm();
      loadExpenses();
    } catch (error) {
      console.error("Failed to save expense:", error);
      toast.error("Failed to save expense");
    }
  };

  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!itemFormData.name || !user) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await expenseItemsApi.create({
        name: itemFormData.name,
        category: itemFormData.category || undefined,
        is_fixed: itemFormData.is_fixed,
        user_id: user.id,
      });
      toast.success("Expense item created successfully");
      setIsItemModalOpen(false);
      setItemFormData({ name: "", category: "", is_fixed: false });
      loadExpenseItems();
    } catch (error) {
      console.error("Failed to create expense item:", error);
      toast.error("Failed to create expense item");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) {
      return;
    }

    try {
      await expensesApi.delete(id);
      toast.success("Expense deleted successfully");
      loadExpenses();
    } catch (error) {
      console.error("Failed to delete expense:", error);
      toast.error("Failed to delete expense");
    }
  };

  const handleEdit = (expense: ExpenseWithDetails) => {
    setEditingExpense(expense);
    setFormData({
      item_id: expense.item_id,
      date: expense.date,
      amount: expense.amount.toString(),
      currency: expense.currency,
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      item_id: "",
      date: formatDateForInput(new Date()),
      amount: "",
      currency: "CLP",
    });
    setEditingExpense(null);
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Expenses
          </h1>
          <div className="flex gap-2">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="CLP">CLP</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
            <button
              onClick={() => setIsItemModalOpen(true)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              + New Item
            </button>
            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              + New Expense
            </button>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Expenses
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {formatCurrency(totalAmount, currency)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {expenses.length} expense{expenses.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Expenses Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            {expenses.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {expenses.map((expense) => (
                    <tr
                      key={expense.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {expense.item_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {expense.item_category || "Uncategorized"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(expense.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                        {formatCurrency(expense.amount, expense.currency)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(expense)}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No expenses found. Create your first expense!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {editingExpense ? "Edit Expense" : "New Expense"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expense Item *
                </label>
                <select
                  value={formData.item_id}
                  onChange={(e) =>
                    setFormData({ ...formData, item_id: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select an item</option>
                  {expenseItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} {item.category && `(${item.category})`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Currency *
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  required
                >
                  <option value="CLP">CLP</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  {editingExpense ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Item Modal */}
      {isItemModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              New Expense Item
            </h2>
            <form onSubmit={handleItemSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={itemFormData.name}
                  onChange={(e) =>
                    setItemFormData({ ...itemFormData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={itemFormData.category}
                  onChange={(e) =>
                    setItemFormData({
                      ...itemFormData,
                      category: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_fixed"
                  checked={itemFormData.is_fixed}
                  onChange={(e) =>
                    setItemFormData({
                      ...itemFormData,
                      is_fixed: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <label
                  htmlFor="is_fixed"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Fixed Expense
                </label>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsItemModalOpen(false);
                    setItemFormData({ name: "", category: "", is_fixed: false });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AuthGuard>
  );
}
