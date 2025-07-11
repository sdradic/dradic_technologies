import { useEffect, useState } from "react";
import { PlusIconOutline } from "~/components/Icons";
import SimpleTable, { type SimpleTableProps } from "~/components/SimpleTable";
import { IncomeModal } from "~/components/IncomeModal";
import { useAuth } from "~/contexts/AuthContext";
import { incomesApi, incomeSourcesApi } from "~/modules/apis";
import type {
  IncomeCreate,
  IncomeSource,
  IncomeWithDetails,
} from "~/modules/types";
import Loader from "~/components/Loader";
import {
  getDemoIncomeData,
  getEmptyIncomeData,
  getDemoIncomeSources,
} from "~/mocks/mockData";
import { formatCurrency } from "~/modules/utils";
import { acceptedCurrencies } from "~/modules/store";

const MonthlyIncomesPage = () => {
  const { user, isGuest } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedIncome, setSelectedIncome] =
    useState<IncomeWithDetails | null>(null);
  const [allIncomes, setAllIncomes] = useState<IncomeWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sources, setSources] = useState<IncomeSource[]>([]);
  const [tableData, setTableData] = useState<SimpleTableProps>({
    title: new Date().toLocaleString("default", { month: "long" }),
    description: "Click on an income to edit it.",
    columns: ["Source", "Amount", "Currency", "Date", "Description"],
    data: [],
  });

  // Guest mode state for local data management
  const [guestIncomes, setGuestIncomes] = useState<IncomeWithDetails[]>([]);

  const handleAddIncome = async (incomeData: IncomeCreate) => {
    try {
      if (isGuest) {
        // Handle locally for guest users
        const newIncome: IncomeWithDetails = {
          id: `demo-income-${Date.now()}`,
          source_id: incomeData.source_id,
          amount: incomeData.amount,
          currency: incomeData.currency,
          date: incomeData.date,
          description: incomeData.description || "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          source_name:
            sources.find((s) => s.id === incomeData.source_id)?.name ||
            "Unknown",
          source_category:
            sources.find((s) => s.id === incomeData.source_id)?.category || "",
          user_name: "Guest User",
          user_email: "guest@example.com",
          group_name: "",
        };

        const updatedIncomes = [...guestIncomes, newIncome];
        setGuestIncomes(updatedIncomes);
        updateTableData(updatedIncomes);
        setIsModalOpen(false);
      } else {
        // Handle via API for authenticated users
        const income = await incomesApi.create(incomeData);
        await fetchData();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error adding income:", error);
      throw error;
    }
  };

  const handleEditIncome = async (incomeData: IncomeCreate) => {
    try {
      if (isGuest) {
        // Handle locally for guest users
        if (selectedIncome) {
          const updatedIncomes = guestIncomes.map((income) =>
            income.id === selectedIncome.id
              ? {
                  ...income,
                  amount: incomeData.amount,
                  currency: incomeData.currency,
                  date: incomeData.date,
                  description: incomeData.description || "",
                  source_id: incomeData.source_id,
                  source_name:
                    sources.find((s) => s.id === incomeData.source_id)?.name ||
                    "Unknown",
                  source_category:
                    sources.find((s) => s.id === incomeData.source_id)
                      ?.category || "",
                  updated_at: new Date().toISOString(),
                }
              : income
          );
          setGuestIncomes(updatedIncomes);
          updateTableData(updatedIncomes);
        }
        setIsEditModalOpen(false);
        setSelectedIncome(null);
      } else {
        // Handle via API for authenticated users
        await fetchData();
        setIsEditModalOpen(false);
        setSelectedIncome(null);
      }
    } catch (error) {
      console.error("Error updating income:", error);
      throw error;
    }
  };

  const handleDeleteIncome = async (incomeId: string) => {
    try {
      if (isGuest) {
        // Handle locally for guest users
        const updatedIncomes = guestIncomes.filter(
          (income) => income.id !== incomeId
        );
        setGuestIncomes(updatedIncomes);
        updateTableData(updatedIncomes);
      } else {
        // Handle via API for authenticated users
        await incomesApi.delete(incomeId);
        await fetchData();
      }
    } catch (error) {
      console.error("Error deleting income:", error);
      throw error;
    }
  };

  const updateTableData = (incomes: IncomeWithDetails[]) => {
    setTableData((prev) => ({
      ...prev,
      data: incomes.map((income) => {
        const currency = (income.currency ||
          "CLP") as (typeof acceptedCurrencies)[number];
        return {
          id: income.id,
          source: income.source_name,
          amount: formatCurrency(income.amount, currency),
          currency: income.currency,
          date: income.date,
          description: income.description || "",
        };
      }),
    }));
  };

  const handleRowClick = (row: { [key: string]: string | number }) => {
    if (isGuest) {
      // Find the income in guest data
      const income = guestIncomes.find((inc) => inc.id === row.id);
      if (income) {
        setSelectedIncome(income);
        setIsEditModalOpen(true);
      }
    } else {
      // Find the income in authenticated user data
      const income = allIncomes.find((inc) => inc.id === row.id);
      if (income) {
        setSelectedIncome(income);
        setIsEditModalOpen(true);
      }
    }
  };

  const fetchData = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      // Get current date for the monthly data
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1; // getMonth() is 0-indexed

      // Format dates for the API request
      const formatDate = (date: Date) => {
        return date.toISOString().split("T")[0];
      };

      const startDate = new Date(year, month - 1, 1); // Month is 0-indexed in JS
      const endDate = new Date(year, month, 0); // Last day of the current month

      // Use Promise.all to fetch both incomes and sources simultaneously
      const [incomesResponse, sourcesResponse] = await Promise.all([
        incomesApi.getAll({
          user_id: user.id,
          start_date: formatDate(startDate),
          end_date: formatDate(endDate),
        }),
        incomeSourcesApi.getAll(user.id),
      ]);

      // Store all incomes for editing
      setAllIncomes(incomesResponse.incomes);

      // Update sources for modal
      setSources(sourcesResponse.items);

      // Update table data
      setTableData((prev) => ({
        ...prev,
        data: incomesResponse.incomes.map((income) => ({
          id: income.id,
          source: income.source_name,
          amount: formatCurrency(
            income.amount,
            income.currency as (typeof acceptedCurrencies)[number]
          ),
          currency: income.currency,
          date: income.date,
          description: income.description || "",
        })),
      }));
    } catch (error) {
      setError("Failed to fetch data");
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isGuest) {
      // Use demo data for guest users
      const demoData = getDemoIncomeData();
      const demoSources = getDemoIncomeSources();

      // Create demo incomes from the table data
      const demoIncomes: IncomeWithDetails[] = demoData.tableData.data.map(
        (row: any) => ({
          id: row.id,
          source_id: demoSources.find((s) => s.name === row.source)?.id || "",
          amount:
            typeof row.amount === "number"
              ? row.amount
              : parseFloat(row.amount.toString()),
          currency: row.currency,
          date: row.date,
          description: row.description,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          source_name: row.source,
          source_category:
            demoSources.find((s) => s.name === row.source)?.category || "",
          user_name: "Guest User",
          user_email: "guest@example.com",
          group_name: "",
        })
      );

      setGuestIncomes(demoIncomes);
      setSources(demoSources);
      updateTableData(demoIncomes);
      setIsLoading(false);
    } else if (user) {
      // Fetch real data for authenticated users
      fetchData();
    } else {
      // No user and not a guest - show empty state
      const emptyData = getEmptyIncomeData();
      setTableData(emptyData.tableData);
      setSources([]);
      setIsLoading(false);
    }
  }, [user, isGuest]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader message="Loading incomes..." size={[12, 12]} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-800 min-h-[420px] overflow-x-auto">
        <div className="flex flex-col items-center justify-center h-96">
          <p className="text-red-500">{error}</p>
          <button onClick={fetchData} className="mt-2 btn-secondary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SimpleTable
        title={tableData.title}
        description={
          isGuest
            ? "Demo income data - changes are saved locally only."
            : tableData.description
        }
        columns={tableData.columns}
        data={tableData.data}
        hasButton={true}
        buttonProps={{
          buttonText: "Add income",
          buttonIcon: <PlusIconOutline className="w-6 h-6 stroke-white" />,
          buttonClassName: "btn-primary",
          onClick: () => setIsModalOpen(true),
        }}
        tableContainerClassName="w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-800 min-h-[420px] overflow-x-auto"
        tableClassName="w-full p-6"
        onRowClick={handleRowClick}
      />

      <IncomeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddIncome}
        userId={user?.id || "mock-user-id"}
        sources={sources}
      />

      <IncomeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedIncome(null);
        }}
        onSubmit={handleEditIncome}
        userId={user?.id || "mock-user-id"}
        income={selectedIncome}
        sources={sources}
        onDelete={handleDeleteIncome}
      />
    </div>
  );
};

export { MonthlyIncomesPage };
