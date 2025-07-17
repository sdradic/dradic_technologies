import type { SimpleCardProps } from "~/components/SimpleCard";
import type { SimpleDonutGraphProps } from "~/components/SimpleDonutGraph";
import type { SimpleTableProps } from "~/components/SimpleTable";
import { formatCurrency } from "~/modules/utils";

// Helper function to generate empty monthly data
export const getEmptyMonthlyData = () => ({
  cards: [
    {
      title: "Total Income",
      description: "Total income for the month",
      value: 0,
      currency: "CLP",
      previousValue: 0,
      canEdit: false,
    },
    {
      title: "Total Expenses",
      description: "Total expenses for the month",
      value: 0,
      currency: "CLP",
      previousValue: 0,
      canEdit: false,
    },
    {
      title: "Total Savings",
      description: "Total savings for the month",
      value: 0,
      currency: "CLP",
      previousValue: 0,
      canEdit: false,
    },
  ] as SimpleCardProps[],
  donutGraphData: {
    title: "Expenses by category",
    description: "Expenses by category",
    data: [],
  } as SimpleDonutGraphProps,
  tableData: {
    title: new Date().toLocaleString("default", { month: "long" }),
    description: "Click on an expense to edit it.",
    columns: ["Name", "Category", "Amount", "Date", "Description"],
    data: [],
  } as SimpleTableProps,
});

// Helper function to generate empty yearly data
export const getEmptyYearlyData = () => ({
  cards: [
    {
      title: "Total Income",
      description: "Total income for the year",
      value: 0,
      currency: "CLP",
      previousValue: 0,
    },
    {
      title: "Total Expenses",
      description: "Total expenses for the year",
      value: 0,
      currency: "CLP",
      previousValue: 0,
    },
    {
      title: "Total Savings",
      description: "Total savings for the year",
      value: 0,
      currency: "CLP",
      previousValue: 0,
    },
  ] as SimpleCardProps[],
  tableData: {
    title: new Date().toLocaleString("default", { year: "numeric" }),
    description: "Click on a month to view the expenses.",
    columns: ["Month", "Total Income", "Total Expenses", "Total Savings"],
    data: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      month: new Date(0, i).toLocaleString("default", { month: "long" }),
      total_income: formatCurrency(0, "CLP"),
      total_expenses: formatCurrency(0, "CLP"),
      total_savings: formatCurrency(0, "CLP"),
    })),
  } as SimpleTableProps,
});

// Helper function to generate demo data for preview purposes
export const getDemoMonthlyData = () => ({
  cards: [
    {
      title: "Total Income",
      description: "Total income for the month",
      value: 1500000,
      currency: "CLP",
      previousValue: 1000000,
      canEdit: true,
    },
    {
      title: "Total Expenses",
      description: "Total expenses for the month",
      value: 1000000,
      currency: "CLP",
      previousValue: 800000,
      canEdit: false,
    },
    {
      title: "Total Savings",
      description: "Total savings for the month",
      value: 50000,
      currency: "CLP",
      previousValue: 1000000,
      canEdit: false,
    },
  ] as SimpleCardProps[],
  donutGraphData: {
    title: "Expenses by category",
    description: "Expenses by category",
    data: [
      { label: "Food", value: 100000 },
      { label: "Transportation", value: 200000 },
      { label: "Entertainment", value: 300000 },
    ],
  } as SimpleDonutGraphProps,
  tableData: {
    title: new Date().toLocaleString("default", { month: "long" }),
    description: "Click on an expense to edit it.",
    columns: ["Name", "Category", "Amount", "Date", "Description"],
    data: [
      {
        id: 1,
        name: "Groceries",
        category: "Food",
        amount: 100000,
        date: new Date().toISOString().split("T")[0],
        description: "Weekly groceries",
      },
      {
        id: 2,
        name: "Bus pass",
        category: "Transportation",
        amount: 200000,
        date: new Date().toISOString().split("T")[0],
        description: "Monthly bus pass",
      },
      {
        id: 3,
        name: "Movie tickets",
        category: "Entertainment",
        amount: 300000,
        date: new Date().toISOString().split("T")[0],
        description: "Weekend movie",
      },
    ],
  } as SimpleTableProps,
});

// Helper function to generate empty income data
export const getEmptyIncomeData = () => ({
  tableData: {
    title: new Date().toLocaleString("default", { month: "long" }),
    description: "Click on an income to edit it.",
    columns: ["Source", "Amount", "Currency", "Date", "Description"],
    data: [],
  } as SimpleTableProps,
});

// Helper function to generate demo income data for preview purposes
export const getDemoIncomeData = () => ({
  tableData: {
    title: new Date().toLocaleString("default", { month: "long" }),
    description: "Click on an income to edit it.",
    columns: ["Source", "Amount", "Currency", "Date", "Description"],
    data: [
      {
        id: "demo-income-1",
        source: "Salary",
        amount: 1200000,
        currency: "CLP",
        date: new Date().toISOString().split("T")[0],
        description: "Monthly salary payment",
      },
      {
        id: "demo-income-2",
        source: "Freelance Work",
        amount: 250000,
        currency: "CLP",
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        description: "Web development project",
      },
      {
        id: "demo-income-3",
        source: "Investment Returns",
        amount: 50000,
        currency: "CLP",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        description: "Stock dividend payment",
      },
      {
        id: "demo-income-4",
        source: "Side Business",
        amount: 180000,
        currency: "CLP",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        description: "Online course sales",
      },
      {
        id: "demo-income-5",
        source: "Bonus",
        amount: 100000,
        currency: "CLP",
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        description: "Performance bonus",
      },
    ],
  } as SimpleTableProps,
});

// Mock income sources for guest users
export const getDemoIncomeSources = () => [
  {
    id: "demo-source-1",
    name: "Salary",
    category: "Employment",
    is_recurring: true,
    user_id: "mock-user-id",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-source-2",
    name: "Freelance Work",
    category: "Self-Employment",
    is_recurring: false,
    user_id: "mock-user-id",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-source-3",
    name: "Investment Returns",
    category: "Investments",
    is_recurring: false,
    user_id: "mock-user-id",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-source-4",
    name: "Side Business",
    category: "Business",
    is_recurring: true,
    user_id: "mock-user-id",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-source-5",
    name: "Bonus",
    category: "Employment",
    is_recurring: false,
    user_id: "mock-user-id",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Default export with all data
export default {
  monthly: {
    empty: getEmptyMonthlyData(),
    demo: getDemoMonthlyData(),
  },
  yearly: {
    empty: getEmptyYearlyData(),
  },
  incomes: {
    empty: getEmptyIncomeData(),
    demo: getDemoIncomeData(),
    sources: getDemoIncomeSources(),
  },
};
