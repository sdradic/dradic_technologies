"use client";

import { useEffect, useState } from "react";
import { exercisesApi, gymActivitiesApi } from "@/lib/apis";
import type { Exercise, GymActivityCreate } from "@/lib/types";
import { AuthGuard } from "@/components/AuthGuard";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";

export default function LogWorkoutPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreateExercise, setShowCreateExercise] = useState(false);

  // Form state
  const [selectedExerciseId, setSelectedExerciseId] = useState("");
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState<number | "">("");
  const [isCalisthenics, setIsCalisthenics] = useState(false);

  // New exercise form state
  const [newExerciseName, setNewExerciseName] = useState("");
  const [musclePercentages, setMusclePercentages] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      setIsLoading(true);
      const data = await exercisesApi.getAll();
      setExercises(data);
    } catch (error) {
      console.error("Failed to load exercises:", error);
      toast.error("Failed to load exercises");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitActivity = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedExerciseId) {
      toast.error("Please select an exercise");
      return;
    }

    const activityData: GymActivityCreate = {
      exercise_id: selectedExerciseId,
      sets,
      reps,
      weight: isCalisthenics || weight === "" ? null : Number(weight),
    };

    try {
      setIsSubmitting(true);
      await gymActivitiesApi.create(activityData);
      toast.success("Workout logged successfully!");

      // Reset form
      setSelectedExerciseId("");
      setSets(3);
      setReps(10);
      setWeight("");
      setIsCalisthenics(false);
    } catch (error) {
      console.error("Failed to log workout:", error);
      toast.error("Failed to log workout");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateExercise = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate muscle percentages total 100
    const total = Object.values(musclePercentages).reduce(
      (sum, val) => sum + val,
      0
    );
    if (Math.abs(total - 100) > 0.1) {
      toast.error("Muscle percentages must total 100%");
      return;
    }

    try {
      const newExercise = await exercisesApi.create({
        name: newExerciseName,
        muscles_trained: musclePercentages,
      });
      toast.success("Exercise created successfully!");
      setExercises([...exercises, newExercise]);
      setShowCreateExercise(false);
      setNewExerciseName("");
      setMusclePercentages({});
      setSelectedExerciseId(newExercise.id);
    } catch (error) {
      console.error("Failed to create exercise:", error);
      toast.error("Failed to create exercise");
    }
  };

  const addMuscleGroup = () => {
    const muscleName = prompt("Enter muscle group name (e.g., chest, back):");
    if (muscleName && !musclePercentages[muscleName.toLowerCase()]) {
      setMusclePercentages({
        ...musclePercentages,
        [muscleName.toLowerCase()]: 0,
      });
    }
  };

  const updateMusclePercentage = (muscle: string, value: number) => {
    setMusclePercentages({
      ...musclePercentages,
      [muscle]: Math.max(0, Math.min(100, value)),
    });
  };

  const totalPercentage = Object.values(musclePercentages).reduce(
    (sum, val) => sum + val,
    0
  );

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Log Workout
        </h1>

        {/* Create Exercise Section */}
        {!showCreateExercise ? (
          <button
            onClick={() => setShowCreateExercise(true)}
            className="text-primary-600 dark:text-primary-400 hover:underline"
          >
            + Create New Exercise
          </button>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Create New Exercise
            </h2>
            <form onSubmit={handleCreateExercise} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Exercise Name
                </label>
                <input
                  type="text"
                  value={newExerciseName}
                  onChange={(e) => setNewExerciseName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Muscles Trained (Total: {totalPercentage.toFixed(0)}%)
                  </label>
                  <button
                    type="button"
                    onClick={addMuscleGroup}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    + Add Muscle
                  </button>
                </div>
                {Object.keys(musclePercentages).length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Click &quot;Add Muscle&quot; to add muscle groups
                  </p>
                ) : (
                  <div className="space-y-2">
                    {Object.keys(musclePercentages).map((muscle) => (
                      <div key={muscle} className="flex items-center gap-2">
                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize w-24">
                          {muscle}
                        </span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={musclePercentages[muscle]}
                          onChange={(e) =>
                            updateMusclePercentage(
                              muscle,
                              Number(e.target.value)
                            )
                          }
                          className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          %
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const newPercentages = { ...musclePercentages };
                            delete newPercentages[muscle];
                            setMusclePercentages(newPercentages);
                          }}
                          className="text-red-600 dark:text-red-400 hover:underline text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={totalPercentage !== 100}
                  className="flex-1 py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Exercise
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateExercise(false);
                    setNewExerciseName("");
                    setMusclePercentages({});
                  }}
                  className="py-2 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Log Workout Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Log Your Workout
          </h2>
          <form onSubmit={handleSubmitActivity} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Exercise
              </label>
              <select
                value={selectedExerciseId}
                onChange={(e) => setSelectedExerciseId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select an exercise</option>
                {exercises.map((exercise) => (
                  <option key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sets
                </label>
                <input
                  type="number"
                  min="1"
                  value={sets}
                  onChange={(e) => setSets(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reps
                </label>
                <input
                  type="number"
                  min="1"
                  value={reps}
                  onChange={(e) => setReps(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id="calisthenics"
                  checked={isCalisthenics}
                  onChange={(e) => {
                    setIsCalisthenics(e.target.checked);
                    if (e.target.checked) setWeight("");
                  }}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label
                  htmlFor="calisthenics"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Calisthenics (bodyweight)
                </label>
              </div>
              {!isCalisthenics && (
                <>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={weight}
                    onChange={(e) =>
                      setWeight(e.target.value ? Number(e.target.value) : "")
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="Optional"
                  />
                </>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Logging..." : "Log Workout"}
            </button>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
}
