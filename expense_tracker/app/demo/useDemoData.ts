import { useCallback, useState } from "react";
import {
  getDemoIncomeData,
  getDemoIncomeSources,
  getDemoMonthlyData,
  getEmptyIncomeData,
  getEmptyMonthlyData,
} from "../mocks/mockData";
import type {
  ExpenseCreate,
  ExpenseItem,
  ExpenseWithDetails,
  IncomeCreate,
  IncomeSource,
  IncomeWithDetails,
} from "../modules/types";

export function useDemoData() {
  const [guestExpenses, setGuestExpenses] = useState<ExpenseWithDetails[]>([]);
  const [guestExpenseItems, setGuestExpenseItems] = useState<ExpenseItem[]>([]);

  const initializeDemoData = useCallback(() => {
    const demoData = getDemoMonthlyData();

    // Create demo expense items
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
          demoItems.find((item) => item.name === row.name)?.id || "demo-item-1",
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

    return {
      cards: demoData.cards,
      expenses: demoExpenses,
      items: demoItems,
    };
  }, []);

  const addDemoExpense = useCallback(
    (expenseData: ExpenseCreate) => {
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

      setGuestExpenses((prev) => [...prev, newExpense]);
      return newExpense;
    },
    [guestExpenseItems]
  );

  const updateDemoExpense = useCallback(
    (expenseId: string, expenseData: ExpenseCreate) => {
      const selectedItem = guestExpenseItems.find(
        (item) => item.id === expenseData.item_id
      );

      setGuestExpenses((prev) =>
        prev.map((expense) =>
          expense.id === expenseId
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
        )
      );
    },
    [guestExpenseItems]
  );

  const deleteDemoExpense = useCallback((expenseId: string) => {
    setGuestExpenses((prev) =>
      prev.filter((expense) => expense.id !== expenseId)
    );
  }, []);

  const getEmptyData = useCallback(() => {
    return getEmptyMonthlyData();
  }, []);

  // --- INCOME DEMO DATA ---
  const [guestIncomes, setGuestIncomes] = useState<IncomeWithDetails[]>([]);
  const [guestIncomeSources, setGuestIncomeSources] = useState<IncomeSource[]>(
    []
  );

  const initializeDemoIncomeData = useCallback(() => {
    const demoIncomeData = getDemoIncomeData();
    const demoSources = getDemoIncomeSources();
    // Create demo incomes from the table data
    const demoIncomes: IncomeWithDetails[] = demoIncomeData.tableData.data.map(
      (row: any) => ({
        id: row.id,
        source_id:
          demoSources.find((s) => s.name === row.source)?.id || "demo-source-1",
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
    setGuestIncomeSources(demoSources);
    return {
      incomes: demoIncomes,
      sources: demoSources,
    };
  }, []);

  const addDemoIncome = useCallback(
    (incomeData: IncomeCreate, sources: IncomeSource[]) => {
      const selectedSource = sources.find((s) => s.id === incomeData.source_id);
      const newIncome: IncomeWithDetails = {
        id: `demo-income-${Date.now()}`,
        source_id: incomeData.source_id,
        amount: incomeData.amount,
        currency: incomeData.currency,
        date: incomeData.date,
        description: incomeData.description || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        source_name: selectedSource?.name || "Unknown",
        source_category: selectedSource?.category || "",
        user_name: "Guest User",
        user_email: "guest@example.com",
        group_name: "",
      };
      setGuestIncomes((prev) => [...prev, newIncome]);
      return newIncome;
    },
    []
  );

  const updateDemoIncome = useCallback(
    (incomeId: string, incomeData: IncomeCreate, sources: IncomeSource[]) => {
      const selectedSource = sources.find((s) => s.id === incomeData.source_id);
      setGuestIncomes((prev) =>
        prev.map((income) =>
          income.id === incomeId
            ? {
                ...income,
                source_id: incomeData.source_id,
                amount: incomeData.amount,
                currency: incomeData.currency,
                date: incomeData.date,
                description: incomeData.description || "",
                source_name: selectedSource?.name || "Unknown",
                source_category: selectedSource?.category || "",
                updated_at: new Date().toISOString(),
              }
            : income
        )
      );
    },
    []
  );

  const deleteDemoIncome = useCallback((incomeId: string) => {
    setGuestIncomes((prev) => prev.filter((income) => income.id !== incomeId));
  }, []);

  // Income sources CRUD
  const addDemoIncomeSource = useCallback((source: IncomeSource) => {
    setGuestIncomeSources((prev) => [...prev, source]);
    return source;
  }, []);

  const updateDemoIncomeSource = useCallback(
    (sourceId: string, data: Partial<IncomeSource>) => {
      setGuestIncomeSources((prev) =>
        prev.map((source) =>
          source.id === sourceId ? { ...source, ...data } : source
        )
      );
    },
    []
  );

  const deleteDemoIncomeSource = useCallback((sourceId: string) => {
    setGuestIncomeSources((prev) =>
      prev.filter((source) => source.id !== sourceId)
    );
  }, []);

  const getEmptyIncomeDataFn = useCallback(() => {
    return getEmptyIncomeData();
  }, []);

  return {
    // Expense demo data
    guestExpenses,
    guestExpenseItems,
    initializeDemoData,
    addDemoExpense,
    updateDemoExpense,
    deleteDemoExpense,
    getEmptyData,
    // Income demo data
    guestIncomes,
    guestIncomeSources,
    initializeDemoIncomeData,
    addDemoIncome,
    updateDemoIncome,
    deleteDemoIncome,
    addDemoIncomeSource,
    updateDemoIncomeSource,
    deleteDemoIncomeSource,
    getEmptyIncomeData: getEmptyIncomeDataFn,
  };
}
