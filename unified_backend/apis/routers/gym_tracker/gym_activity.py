import logging as logger
from datetime import date, datetime, timedelta
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query

from models import (
    GymActivity,
    GymActivityCreate,
    GymActivityWithDetails,
    GymActivityResponse,
    GymDashboardStats,
)
from utils.auth import get_current_user
from utils.db import DatabaseModel

gym_activity_router = APIRouter()

# Module-level singleton for dependency injection
current_user_dependency = Depends(get_current_user)


@gym_activity_router.post("/", response_model=GymActivity)
async def create_activity(
    activity: GymActivityCreate, current_user: dict = current_user_dependency
):
    """Log a new gym activity"""
    try:
        user_id = current_user.get("uid")

        # Validate exercise exists
        exercise_check_query = """
            SELECT id FROM dradic_tech.exercises WHERE id = :exercise_id
        """
        exercise_exists = DatabaseModel.execute_query(
            exercise_check_query, {"exercise_id": str(activity.exercise_id)}
        )

        if not exercise_exists:
            raise HTTPException(status_code=400, detail="Exercise not found")

        # Validate sets and reps are positive
        if activity.sets <= 0 or activity.reps <= 0:
            raise HTTPException(
                status_code=400, detail="Sets and reps must be positive numbers"
            )

        # Validate weight if provided
        if activity.weight is not None and activity.weight < 0:
            raise HTTPException(status_code=400, detail="Weight cannot be negative")

        activity_data = activity.dict()
        activity_data["user_id"] = user_id

        new_activity = DatabaseModel.insert_record("gym_activity", activity_data)
        return GymActivity(**new_activity)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to create activity: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to create activity: {str(e)}"
        ) from e


@gym_activity_router.get("/", response_model=GymActivityResponse)
async def get_activities(
    exercise_id: Optional[UUID] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    current_user: dict = current_user_dependency,
):
    """Get user's gym activities with optional filters"""
    try:
        user_id = current_user.get("uid")

        query = """
            SELECT
                ga.id,
                ga.user_id,
                ga.exercise_id,
                ga.sets,
                ga.reps,
                ga.weight,
                ga.created_at,
                ga.updated_at,
                e.name as exercise_name,
                e.muscles_trained
            FROM dradic_tech.gym_activity ga
            JOIN dradic_tech.exercises e ON ga.exercise_id = e.id
            WHERE ga.user_id = :user_id
        """
        params = {"user_id": user_id}

        if exercise_id:
            query += " AND ga.exercise_id = :exercise_id"
            params["exercise_id"] = str(exercise_id)

        if start_date:
            query += " AND ga.created_at >= :start_date"
            params["start_date"] = str(start_date)

        if end_date:
            query += " AND ga.created_at <= :end_date"
            params["end_date"] = str(end_date)

        # Get total count
        count_query = f"SELECT COUNT(*) as total FROM ({query}) as subquery"
        total_count = DatabaseModel.execute_query(count_query, params)
        total = total_count[0]["total"] if total_count else 0

        # Add ordering and pagination
        query += " ORDER BY ga.created_at DESC LIMIT :limit OFFSET :offset"
        params["limit"] = str(limit)
        params["offset"] = str(offset)

        activities = DatabaseModel.execute_query(query, params)

        return GymActivityResponse(
            activities=[GymActivityWithDetails(**activity) for activity in activities],
            total_count=total,
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch activities: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch activities: {str(e)}"
        ) from e


@gym_activity_router.get("/{activity_id}", response_model=GymActivityWithDetails)
async def get_activity(
    activity_id: UUID, current_user: dict = current_user_dependency
):
    """Get a specific gym activity by ID"""
    try:
        user_id = current_user.get("uid")

        query = """
            SELECT
                ga.id,
                ga.user_id,
                ga.exercise_id,
                ga.sets,
                ga.reps,
                ga.weight,
                ga.created_at,
                ga.updated_at,
                e.name as exercise_name,
                e.muscles_trained
            FROM dradic_tech.gym_activity ga
            JOIN dradic_tech.exercises e ON ga.exercise_id = e.id
            WHERE ga.id = :activity_id AND ga.user_id = :user_id
        """
        activities = DatabaseModel.execute_query(
            query, {"activity_id": str(activity_id), "user_id": user_id}
        )

        if not activities:
            raise HTTPException(status_code=404, detail="Activity not found")

        return GymActivityWithDetails(**activities[0])
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch activity: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch activity: {str(e)}"
        ) from e


@gym_activity_router.put("/{activity_id}", response_model=GymActivity)
async def update_activity(
    activity_id: UUID,
    activity: GymActivityCreate,
    current_user: dict = current_user_dependency,
):
    """Update a gym activity"""
    try:
        user_id = current_user.get("uid")

        # Check if activity exists and belongs to user
        existing_query = """
            SELECT user_id FROM dradic_tech.gym_activity WHERE id = :activity_id
        """
        existing = DatabaseModel.execute_query(
            existing_query, {"activity_id": str(activity_id)}
        )

        if not existing:
            raise HTTPException(status_code=404, detail="Activity not found")

        if existing[0]["user_id"] != user_id:
            raise HTTPException(
                status_code=403, detail="Cannot update another user's activity"
            )

        # Validate exercise exists if changing
        if activity.exercise_id:
            exercise_check_query = """
                SELECT id FROM dradic_tech.exercises WHERE id = :exercise_id
            """
            exercise_exists = DatabaseModel.execute_query(
                exercise_check_query, {"exercise_id": str(activity.exercise_id)}
            )

            if not exercise_exists:
                raise HTTPException(status_code=400, detail="Exercise not found")

        # Validate sets and reps are positive
        if activity.sets <= 0 or activity.reps <= 0:
            raise HTTPException(
                status_code=400, detail="Sets and reps must be positive numbers"
            )

        # Validate weight if provided
        if activity.weight is not None and activity.weight < 0:
            raise HTTPException(status_code=400, detail="Weight cannot be negative")

        activity_data = activity.dict(exclude_unset=True)
        updated_activity = DatabaseModel.update_record(
            "gym_activity", str(activity_id), activity_data
        )

        if not updated_activity:
            raise HTTPException(status_code=404, detail="Activity not found")

        return GymActivity(**updated_activity)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update activity: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to update activity: {str(e)}"
        ) from e


@gym_activity_router.delete("/{activity_id}")
async def delete_activity(
    activity_id: UUID, current_user: dict = current_user_dependency
):
    """Delete a gym activity"""
    try:
        user_id = current_user.get("uid")

        # Check if activity exists and belongs to user
        existing_query = """
            SELECT user_id FROM dradic_tech.gym_activity WHERE id = :activity_id
        """
        existing = DatabaseModel.execute_query(
            existing_query, {"activity_id": str(activity_id)}
        )

        if not existing:
            raise HTTPException(status_code=404, detail="Activity not found")

        if existing[0]["user_id"] != user_id:
            raise HTTPException(
                status_code=403, detail="Cannot delete another user's activity"
            )

        deleted = DatabaseModel.delete_record("gym_activity", str(activity_id))

        if not deleted:
            raise HTTPException(status_code=404, detail="Activity not found")

        return {"message": "Activity deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete activity: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to delete activity: {str(e)}"
        ) from e


@gym_activity_router.get("/dashboard/stats", response_model=GymDashboardStats)
async def get_dashboard_stats(current_user: dict = current_user_dependency):
    """Get dashboard statistics for the current user"""
    try:
        user_id = current_user.get("uid")

        # Get current month's start and end dates
        today = datetime.now()
        first_day_of_month = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        # Get total workouts this month
        workouts_query = """
            SELECT COUNT(*) as count
            FROM dradic_tech.gym_activity
            WHERE user_id = :user_id
            AND created_at >= :start_date
        """
        workouts_result = DatabaseModel.execute_query(
            workouts_query, {"user_id": user_id, "start_date": str(first_day_of_month)}
        )
        total_workouts = workouts_result[0]["count"] if workouts_result else 0

        # Get total weight lifted this month
        weight_query = """
            SELECT SUM(sets * reps * COALESCE(weight, 0)) as total_weight
            FROM dradic_tech.gym_activity
            WHERE user_id = :user_id
            AND created_at >= :start_date
            AND weight IS NOT NULL
        """
        weight_result = DatabaseModel.execute_query(
            weight_query, {"user_id": user_id, "start_date": str(first_day_of_month)}
        )
        total_weight = float(weight_result[0]["total_weight"] or 0) if weight_result else 0.0

        # Get activities by date (last 30 days)
        thirty_days_ago = today - timedelta(days=30)
        activities_by_date_query = """
            SELECT
                DATE(created_at) as activity_date,
                COUNT(*) as count
            FROM dradic_tech.gym_activity
            WHERE user_id = :user_id
            AND created_at >= :start_date
            GROUP BY DATE(created_at)
            ORDER BY activity_date
        """
        activities_by_date_result = DatabaseModel.execute_query(
            activities_by_date_query,
            {"user_id": user_id, "start_date": str(thirty_days_ago)},
        )
        activities_by_date = {
            str(row["activity_date"]): row["count"]
            for row in activities_by_date_result
        } if activities_by_date_result else {}

        # Get muscle groups distribution (last 30 days)
        muscle_groups_query = """
            SELECT
                e.muscles_trained,
                ga.sets,
                ga.reps
            FROM dradic_tech.gym_activity ga
            JOIN dradic_tech.exercises e ON ga.exercise_id = e.id
            WHERE ga.user_id = :user_id
            AND ga.created_at >= :start_date
        """
        muscle_groups_result = DatabaseModel.execute_query(
            muscle_groups_query,
            {"user_id": user_id, "start_date": str(thirty_days_ago)},
        )

        # Calculate muscle group totals (based on volume: sets * reps * percentage)
        muscle_totals = {}
        if muscle_groups_result:
            for row in muscle_groups_result:
                muscles = row["muscles_trained"]
                sets = row["sets"]
                reps = row["reps"]
                volume = sets * reps

                for muscle, percentage in muscles.items():
                    muscle_volume = volume * (percentage / 100)
                    muscle_totals[muscle] = muscle_totals.get(muscle, 0) + muscle_volume

        # Find most trained muscle
        most_trained_muscle = None
        if muscle_totals:
            most_trained_muscle = max(muscle_totals, key=muscle_totals.get)

        return GymDashboardStats(
            total_workouts_this_month=total_workouts,
            most_trained_muscle=most_trained_muscle,
            total_weight_lifted=total_weight if total_weight > 0 else None,
            activities_by_date=activities_by_date,
            muscle_groups_distribution=muscle_totals,
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch dashboard stats: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch dashboard stats: {str(e)}"
        ) from e
