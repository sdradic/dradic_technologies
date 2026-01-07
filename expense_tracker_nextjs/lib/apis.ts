// API Client for Expense Tracker
import { supabase } from "./supabase";
import type {
  Expense,
  ExpenseCreate,
  ExpenseResponse,
  ExpenseItem,
  ExpenseItemCreate,
  ExpenseItemResponse,
  Income,
  IncomeCreate,
  IncomeResponse,
  IncomeSource,
  IncomeSourceCreate,
  IncomeSourceResponse,
  DashboardDataWithExpenses,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Get authentication headers
async function getAuthHeaders(): Promise<Record<string, string>> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.access_token) {
    return {
      Authorization: `Bearer ${session.access_token}`,
    };
  }

  console.warn("⚠️ No auth token found in session");
  return {};
}

// Generic API request handler
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const authHeaders = await getAuthHeaders();
  const defaultHeaders = {
    "Content-Type": "application/json",
    ...authHeaders,
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.detail || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Network error",
      0
    );
  }
}

// Expenses API
export const expensesApi = {
  // Get all expenses with filters
  getAll: (params: {
    user_id?: string;
    item_id?: string;
    category?: string;
    currency?: string;
    start_date?: string;
    end_date?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<ExpenseResponse> => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
    const queryString = searchParams.toString();
    return apiRequest(
      `/api/expense-tracker/expenses/${queryString ? `?${queryString}` : ""}`
    );
  },

  // Create a new expense
  create: (data: ExpenseCreate): Promise<Expense> =>
    apiRequest("/api/expense-tracker/expenses/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Get a specific expense
  getById: (id: string): Promise<Expense> =>
    apiRequest(`/api/expense-tracker/expenses/${id}`),

  // Update an expense
  update: (id: string, data: ExpenseCreate): Promise<Expense> =>
    apiRequest(`/api/expense-tracker/expenses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Delete an expense
  delete: (id: string): Promise<{ message: string }> =>
    apiRequest(`/api/expense-tracker/expenses/${id}`, {
      method: "DELETE",
    }),

  // Get dashboard data for a specific month
  getDashboard: (
    year: number,
    month: number,
    currency: string = "CLP"
  ): Promise<DashboardDataWithExpenses> =>
    apiRequest(
      `/api/expense-tracker/expenses/dashboard/monthly/${year}/${month}?currency=${currency}`
    ),
};

// Expense Items API
export const expenseItemsApi = {
  // Get all expense items
  getAll: (params: {
    user_id?: string;
    category?: string;
    is_fixed?: boolean;
    limit?: number;
    offset?: number;
  } = {}): Promise<ExpenseItemResponse> => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
    const queryString = searchParams.toString();
    return apiRequest(
      `/api/expense-tracker/expense-items/${queryString ? `?${queryString}` : ""}`
    );
  },

  // Create a new expense item
  create: (data: ExpenseItemCreate): Promise<ExpenseItem> =>
    apiRequest("/api/expense-tracker/expense-items/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Get a specific expense item
  getById: (id: string): Promise<ExpenseItem> =>
    apiRequest(`/api/expense-tracker/expense-items/${id}`),

  // Update an expense item
  update: (id: string, data: ExpenseItemCreate): Promise<ExpenseItem> =>
    apiRequest(`/api/expense-tracker/expense-items/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Delete an expense item
  delete: (id: string): Promise<{ message: string }> =>
    apiRequest(`/api/expense-tracker/expense-items/${id}`, {
      method: "DELETE",
    }),
};

// Incomes API
export const incomesApi = {
  // Get all incomes with filters
  getAll: (params: {
    user_id?: string;
    source_id?: string;
    category?: string;
    currency?: string;
    start_date?: string;
    end_date?: string;
    skip?: number;
    limit?: number;
  } = {}): Promise<IncomeResponse> => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
    const queryString = searchParams.toString();
    return apiRequest(
      `/api/expense-tracker/incomes/${queryString ? `?${queryString}` : ""}`
    );
  },

  // Create a new income
  create: (data: IncomeCreate): Promise<Income> =>
    apiRequest("/api/expense-tracker/incomes/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Get a specific income
  getById: (id: string): Promise<Income> =>
    apiRequest(`/api/expense-tracker/incomes/${id}`),

  // Update an income
  update: (id: string, data: IncomeCreate): Promise<Income> =>
    apiRequest(`/api/expense-tracker/incomes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Delete an income
  delete: (id: string): Promise<{ message: string }> =>
    apiRequest(`/api/expense-tracker/incomes/${id}`, {
      method: "DELETE",
    }),
};

// Income Sources API
export const incomeSourcesApi = {
  // Get all income sources
  getAll: (params: {
    user_id?: string;
    category?: string;
    is_recurring?: boolean;
    limit?: number;
    offset?: number;
  } = {}): Promise<IncomeSourceResponse> => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
    const queryString = searchParams.toString();
    return apiRequest(
      `/api/expense-tracker/income-sources/${queryString ? `?${queryString}` : ""}`
    );
  },

  // Create a new income source
  create: (data: IncomeSourceCreate): Promise<IncomeSource> =>
    apiRequest("/api/expense-tracker/income-sources/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Get a specific income source
  getById: (id: string): Promise<IncomeSource> =>
    apiRequest(`/api/expense-tracker/income-sources/${id}`),

  // Update an income source
  update: (id: string, data: IncomeSourceCreate): Promise<IncomeSource> =>
    apiRequest(`/api/expense-tracker/income-sources/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Delete an income source
  delete: (id: string): Promise<{ message: string }> =>
    apiRequest(`/api/expense-tracker/income-sources/${id}`, {
      method: "DELETE",
    }),
};

// Export the ApiError class for error handling
export { ApiError };

// Default export with all APIs
const api = {
  expenses: expensesApi,
  expenseItems: expenseItemsApi,
  incomes: incomesApi,
  incomeSources: incomeSourcesApi,
};

export default api;
