"use client";

import { useEffect, useState } from "react";
import { expensesApi } from "@/lib/apis";
import type { DashboardDataWithExpenses } from "@/lib/types";
import Loader from "@/components/Loader";
import { AuthGuard } from "@/components/AuthGuard";
import { getCurrentMonthYear, getMonthName, formatCurrency } from "@/lib/utils";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import toast from "react-hot-toast";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const [dashboardData, setDashboardData] =
    useState<DashboardDataWithExpenses | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(
    getCurrentMonthYear().month
  );
  const [selectedYear, setSelectedYear] = useState(getCurrentMonthYear().year);
  const [currency, setCurrency] = useState("CLP");

  useEffect(() => {
    loadDashboardData();
  }, [selectedMonth, selectedYear, currency]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const data = await expensesApi.getDashboard(
        selectedYear,
        selectedMonth,
        currency
      );
      setDashboardData(data);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
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

  if (!dashboardData) {
    return (
      <AuthGuard>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Failed to load dashboard data
          </p>
        </div>
      </AuthGuard>
    );
  }

  // Prepare data for donut chart
  const chartData = {
    labels: dashboardData.donut_graph.data.map((item) => item.label),
    datasets: [
      {
        data: dashboardData.donut_graph.data.map((item) => item.value),
        backgroundColor: [
          "rgba(239, 88, 68, 0.8)",
          "rgba(251, 146, 60, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(163, 230, 53, 0.8)",
        ],
        borderColor: [
          "rgb(239, 88, 68)",
          "rgb(251, 146, 60)",
          "rgb(251, 191, 36)",
          "rgb(163, 230, 53)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <AuthGuard>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>

          {/* Month/Year/Currency Selector */}
          <div className="flex gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  {getMonthName(month)}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {Array.from({ length: 5 }, (_, i) => selectedYear - 2 + i).map(
                (year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                )
              )}
            </select>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="CLP">CLP</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dashboardData.cards.map((card, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {card.title}
              </h3>
              <p
                className={`text-3xl font-bold mt-2 ${
                  card.title === "Remaining"
                    ? card.value >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                {formatCurrency(card.value, card.currency)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* Chart and Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Donut Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {dashboardData.donut_graph.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {dashboardData.donut_graph.description}
            </p>
            {dashboardData.donut_graph.data.length > 0 ? (
              <div className="flex justify-center">
                <div className="w-64 h-64">
                  <Doughnut
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: {
                          position: "bottom",
                        },
                      },
                    }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No expense data yet
              </p>
            )}
          </div>

          {/* Recent Expenses Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {dashboardData.table.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {dashboardData.table.description}
            </p>
            <div className="overflow-x-auto">
              {dashboardData.table.data.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {dashboardData.table.data.slice(0, 5).map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {row.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          {row.category}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">
                          {row.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No expenses this month
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
