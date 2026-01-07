"use client";

import { useEffect, useState } from "react";
import { gymActivitiesApi } from "@/lib/apis";
import type { GymDashboardStats } from "@/lib/types";
import Loader from "@/components/Loader";
import { AuthGuard } from "@/components/AuthGuard";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function DashboardPage() {
  const [stats, setStats] = useState<GymDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setIsLoading(true);
      const data = await gymActivitiesApi.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
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

  if (!stats) {
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

  // Prepare data for activities by date chart (Line Chart)
  const sortedDates = Object.keys(stats.activities_by_date).sort();
  const activitiesChartData = {
    labels: sortedDates.map((date) => {
      const d = new Date(date);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    }),
    datasets: [
      {
        label: "Workouts",
        data: sortedDates.map((date) => stats.activities_by_date[date]),
        borderColor: "rgb(239, 88, 68)",
        backgroundColor: "rgba(239, 88, 68, 0.5)",
        tension: 0.3,
      },
    ],
  };

  // Prepare data for muscle groups chart (Bar Chart)
  const muscleGroups = Object.keys(stats.muscle_groups_distribution);
  const muscleChartData = {
    labels: muscleGroups.map(
      (muscle) => muscle.charAt(0).toUpperCase() + muscle.slice(1)
    ),
    datasets: [
      {
        label: "Training Volume",
        data: muscleGroups.map(
          (muscle) => stats.muscle_groups_distribution[muscle]
        ),
        backgroundColor: "rgba(239, 88, 68, 0.7)",
        borderColor: "rgb(239, 88, 68)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <AuthGuard>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Workouts This Month
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {stats.total_workouts_this_month}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Most Trained Muscle
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2 capitalize">
              {stats.most_trained_muscle || "N/A"}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Weight Lifted
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {stats.total_weight_lifted?.toFixed(0) || "0"} kg
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activities by Date */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Activities (Last 30 Days)
            </h2>
            {sortedDates.length > 0 ? (
              <Line
                data={activitiesChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1,
                      },
                    },
                  },
                }}
              />
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No activity data yet
              </p>
            )}
          </div>

          {/* Muscle Groups Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Muscle Groups Trained
            </h2>
            {muscleGroups.length > 0 ? (
              <Bar
                data={muscleChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No muscle group data yet
              </p>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
