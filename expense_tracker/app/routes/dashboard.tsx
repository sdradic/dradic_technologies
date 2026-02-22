import { HeaderControls } from "~/components/HeaderControls";
import { HeaderButton } from "~/components/HeaderButton";
import { CardCarrousel } from "~/components/CardCarrousel";
import { ReloadIcon, PlusIconOutline } from "~/components/Icons";
import { useRef, useCallback, useState, Suspense, useEffect } from "react";
import type { Route } from "../+types/root";
import { formatDate } from "~/modules/apis";
import Loader from "~/components/Loader";
import SimpleTable from "~/components/SimpleTable";
import type { DashboardCard, DashboardTableRow } from "~/modules/types";
import useExpensesData from "~/hooks/useExpensesData";
import { months } from "~/modules/store";
import { Dropdown } from "~/components/Dropdown";
import { Link, useNavigate } from "react-router";
import { Chart } from "chart.js/auto";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "TallyUp" },
    { name: "description", content: "TallyUp your expense tracking app" },
  ];
}

function DashboardChart({
  donut_graph,
}: {
  donut_graph: {
    title: string;
    description: string;
    data: { label: string; value: number }[];
  };
}) {
  const chartInstanceRef = useRef<Chart | null>(null);

  const chartRefCallback = useCallback(
    (canvas: any) => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
      if (canvas && donut_graph?.data?.length > 0) {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        chartInstanceRef.current = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: donut_graph.data.map((d) => d.label),
            datasets: [
              {
                data: donut_graph.data.map((d) => d.value),
                backgroundColor: [
                  "#61d6c7",
                  "#56b3a7",
                  "#3f8f86",
                  "#2b6b65",
                  "#1a4744",
                  "#36A2EB",
                  "#FFCE56",
                  "#9966FF",
                ],
                borderColor: "#fff",
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
                labels: { padding: 20, usePointStyle: true },
              },
              tooltip: {
                callbacks: {
                  label: (context: {
                    label?: string;
                    formattedValue?: string;
                    dataset: { data: number[] };
                    parsed: number;
                  }) => {
                    const total = context.dataset.data.reduce(
                      (a, b) => a + b,
                      0,
                    );
                    const pct = total
                      ? ((context.parsed / total) * 100).toFixed(1)
                      : "0";
                    return `${context.label ?? ""}: ${context.formattedValue ?? context.parsed} (${pct}%)`;
                  },
                },
              },
            },
          },
        });
      }
    },
    [donut_graph],
  );

  useEffect(() => {
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  if (!donut_graph?.data?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-gray-400 dark:text-gray-600">
        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-[32px] mb-4">
          <svg
            className="w-12 h-12 opacity-20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <p className="text-sm font-extrabold uppercase tracking-widest">
          No data available
        </p>
      </div>
    );
  }

  return (
    <div className="h-80 w-full">
      <canvas ref={chartRefCallback} className="w-full h-full" aria-hidden />
    </div>
  );
}

function DashboardContent({
  year,
  month,
  currency,
  reloadTrigger,
}: {
  year: number;
  month: number;
  currency: string;
  reloadTrigger: number;
}) {
  const dashboardData = useExpensesData({
    reloadTrigger,
    year,
    month,
    currency,
  });

  const navigate = useNavigate();
  const hasData =
    dashboardData.table.data.length > 0 ||
    (dashboardData.cards?.length ?? 0) > 0;

  if (!hasData) {
    return (
      <div className="card-fintrack-lg p-10 flex flex-col items-center justify-center min-h-[320px]">
        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-[32px] mb-4">
          <svg
            className="w-12 h-12 opacity-20 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <p className="text-sm font-extrabold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          No data for this period
        </p>
        <p className="text-xs mt-1 text-gray-400">
          Add expenses or incomes to see your overview.
        </p>
        <div className="flex gap-4 mt-6">
          <Link to="/expenses" className="btn-primary flex items-center gap-2">
            <PlusIconOutline className="w-5 h-5 stroke-white" />
            Add expense
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {dashboardData.cards && dashboardData.cards.length > 0 && (
        <CardCarrousel
          cards={dashboardData.cards.map((card: DashboardCard) => ({
            title: card.title,
            description: card.description,
            value: card.value,
            currency: card.currency as "CLP" | "USD" | "EUR",
            previousValue: card.previous_value,
          }))}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Donut chart card */}
        {dashboardData.donut_graph &&
          dashboardData.donut_graph.data.length > 0 && (
            <div className="card-fintrack-lg p-10">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                    {dashboardData.donut_graph.title}
                  </h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                    {dashboardData.donut_graph.description}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-primary-600">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                    />
                  </svg>
                </div>
              </div>
              <DashboardChart donut_graph={dashboardData.donut_graph} />
            </div>
          )}

        {/* Summary card */}
        <div className="card-fintrack-lg p-10 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                Monthly summary
              </h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                Income, expenses, savings
              </p>
            </div>
          </div>
          <div className="space-y-6 flex-1">
            <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
              <span className="font-bold text-gray-600 dark:text-gray-400">
                Total income
              </span>
              <span className="text-xl font-extrabold text-emerald-600">
                {dashboardData.currency}{" "}
                {dashboardData.total_income?.toLocaleString() ?? 0}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
              <span className="font-bold text-gray-600 dark:text-gray-400">
                Total expenses
              </span>
              <span className="text-xl font-extrabold text-red-500">
                {dashboardData.currency}{" "}
                {dashboardData.total_expenses?.toLocaleString() ?? 0}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="font-bold text-gray-600 dark:text-gray-400">
                Net savings
              </span>
              <span
                className={`text-xl font-extrabold ${(dashboardData.total_savings ?? 0) >= 0 ? "text-primary-600" : "text-red-500"}`}
              >
                {dashboardData.currency}{" "}
                {dashboardData.total_savings?.toLocaleString() ?? 0}
              </span>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-center">
            <Link
              to="/expenses"
              className="text-sm font-extrabold text-primary-500 hover:text-primary-600 uppercase tracking-widest flex items-center gap-2"
            >
              View expenses
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M13 7l5 5-5 5M6 7l5 5-5 5"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {dashboardData.table.data.length > 0 && (
        <SimpleTable
          title={`${dashboardData.table.title} ${year}`}
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
            onClick: () => navigate("/expenses"),
          }}
          onRowClick={() => {}}
        />
      )}
    </div>
  );
}

export default function Dashboard() {
  const [year] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [currency] = useState("CLP");
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const handleReload = () => setReloadTrigger((prev) => prev + 1);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <HeaderControls>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-2 sm:mt-0">
            <Dropdown
              options={months.map((m, i) => ({ value: m, label: m }))}
              value={months[month - 1]}
              onChange={(m) => {
                setMonth(months.indexOf(m) + 1);
                setReloadTrigger((prev) => prev + 1);
              }}
            />
            <HeaderButton
              onButtonClick={handleReload}
              isLoading={false}
              disabled={false}
              loadingText="Reloading..."
              buttonText="Reload Data"
              className="btn-secondary dark:bg-gray-800 dark:text-white bg-white dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 min-w-32"
              buttonIcon={
                <ReloadIcon className="size-5 stroke-2 stroke-primary-400 dark:stroke-white" />
              }
            />
          </div>
        </HeaderControls>
      </div>

      <Suspense fallback={<Loader message="Loading dashboard..." />}>
        <DashboardContent
          year={year}
          month={month}
          currency={currency}
          reloadTrigger={reloadTrigger}
        />
      </Suspense>
    </div>
  );
}
