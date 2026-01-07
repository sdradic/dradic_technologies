import logging as logger
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query

from models import Exercise, ExerciseCreate
from utils.auth import get_current_user
from utils.db import DatabaseModel

exercises_router = APIRouter()

# Module-level singleton for dependency injection
current_user_dependency = Depends(get_current_user)


@exercises_router.post("/", response_model=Exercise)
async def create_exercise(
    exercise: ExerciseCreate, current_user: dict = current_user_dependency
):
    """Create a new exercise (admin only for now, but open for all authenticated users)"""
    try:
        # Check if exercise with same name already exists
        check_query = """
            SELECT id FROM dradic_tech.exercises WHERE LOWER(name) = LOWER(:name)
        """
        existing = DatabaseModel.execute_query(check_query, {"name": exercise.name})

        if existing:
            raise HTTPException(
                status_code=400,
                detail=f"Exercise with name '{exercise.name}' already exists"
            )

        exercise_data = exercise.dict()
        new_exercise = DatabaseModel.insert_record("exercises", exercise_data)
        return Exercise(**new_exercise)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to create exercise: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to create exercise: {str(e)}"
        ) from e


@exercises_router.get("/", response_model=list[Exercise])
async def get_exercises(
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    search: Optional[str] = None,
    current_user: dict = current_user_dependency,
):
    """Get all exercises (requires authentication)"""
    try:
        query = """
            SELECT id, name, muscles_trained, created_at, updated_at
            FROM dradic_tech.exercises
        """
        params = {}

        if search:
            query += " WHERE LOWER(name) LIKE LOWER(:search)"
            params["search"] = f"%{search}%"

        query += " ORDER BY name ASC LIMIT :limit OFFSET :offset"
        params["limit"] = str(limit)
        params["offset"] = str(offset)

        exercises = DatabaseModel.execute_query(query, params)
        return [Exercise(**exercise) for exercise in exercises]
    except Exception as e:
        logger.error(f"Failed to fetch exercises: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch exercises: {str(e)}"
        ) from e


@exercises_router.get("/{exercise_id}", response_model=Exercise)
async def get_exercise(
    exercise_id: UUID, current_user: dict = current_user_dependency
):
    """Get a specific exercise by ID"""
    try:
        query = """
            SELECT id, name, muscles_trained, created_at, updated_at
            FROM dradic_tech.exercises
            WHERE id = :exercise_id
        """
        exercises = DatabaseModel.execute_query(query, {"exercise_id": str(exercise_id)})

        if not exercises:
            raise HTTPException(status_code=404, detail="Exercise not found")

        return Exercise(**exercises[0])
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch exercise: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch exercise: {str(e)}"
        ) from e


@exercises_router.put("/{exercise_id}", response_model=Exercise)
async def update_exercise(
    exercise_id: UUID,
    exercise: ExerciseCreate,
    current_user: dict = current_user_dependency,
):
    """Update an exercise (authenticated users can update)"""
    try:
        # Check if exercise exists
        existing_query = """
            SELECT id FROM dradic_tech.exercises WHERE id = :exercise_id
        """
        existing = DatabaseModel.execute_query(
            existing_query, {"exercise_id": str(exercise_id)}
        )

        if not existing:
            raise HTTPException(status_code=404, detail="Exercise not found")

        # Check if new name conflicts with another exercise
        if exercise.name:
            name_check_query = """
                SELECT id FROM dradic_tech.exercises
                WHERE LOWER(name) = LOWER(:name) AND id != :exercise_id
            """
            name_conflict = DatabaseModel.execute_query(
                name_check_query, {"name": exercise.name, "exercise_id": str(exercise_id)}
            )

            if name_conflict:
                raise HTTPException(
                    status_code=400,
                    detail=f"Exercise with name '{exercise.name}' already exists"
                )

        exercise_data = exercise.dict(exclude_unset=True)
        updated_exercise = DatabaseModel.update_record(
            "exercises", str(exercise_id), exercise_data
        )

        if not updated_exercise:
            raise HTTPException(status_code=404, detail="Exercise not found")

        return Exercise(**updated_exercise)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update exercise: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to update exercise: {str(e)}"
        ) from e


@exercises_router.delete("/{exercise_id}")
async def delete_exercise(
    exercise_id: UUID, current_user: dict = current_user_dependency
):
    """Delete an exercise (admin only in production, but allowing for all now)"""
    try:
        # Check if exercise exists
        existing_query = """
            SELECT id FROM dradic_tech.exercises WHERE id = :exercise_id
        """
        existing = DatabaseModel.execute_query(
            existing_query, {"exercise_id": str(exercise_id)}
        )

        if not existing:
            raise HTTPException(status_code=404, detail="Exercise not found")

        # Check if any activities reference this exercise
        activity_check_query = """
            SELECT COUNT(*) as count FROM dradic_tech.gym_activity
            WHERE exercise_id = :exercise_id
        """
        activity_count = DatabaseModel.execute_query(
            activity_check_query, {"exercise_id": str(exercise_id)}
        )

        if activity_count and activity_count[0]["count"] > 0:
            raise HTTPException(
                status_code=400,
                detail="Cannot delete exercise that has associated activities"
            )

        deleted = DatabaseModel.delete_record("exercises", str(exercise_id))

        if not deleted:
            raise HTTPException(status_code=404, detail="Exercise not found")

        return {"message": "Exercise deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete exercise: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to delete exercise: {str(e)}"
        ) from e
