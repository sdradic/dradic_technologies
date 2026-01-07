// TypeScript types for Gym Tracker

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscles_trained: Record<string, number>; // {"chest": 60, "triceps": 30}
  created_at: string;
  updated_at: string;
}

export interface ExerciseCreate {
  name: string;
  muscles_trained: Record<string, number>;
}

export interface GymActivity {
  id: string;
  user_id: string;
  exercise_id: string;
  sets: number;
  reps: number;
  weight?: number | null;
  created_at: string;
  updated_at: string;
}

export interface GymActivityCreate {
  exercise_id: string;
  sets: number;
  reps: number;
  weight?: number | null;
}

export interface GymActivityWithDetails extends GymActivity {
  exercise_name: string;
  muscles_trained: Record<string, number>;
}

export interface GymActivityResponse {
  activities: GymActivityWithDetails[];
  total_count: number;
}

export interface GymDashboardStats {
  total_workouts_this_month: number;
  most_trained_muscle: string | null;
  total_weight_lifted: number | null;
  activities_by_date: Record<string, number>;
  muscle_groups_distribution: Record<string, number>;
}
