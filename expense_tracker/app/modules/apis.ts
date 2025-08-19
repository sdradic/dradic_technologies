// API Configuration
import { supabase } from "./supabase";
import type {
  DashboardData,
  DashboardTableWithIncomes,
  Expense,
  ExpenseCreate,
  ExpenseItem,
  ExpenseItemCreate,
  ExpenseItemResponse,
  ExpenseItemWithUser,
  ExpenseResponse,
  ExpenseWithDetails,
  Group,
  GroupCreate,
  Income,
  IncomeCreate,
  IncomeResponse,
  IncomeSource,
  IncomeSourceCreate,
  IncomeSourceResponse,
  IncomeSourceWithUser,
  IncomeWithDetails,
  User,
  UserCreate,
  UserWithGroup,
} from "./types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: unknown,
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

  return {};
}

// Generic API request handler
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
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
        errorData,
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Network error",
      0,
    );
  }
}

// Groups API - Backend gets user from authentication
export const groupsApi = {
  // Create a new group
  create: (data: GroupCreate): Promise<Group> =>
    apiRequest("/api/expense-tracker/groups/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Get all groups for the authenticated user
  getAll: (): Promise<Group[]> => apiRequest("/api/expense-tracker/groups/"),

  // Get a specific group
  getById: (id: string): Promise<Group> =>
    apiRequest(`/api/expense-tracker/groups/${id}`),

  // Update a group
  update: (id: string, data: GroupCreate): Promise<Group> =>
    apiRequest(`/api/expense-tracker/groups/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Delete a group
  delete: (id: string): Promise<{ message: string }> =>
    apiRequest(`/api/expense-tracker/groups/${id}`, {
      method: "DELETE",
    }),

  // Get users in a group
  getUsers: (id: string): Promise<User[]> =>
    apiRequest(`/api/expense-tracker/groups/${id}/users`),
};

// Users API
export const usersApi = {
  // Create a new user
  create: (data: UserCreate): Promise<User> =>
    apiRequest("/api/expense-tracker/users/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Get all users (optionally filter by group)
  getAll: (groupId?: string): Promise<UserWithGroup[]> => {
    const params = groupId ? `?group_id=${groupId}` : "";
    return apiRequest(`/api/expense-tracker/users/${params}`);
  },

  // Get a specific user
  getById: (id: string): Promise<UserWithGroup> =>
    apiRequest(`/api/expense-tracker/users/${id}`),

  // Update a user
  update: (id: string, data: UserCreate): Promise<User> =>
    apiRequest(`/api/expense-tracker/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Delete a user
  delete: (id: string): Promise<{ message: string }> =>
    apiRequest(`/api/expense-tracker/users/${id}`, {
      method: "DELETE",
    }),

  // Get user's expense items
  getExpenseItems: (id: string): Promise<ExpenseItemWithUser[]> =>
    apiRequest(`/api/expense-tracker/users/${id}/expense-items`),
};

// Expense Items API
export const expenseItemsApi = {
  // Create a new expense item
  create: (data: ExpenseItemCreate): Promise<ExpenseItem> =>
    apiRequest("/api/expense-tracker/expense-items/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Get expense items with filters - backend filters by authenticated user
  getAll: (
    params: {
      category?: string;
      is_fixed?: boolean;
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<ExpenseItemResponse> => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
    const queryString = searchParams.toString();
    return apiRequest(
      `/api/expense-tracker/expense-items/${
        queryString ? `?${queryString}` : ""
      }`,
    );
  },

  // Get a specific expense item
  getById: (id: string): Promise<ExpenseItemWithUser> =>
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

  // Get expenses for an item
  getExpenses: (
    id: string,
    limit = 100,
    offset = 0,
  ): Promise<ExpenseWithDetails[]> =>
    apiRequest(
      `/api/expense-tracker/expense-items/${id}/expenses?limit=${limit}&offset=${offset}`,
    ),

  // Get all categories for the authenticated user
  getCategories: (): Promise<string[]> =>
    apiRequest("/api/expense-tracker/expense-items/categories/"),
};

// Expenses API
export const expensesApi = {
  // Create a new expense
  create: (data: ExpenseCreate): Promise<Expense> =>
    apiRequest("/api/expense-tracker/expenses/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Get expenses with filters - backend filters by authenticated user
  getAll: (
    params: {
      item_id?: string;
      category?: string;
      currency?: string;
      start_date?: string;
      end_date?: string;
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<ExpenseResponse> => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
    const queryString = searchParams.toString();
    return apiRequest(
      `/api/expense-tracker/expenses/${queryString ? `?${queryString}` : ""}`,
    );
  },

  // Get a specific expense
  getById: (id: string): Promise<ExpenseWithDetails> =>
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

  // Get all currencies for the authenticated user
  getCurrencies: (): Promise<string[]> =>
    apiRequest("/api/expense-tracker/expenses/currencies/"),
};

// Income Sources API
export const incomeSourcesApi = {
  // Create a new income source
  create: (data: IncomeSourceCreate): Promise<IncomeSource> =>
    apiRequest("/api/expense-tracker/income-sources/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Get all income sources for the authenticated user
  getAll: (
    params: {
      category?: string;
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<IncomeSourceResponse> => {
    const { limit = 100, offset = 0, ...rest } = params;
    const searchParams = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
      ...Object.entries(rest).reduce(
        (acc, [key, value]) => {
          if (value !== undefined) {
            acc[key] = value.toString();
          }
          return acc;
        },
        {} as Record<string, string>,
      ),
    });
    return apiRequest(`/api/expense-tracker/income-sources/?${searchParams}`);
  },

  // Get a specific income source
  getById: (id: string): Promise<IncomeSourceWithUser> =>
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

  // Get all incomes for a specific income source
  getSourceIncomes: (
    sourceId: string,
    limit = 100,
    offset = 0,
  ): Promise<IncomeWithDetails[]> =>
    apiRequest(
      `/api/expense-tracker/income-sources/${sourceId}/incomes?limit=${limit}&offset=${offset}`,
    ),

  // Get all unique categories for the authenticated user
  getCategories: (): Promise<string[]> =>
    apiRequest("/api/expense-tracker/income-sources/categories/"),
};

// Incomes API
export const incomesApi = {
  // Create a new income record
  create: (data: IncomeCreate): Promise<Income> =>
    apiRequest("/api/expense-tracker/incomes/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Get incomes with filters - backend filters by authenticated user
  getAll: (
    params: {
      source_id?: string;
      category?: string;
      currency?: string;
      start_date?: string;
      end_date?: string;
      skip?: number;
      limit?: number;
    } = {},
  ): Promise<IncomeResponse> => {
    const { skip = 0, limit = 100, ...rest } = params;
    const searchParams = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
      ...Object.entries(rest).reduce(
        (acc, [key, value]) => {
          if (value !== undefined) {
            acc[key] = value.toString();
          }
          return acc;
        },
        {} as Record<string, string>,
      ),
    });
    return apiRequest(`/api/expense-tracker/incomes/?${searchParams}`);
  },

  // Get a specific income record
  getById: (id: string): Promise<IncomeWithDetails> =>
    apiRequest(`/api/expense-tracker/incomes/${id}`),

  // Update an income record
  update: (id: string, data: IncomeCreate): Promise<Income> =>
    apiRequest(`/api/expense-tracker/incomes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Delete an income record
  delete: (id: string): Promise<{ message: string }> =>
    apiRequest(`/api/expense-tracker/incomes/${id}`, {
      method: "DELETE",
    }),
};

// Dashboard API
export const dashboardApi = {
  // Get unified monthly dashboard data for authenticated user
  getMonthlyDashboard: (
    year: number,
    month: number,
    currency = "CLP",
  ): Promise<DashboardData> => {
    const params = new URLSearchParams({ currency });
    return apiRequest(
      `/api/expense-tracker/expenses/dashboard/monthly/${year}/${month}?${params.toString()}`,
    );
  },

  // Get unified monthly income dashboard data for authenticated user
  getMonthlyIncomeDashboard: (
    year: number,
    month: number,
    currency = "CLP",
  ): Promise<DashboardTableWithIncomes> => {
    const params = new URLSearchParams({ currency });
    return apiRequest(
      `/api/expense-tracker/incomes/dashboard/monthly/${year}/${month}/table?${params}`,
    );
  },
};

// Health check
export const healthApi = {
  check: (): Promise<{ status: string; version: string }> =>
    apiRequest("/api/health"),
};

// Utility functions
export const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  let d: Date;

  if (typeof date === "string") {
    // Handle different date formats
    if (date.includes("T") || date.includes("Z")) {
      // ISO datetime string - parse as is
      d = new Date(date);
    } else if (date.includes("/")) {
      // DD/MM/YYYY format
      const [day, month, year] = date.split("/");
      d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else if (date.includes("-") && date.split("-").length === 3) {
      // YYYY-MM-DD format - parse as local date to avoid timezone issues
      const [year, month, day] = date.split("-");
      d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      // Fallback to regular parsing
      d = new Date(date);
    }
  } else {
    d = date;
  }

  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (datetime: string | Date): string => {
  const d = typeof datetime === "string" ? new Date(datetime) : datetime;
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Export the ApiError class for error handling
export { ApiError };

// Default export with all APIs
const api = {
  groups: groupsApi,
  users: usersApi,
  expenseItems: expenseItemsApi,
  expenses: expensesApi,
  incomeSources: incomeSourcesApi,
  incomes: incomesApi,
  dashboard: dashboardApi,
  health: healthApi,
};

export default api;
