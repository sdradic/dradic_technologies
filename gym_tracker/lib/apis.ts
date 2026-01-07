// API Client for Gym Tracker
import { supabase } from "./supabase";
import type {
  Exercise,
  ExerciseCreate,
  GymActivity,
  GymActivityCreate,
  GymActivityResponse,
  GymDashboardStats,
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
    console.log("✅ Auth token present, length:", session.access_token.length);
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

// Exercises API
export const exercisesApi = {
  // Create a new exercise
  create: (data: ExerciseCreate): Promise<Exercise> =>
    apiRequest("/api/gym-tracker/exercises/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Get all exercises
  getAll: (search?: string): Promise<Exercise[]> => {
    const params = search ? `?search=${encodeURIComponent(search)}` : "";
    return apiRequest(`/api/gym-tracker/exercises/${params}`);
  },

  // Get a specific exercise
  getById: (id: string): Promise<Exercise> =>
    apiRequest(`/api/gym-tracker/exercises/${id}`),

  // Update an exercise
  update: (id: string, data: ExerciseCreate): Promise<Exercise> =>
    apiRequest(`/api/gym-tracker/exercises/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Delete an exercise
  delete: (id: string): Promise<{ message: string }> =>
    apiRequest(`/api/gym-tracker/exercises/${id}`, {
      method: "DELETE",
    }),
};

// Gym Activities API
export const gymActivitiesApi = {
  // Create a new activity
  create: (data: GymActivityCreate): Promise<GymActivity> =>
    apiRequest("/api/gym-tracker/activities/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Get activities with filters
  getAll: (params: {
    exercise_id?: string;
    start_date?: string;
    end_date?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<GymActivityResponse> => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
    const queryString = searchParams.toString();
    return apiRequest(
      `/api/gym-tracker/activities/${queryString ? `?${queryString}` : ""}`
    );
  },

  // Get a specific activity
  getById: (id: string): Promise<GymActivity> =>
    apiRequest(`/api/gym-tracker/activities/${id}`),

  // Update an activity
  update: (id: string, data: GymActivityCreate): Promise<GymActivity> =>
    apiRequest(`/api/gym-tracker/activities/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Delete an activity
  delete: (id: string): Promise<{ message: string }> =>
    apiRequest(`/api/gym-tracker/activities/${id}`, {
      method: "DELETE",
    }),

  // Get dashboard stats
  getDashboardStats: (): Promise<GymDashboardStats> =>
    apiRequest("/api/gym-tracker/activities/dashboard/stats"),
};

// Export the ApiError class for error handling
export { ApiError };

// Default export with all APIs
const api = {
  exercises: exercisesApi,
  activities: gymActivitiesApi,
};

export default api;
