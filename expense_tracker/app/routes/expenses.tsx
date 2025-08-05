import { HeaderControls } from "~/components/HeaderControls";
import { HeaderButton } from "~/components/HeaderButton";
import { PlusIconOutline, ReloadIcon } from "~/components/Icons";
import { useRef, useState, Suspense, useCallback } from "react";
import { useAuth } from "~/contexts/AuthContext";
import type { DashboardTableRow, DashboardCard } from "~/modules/types";
import { formatDate } from "~/modules/apis";
import Loader from "~/components/Loader";
import SimpleTable from "~/components/SimpleTable";
import { CreateEditModal } from "~/components/CreateEditModal";
import { CardCarrousel } from "~/components/CardCarrousel";
import { Chart } from "chart.js/auto";
import useExpensesData from "~/hooks/useExpensesData";

// Separate component that can suspend
function ExpensesContent({
  reloadTrigger,
  year,
  month,
  currency,
  setIsModalOpen,
}: {
  reloadTrigger: number;
  year: number;
  month: number;
  currency: string;
  setIsModalOpen: (isOpen: boolean) => void;
}) {
  const dashboardData = useExpensesData({
    reloadTrigger,
    year,
    month,
    currency,
  });

  const chartInstanceRef = useRef<Chart | null>(null);

  // Chart ref callback - creates/updates chart when canvas is available
  const chartRef = useCallback(
    (canvas: any) => {
      // Cleanup previous chart
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }

      // Create new chart if canvas and data are available
      if (canvas && dashboardData?.donut_graph?.data.length > 0) {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        console.log("Render chart");
        chartInstanceRef.current = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: dashboardData.donut_graph.data.map((item) => item.label),
            datasets: [
              {
                label: dashboardData.donut_graph.title,
                data: dashboardData.donut_graph.data.map((item) => item.value),
                backgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#4BC0C0",
                  "#9966FF",
                  "#FF9F40",
                  "#FF6384",
                  "#C9CBCF",
                ],
                borderColor: "#ffffff",
                borderWidth: 2,
                hoverOffset: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  padding: 20,
                  usePointStyle: true,
                },
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const total = context.dataset.data.reduce(
                      (a, b) => (a as number) + (b as number),
                      0,
                    ) as number;
                    const percentage = ((context.parsed / total) * 100).toFixed(
                      1,
                    );
                    return `${context.label}: ${context.formattedValue} (${percentage}%)`;
                  },
                },
              },
            },
          },
        });
      }
    },
    [dashboardData?.donut_graph],
  );

  return (
    <div className="p-4">
      {/* Cards */}
      <CardCarrousel
        cards={dashboardData?.cards.map((card: DashboardCard) => ({
          title: card.title,
          description: card.description,
          value: card.value,
          currency: card.currency as "CLP" | "USD" | "EUR",
          previous_value: card.previous_value,
        }))}
      />
      {/* Donut Graph */}
      {dashboardData?.donut_graph &&
        dashboardData.donut_graph.data.length > 0 && (
          <div className="my-6 w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              {dashboardData.donut_graph.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {dashboardData.donut_graph.description}
            </p>
            <div
              className="w-full max-w-md mx-auto"
              style={{ height: "300px" }}
            >
              <canvas ref={chartRef} className="w-full h-full"></canvas>
            </div>
          </div>
        )}
      {/* Table */}
      <SimpleTable
        title={dashboardData.table.title}
        description={dashboardData.table.description}
        columns={dashboardData.table.columns}
        data={dashboardData.table.data.map((row: DashboardTableRow) => ({
          id: row.id,
          name: row.name,
          category: row.category,
          amount: row.amount,
          date: formatDate(row.date),
          description: row.description,
        }))}
        hasButton={true}
        buttonProps={{
          buttonText: "Add expense",
          buttonIcon: <PlusIconOutline className="w-6 h-6 stroke-white" />,
          buttonClassName: "btn-primary",
          onClick: () => setIsModalOpen(true),
        }}
        tableContainerClassName="w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-800 min-h-0 sm:min-h-[420px] overflow-x-auto"
        tableClassName="w-full p-6"
        onRowClick={() => {}}
      />
    </div>
  );
}

export default function Expenses() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [currency, setCurrency] = useState("CLP");

  const handleReload = () => setReloadTrigger((prev) => prev + 1);

  const handleSave = (data: any) => {
    console.log(data);
  };

  return (
    <div className="p-4 rounded-xl">
      <CreateEditModal
        mode="expense"
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onSave={handleSave}
        userId={user?.id}
      />
      <div className="border border-gray-200 dark:border-gray-800 rounded-md p-4">
        <HeaderControls>
          <HeaderButton
            onButtonClick={handleReload}
            isLoading={false}
            disabled={false}
            loadingText="Reloading..."
            buttonText="Reload Data"
            className="btn-secondary flex items-center gap-2 min-w-32"
            buttonIcon={
              <ReloadIcon className="size-5 stroke-2 stroke-primary-400 dark:stroke-white" />
            }
          />
        </HeaderControls>
        <div className="separator my-4" />
        <div className="flex flex-col gap-4 p-4">
          <Suspense fallback={<Loader message="Loading expenses..." />}>
            <ExpensesContent
              reloadTrigger={reloadTrigger}
              year={year}
              month={month}
              currency={currency}
              setIsModalOpen={setIsModalOpen}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
