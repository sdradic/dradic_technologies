"use client";

import { useEffect, useState } from "react";
import { incomesApi, incomeSourcesApi } from "@/lib/apis";
import type {
  IncomeWithDetails,
  IncomeSource,
  IncomeCreate,
} from "@/lib/types";
import Loader from "@/components/Loader";
import { AuthGuard } from "@/components/AuthGuard";
import { formatCurrency, formatDate, formatDateForInput } from "@/lib/utils";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function IncomesPage() {
  const { user } = useAuth();
  const [incomes, setIncomes] = useState<IncomeWithDetails[]>([]);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<IncomeWithDetails | null>(
    null
  );
  const [totalAmount, setTotalAmount] = useState(0);
  const [currency, setCurrency] = useState("CLP");

  // Form state
  const [formData, setFormData] = useState({
    source_id: "",
    date: formatDateForInput(new Date()),
    amount: "",
    currency: "CLP",
    description: "",
  });

  // Source form state
  const [sourceFormData, setSourceFormData] = useState({
    name: "",
    category: "",
    is_recurring: false,
  });

  useEffect(() => {
    loadIncomes();
    loadIncomeSources();
  }, [currency]);

  const loadIncomes = async () => {
    try {
      setIsLoading(true);
      const response = await incomesApi.getAll({ currency });
      setIncomes(response.incomes);
      setTotalAmount(response.summary.total_amount);
    } catch (error) {
      console.error("Failed to load incomes:", error);
      toast.error("Failed to load incomes");
    } finally {
      setIsLoading(false);
    }
  };

  const loadIncomeSources = async () => {
    try {
      const response = await incomeSourcesApi.getAll();
      setIncomeSources(response.sources);
    } catch (error) {
      console.error("Failed to load income sources:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.source_id || !formData.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const incomeData: IncomeCreate = {
        source_id: formData.source_id,
        date: formData.date,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        description: formData.description || undefined,
      };

      if (editingIncome) {
        await incomesApi.update(editingIncome.id, incomeData);
        toast.success("Income updated successfully");
      } else {
        await incomesApi.create(incomeData);
        toast.success("Income created successfully");
      }

      setIsModalOpen(false);
      resetForm();
      loadIncomes();
    } catch (error) {
      console.error("Failed to save income:", error);
      toast.error("Failed to save income");
    }
  };

  const handleSourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sourceFormData.name || !user) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await incomeSourcesApi.create({
        name: sourceFormData.name,
        category: sourceFormData.category || undefined,
        is_recurring: sourceFormData.is_recurring,
        user_id: user.id,
      });
      toast.success("Income source created successfully");
      setIsSourceModalOpen(false);
      setSourceFormData({ name: "", category: "", is_recurring: false });
      loadIncomeSources();
    } catch (error) {
      console.error("Failed to create income source:", error);
      toast.error("Failed to create income source");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this income?")) {
      return;
    }

    try {
      await incomesApi.delete(id);
      toast.success("Income deleted successfully");
      loadIncomes();
    } catch (error) {
      console.error("Failed to delete income:", error);
      toast.error("Failed to delete income");
    }
  };

  const handleEdit = (income: IncomeWithDetails) => {
    setEditingIncome(income);
    setFormData({
      source_id: income.source_id,
      date: income.date,
      amount: income.amount.toString(),
      currency: income.currency,
      description: income.description || "",
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      source_id: "",
      date: formatDateForInput(new Date()),
      amount: "",
      currency: "CLP",
      description: "",
    });
    setEditingIncome(null);
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
            Incomes
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
              onClick={() => setIsSourceModalOpen(true)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              + New Source
            </button>
            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              + New Income
            </button>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Incomes
          </h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
            {formatCurrency(totalAmount, currency)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {incomes.length} income{incomes.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Incomes Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            {incomes.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Description
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
                  {incomes.map((income) => (
                    <tr
                      key={income.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {income.source_name}
                        {income.source_is_recurring && (
                          <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                            ↻
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {income.source_category || "Uncategorized"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(income.date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {income.description || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 dark:text-green-400 font-medium">
                        {formatCurrency(income.amount, income.currency)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(income)}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(income.id)}
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
                  No incomes found. Create your first income!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Income Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {editingIncome ? "Edit Income" : "New Income"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Income Source *
                </label>
                <select
                  value={formData.source_id}
                  onChange={(e) =>
                    setFormData({ ...formData, source_id: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select a source</option>
                  {incomeSources.map((source) => (
                    <option key={source.id} value={source.id}>
                      {source.name} {source.category && `(${source.category})`}
                      {source.is_recurring && " ↻"}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  rows={3}
                />
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
                  {editingIncome ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Source Modal */}
      {isSourceModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              New Income Source
            </h2>
            <form onSubmit={handleSourceSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={sourceFormData.name}
                  onChange={(e) =>
                    setSourceFormData({
                      ...sourceFormData,
                      name: e.target.value,
                    })
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
                  value={sourceFormData.category}
                  onChange={(e) =>
                    setSourceFormData({
                      ...sourceFormData,
                      category: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_recurring"
                  checked={sourceFormData.is_recurring}
                  onChange={(e) =>
                    setSourceFormData({
                      ...sourceFormData,
                      is_recurring: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <label
                  htmlFor="is_recurring"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Recurring Income
                </label>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsSourceModalOpen(false);
                    setSourceFormData({
                      name: "",
                      category: "",
                      is_recurring: false,
                    });
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
