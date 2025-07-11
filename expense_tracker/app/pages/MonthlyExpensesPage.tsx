import { useEffect, useState } from "react";
import { ErrorXIcon, PlusIconOutline } from "~/components/Icons";
import SimpleCard, { type SimpleCardProps } from "~/components/SimpleCard";
import SimpleDonutGraph, {
  type SimpleDonutGraphProps,
} from "~/components/SimpleDonutGraph";
import SimpleTable, { type SimpleTableProps } from "~/components/SimpleTable";
import { formatCurrency } from "~/modules/utils";
import { ExpenseModal } from "~/components/ExpenseModal";
import { CardCarrousel } from "../components/CardCarrousel";
import { expensesApi, ApiError, incomesApi } from "~/modules/apis";
import { useAuth } from "~/contexts/AuthContext";
import type {
  ExpenseCreate,
  ExpenseWithDetails,
  ExpenseItem,
} from "~/modules/types";
import { getDemoMonthlyData, getEmptyMonthlyData } from "../mocks/mockData";
import { acceptedCurrencies } from "~/modules/store";
import Loader from "~/components/Loader";

type Currency = (typeof acceptedCurrencies)[number];

export default function MonthlyExpensesPage() {
  const { user, isGuest } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<SimpleCardProps[]>(() => {
    // Create a single default card and reuse its properties
    const defaultCard: Omit<
      SimpleCardProps,
      "title" | "description" | "canEdit"
    > = {
      value: 0,
      currency: "CLP" as const,
      symbol: "$",
      previousValue: 0,
    };

    // Create cards with proper typing
    const initialCards: SimpleCardProps[] = [
      {
        ...defaultCard,
        title: "Total Income",
        description: "Total income for the month",
        canEdit: false,
      },
      {
        ...defaultCard,
        title: "Total Expenses",
        description: "Total expenses for the month",
        canEdit: false,
      },
      {
        ...defaultCard,
        title: "Total Savings",
        description: "Total savings for the month",
        canEdit: false,
      },
    ];

    return initialCards;
  });
  const [tableData, setTableData] = useState<SimpleTableProps>({
    title: new Date().toLocaleString("default", { month: "long" }),
    description: "Click on an expense to edit it.",
    columns: ["Name", "Category", "Amount", "Date", "Description"],
    data: [],
  });
  const [donutGraphData, setDonutGraphData] = useState<SimpleDonutGraphProps>({
    title: "Expenses by category",
    description: "Expenses by category",
    data: [],
  });

  type TableDataItem = {
    id: string;
    name: string;
    category: string;
    amount: string;
    date: string;
    description: string;
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] =
    useState<ExpenseWithDetails | null>(null);
  const [allExpenses, setAllExpenses] = useState<ExpenseWithDetails[]>([]);

  // Guest mode state for local data management
  const [guestExpenses, setGuestExpenses] = useState<ExpenseWithDetails[]>([]);
  const [guestExpenseItems, setGuestExpenseItems] = useState<ExpenseItem[]>([]);

  // Initialize with empty data
  useEffect(() => {
    if (isGuest) {
      // Use demo data for guest users
      const demoData = getDemoMonthlyData();

      // Create demo expense items from the demo data
      const demoItems: ExpenseItem[] = [
        {
          id: "demo-item-1",
          name: "Groceries",
          category: "Food",
          is_fixed: false,
          user_id: "mock-user-id",
        },
        {
          id: "demo-item-2",
          name: "Bus pass",
          category: "Transportation",
          is_fixed: true,
          user_id: "mock-user-id",
        },
        {
          id: "demo-item-3",
          name: "Movie tickets",
          category: "Entertainment",
          is_fixed: false,
          user_id: "mock-user-id",
        },
      ];

      // Create demo expenses from the table data
      const demoExpenses: ExpenseWithDetails[] = demoData.tableData.data.map(
        (row: any) => ({
          id: row.id,
          item_id:
            demoItems.find((item) => item.name === row.name)?.id ||
            "demo-item-1",
          date: row.date,
          amount:
            typeof row.amount === "number"
              ? row.amount
              : parseFloat(row.amount.toString()),
          currency: "CLP",
          created_at: new Date().toISOString(),
          item_name: row.name,
          item_category: row.category,
          item_is_fixed: false,
          user_name: "Guest User",
          user_email: "guest@example.com",
          group_name: "",
        })
      );

      setGuestExpenses(demoExpenses);
      setGuestExpenseItems(demoItems);
      setCards(demoData.cards);
      updateTableAndChartData(demoExpenses);
      setIsLoading(false);
    } else if (user) {
      // Fetch real data for authenticated users
      fetchMonthlyData();
    } else {
      // No user and not a guest - show empty state
      const emptyData = getEmptyMonthlyData();
      setCards(emptyData.cards);
      setTableData(emptyData.tableData);
      setDonutGraphData(emptyData.donutGraphData);
      setIsLoading(false);
    }
  }, [user, isGuest]);

  const updateTableAndChartData = (expenses: ExpenseWithDetails[]) => {
    // Update table data
    const tableDataItems: TableDataItem[] = expenses.map((expense) => {
      const currency = (expense.currency || "CLP") as Currency;
      return {
        id: expense.id,
        name: expense.item_name,
        category: expense.item_category || "Uncategorized",
        amount: formatCurrency(Math.abs(expense.amount), currency),
        date: new Date(expense.date).toLocaleDateString(),
        description: expense.item_name || "",
      };
    });

    setTableData({
      title: new Date().toLocaleString("default", { month: "long" }),
      description: isGuest
        ? "Demo expense data - changes are saved locally only."
        : "Click on an expense to edit it.",
      columns: ["Name", "Category", "Amount", "Date", "Description"],
      data: tableDataItems,
    });

    // Update donut chart data (group expenses by category)
    const categories = new Map<string, number>();
    expenses.forEach((expense: ExpenseWithDetails) => {
      const category = expense.item_category || "Uncategorized";
      const expenseAmount = Math.abs(expense.amount);
      categories.set(category, (categories.get(category) || 0) + expenseAmount);
    });

    const donutData = Array.from(categories.entries())
      .map(([label, value]) => ({
        label,
        value,
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);

    setDonutGraphData({
      title: "Expenses by category",
      description: "Expenses by category",
      data: donutData,
    });
  };

  const fetchMonthlyData = async () => {
    try {
      setIsLoading(true);
      setError(null);

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

      // Fetch both expenses and income in parallel
      const [expenses, income] = await Promise.all([
        expensesApi.getAll({
          user_id: user?.id,
          start_date: formatDate(startDate),
          end_date: formatDate(endDate),
        }),
        incomesApi.getAll({
          user_id: user?.id,
          start_date: formatDate(startDate),
          end_date: formatDate(endDate),
        }),
      ]);

      // Get currency from expenses or default to CLP
      const currency = expenses.summary.currency as Currency;

      // Get total income and expenses from the summary
      const totalIncome = income.summary.total_amount || 0;
      const totalExpenses = expenses.summary.total_amount || 0;

      // Create a new card with proper typing
      const createCard = (
        title: string,
        description: string,
        value: number
      ): SimpleCardProps => {
        // Ensure we have a valid currency
        let validCurrency: Currency;
        if (currency === "USD" || currency === "EUR" || currency === "CLP") {
          validCurrency = currency;
        } else {
          validCurrency = "CLP";
        }

        // Determine the symbol based on currency
        const symbol =
          validCurrency === "USD" ? "$" : validCurrency === "EUR" ? "€" : "$";

        // Create the card with explicit type assertion
        const card: SimpleCardProps = {
          title,
          description,
          value,
          currency: validCurrency,
          symbol,
          previousValue: 0,
        };

        return card;
      };

      // Store all expenses for editing
      setAllExpenses(expenses.expenses);

      // Update cards with real data
      const updatedCards: SimpleCardProps[] = [
        createCard("Total Income", "Total income for the month", totalIncome),
        createCard(
          "Total Expenses",
          "Total expenses for the month",
          totalExpenses
        ),
        createCard(
          "Total Savings",
          "Total savings for the month",
          totalIncome - totalExpenses
        ),
      ];
      setCards(updatedCards);

      updateTableAndChartData(expenses.expenses);
    } catch (err) {
      console.error("Error fetching monthly data:", err);
      setError(err instanceof ApiError ? err.message : "Failed to load data");
      console.error("Failed to load monthly data");

      // Fall back to empty data on error
      const emptyData = getEmptyMonthlyData();
      setCards(emptyData.cards);
      setTableData(emptyData.tableData);
      setDonutGraphData(emptyData.donutGraphData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExpense = async (expenseData: ExpenseCreate) => {
    try {
      if (isGuest) {
        // Handle locally for guest users
        const selectedItem = guestExpenseItems.find(
          (item) => item.id === expenseData.item_id
        );
        const newExpense: ExpenseWithDetails = {
          id: `demo-expense-${Date.now()}`,
          item_id: expenseData.item_id,
          date: expenseData.date,
          amount: expenseData.amount,
          currency: expenseData.currency,
          created_at: new Date().toISOString(),
          item_name: selectedItem?.name || "Unknown",
          item_category: selectedItem?.category || "Uncategorized",
          item_is_fixed: selectedItem?.is_fixed || false,
          user_name: "Guest User",
          user_email: "guest@example.com",
          group_name: "",
        };

        const updatedExpenses = [...guestExpenses, newExpense];
        setGuestExpenses(updatedExpenses);
        updateTableAndChartData(updatedExpenses);
        setIsModalOpen(false);
      } else {
        // Handle via API for authenticated users
        await expensesApi.create(expenseData);
        await fetchMonthlyData();
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Error adding expense:", err);
      setError(err instanceof ApiError ? err.message : "Failed to add expense");
    }
  };

  const handleEditExpense = async (expenseData: ExpenseCreate) => {
    try {
      if (isGuest) {
        // Handle locally for guest users
        if (selectedExpense) {
          const selectedItem = guestExpenseItems.find(
            (item) => item.id === expenseData.item_id
          );
          const updatedExpenses = guestExpenses.map((expense) =>
            expense.id === selectedExpense.id
              ? {
                  ...expense,
                  item_id: expenseData.item_id,
                  date: expenseData.date,
                  amount: expenseData.amount,
                  currency: expenseData.currency,
                  item_name: selectedItem?.name || "Unknown",
                  item_category: selectedItem?.category || "Uncategorized",
                  item_is_fixed: selectedItem?.is_fixed || false,
                }
              : expense
          );
          setGuestExpenses(updatedExpenses);
          updateTableAndChartData(updatedExpenses);
        }
        setIsEditModalOpen(false);
        setSelectedExpense(null);
      } else {
        // Handle via API for authenticated users
        await fetchMonthlyData();
        setIsEditModalOpen(false);
        setSelectedExpense(null);
      }
    } catch (err) {
      console.error("Error updating expense:", err);
      setError(
        err instanceof ApiError ? err.message : "Failed to update expense"
      );
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      if (isGuest) {
        // Handle locally for guest users
        const updatedExpenses = guestExpenses.filter(
          (expense) => expense.id !== expenseId
        );
        setGuestExpenses(updatedExpenses);
        updateTableAndChartData(updatedExpenses);
      } else {
        // Handle via API for authenticated users
        await expensesApi.delete(expenseId);
        await fetchMonthlyData();
      }
    } catch (err) {
      console.error("Error deleting expense:", err);
      setError(
        err instanceof ApiError ? err.message : "Failed to delete expense"
      );
    }
  };

  const handleRowClick = (row: { [key: string]: string | number }) => {
    if (isGuest) {
      // Find the expense in guest data
      const expense = guestExpenses.find((exp) => exp.id === row.id);
      if (expense) {
        setSelectedExpense(expense);
        setIsEditModalOpen(true);
      }
    } else {
      // Find the expense in authenticated user data
      const expense = allExpenses.find((exp) => exp.id === row.id);
      if (expense) {
        setSelectedExpense(expense);
        setIsEditModalOpen(true);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader message="Loading monthly data..." size={[12, 12]} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="alert alert-error flex items-center gap-2 justify-center">
          <ErrorXIcon className="w-6 h-6" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="sm:p-6">
      {/* Cards Section - Mobile: Carrousel, Desktop: Grid */}
      {cards.length === 0 ? (
        <NoCardData />
      ) : (
        <>
          <div className="sm:hidden">
            <CardCarrousel cards={cards} />
          </div>
          <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card, index) => (
              <SimpleCard
                key={card.title}
                title={card.title}
                description={card.description}
                value={card.value}
                currency={card.currency}
                symbol={card.symbol}
                previousValue={card.previousValue}
              />
            ))}
          </div>
        </>
      )}

      <div className="flex flex-col lg:flex-row gap-4 mt-4">
        <div className="w-full lg:w-1/2">
          <SimpleDonutGraph
            title={donutGraphData.title}
            description={donutGraphData.description}
            data={donutGraphData.data}
          />
        </div>
        <div className="w-full lg:w-1/2">
          <SimpleTable
            title={tableData.title}
            description={tableData.description}
            columns={tableData.columns}
            data={tableData.data}
            hasButton={true}
            buttonProps={{
              buttonText: "Add expense",
              buttonIcon: <PlusIconOutline className="w-6 h-6 stroke-white" />,
              buttonClassName: "btn-primary",
              onClick: () => setIsModalOpen(true),
            }}
            tableContainerClassName="w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-800 min-h-[420px] overflow-x-auto"
            tableClassName="w-full p-6"
            onRowClick={handleRowClick}
          />
        </div>
      </div>

      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddExpense}
        userId={user?.id || "mock-user-id"}
        items={isGuest ? guestExpenseItems : undefined}
      />

      <ExpenseModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedExpense(null);
        }}
        onSubmit={handleEditExpense}
        userId={user?.id || "mock-user-id"}
        expense={selectedExpense}
        items={isGuest ? guestExpenseItems : undefined}
        onDelete={handleDeleteExpense}
      />
    </div>
  );
}

function NoCardData() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl">No card data</h1>
    </div>
  );
}

function NoExpenses() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl">No expenses</h1>
    </div>
  );
}
