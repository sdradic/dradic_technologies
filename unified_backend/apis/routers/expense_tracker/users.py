import logging as logger
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException

from models import User, UserCreate, UserWithGroup
from utils.auth import get_current_user
from utils.db import DatabaseModel

users_router = APIRouter()

# Module-level singleton for dependency injection
current_user_dependency = Depends(get_current_user)


@users_router.post("/", response_model=User)
async def create_user(user: UserCreate, current_user: dict = current_user_dependency):
    """Create a new user"""
    try:
        # Ensure user can only create users for themselves or in their group
        if user.id != current_user.get("uid"):
            raise HTTPException(
                status_code=403, detail="Cannot create user for another user"
            )

        # Check if user already exists
        existing_user_query = """
            SELECT COUNT(*) as count
            FROM dradic_tech.users
            WHERE id = :user_id
        """
        existing_user = DatabaseModel.execute_query(
            existing_user_query, {"user_id": user.id}
        )

        if existing_user and existing_user[0]["count"] > 0:
            raise HTTPException(status_code=400, detail="User already exists")

        # Validate group exists if group_id is provided
        if user.group_id:
            group_check_query = """
                SELECT COUNT(*) as count
                FROM dradic_tech.groups
                WHERE id = :group_id
            """
            group_exists = DatabaseModel.execute_query(
                group_check_query, {"group_id": user.group_id}
            )

            if not group_exists or group_exists[0]["count"] == 0:
                raise HTTPException(status_code=400, detail="Group not found")

        user_data = user.dict()
        new_user = DatabaseModel.insert_record("users", user_data)
        return User(**new_user)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to create user: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to create user: {str(e)}"
        ) from e


@users_router.get("/", response_model=List[UserWithGroup])
async def get_users(
    group_id: Optional[UUID] = None, current_user: dict = current_user_dependency
):
    """Get all users, optionally filtered by group"""
    try:
        # Build the query with optional group filter
        query = """
            SELECT
                u.id, u.name, u.email, u.group_id, u.created_at,
                g.name as group_name, g.description as group_description
            FROM dradic_tech.users u
            LEFT JOIN dradic_tech.groups g ON u.group_id = g.id
        """
        params = {}

        if group_id:
            query += " WHERE u.group_id = :group_id"
            params["group_id"] = group_id

        query += " ORDER BY u.name"

        users = DatabaseModel.execute_query(query, params)
        return [UserWithGroup(**user) for user in users]
    except Exception as e:
        logger.error(f"Failed to fetch users: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch users: {str(e)}"
        ) from e


@users_router.get("/{user_id}", response_model=UserWithGroup)
async def get_user(user_id: str, current_user: dict = current_user_dependency):
    """Get a specific user by ID"""
    try:
        query = """
            SELECT
                u.id, u.name, u.email, u.group_id, u.created_at,
                g.name as group_name, g.description as group_description
            FROM dradic_tech.users u
            LEFT JOIN dradic_tech.groups g ON u.group_id = g.id
            WHERE u.id = :user_id
        """
        users = DatabaseModel.execute_query(query, {"user_id": user_id})

        if not users:
            raise HTTPException(status_code=404, detail="User not found")

        return UserWithGroup(**users[0])
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch user: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch user: {str(e)}"
        ) from e


@users_router.put("/{user_id}", response_model=User)
async def update_user(
    user_id: str, user: UserCreate, current_user: dict = current_user_dependency
):
    """Update a user"""
    try:
        # Ensure user can only update themselves
        if user_id != current_user.get("uid"):
            raise HTTPException(status_code=403, detail="Cannot update another user")

        # Ensure the user_id in the update matches the current user
        if user.id != current_user.get("uid"):
            raise HTTPException(status_code=403, detail="Cannot change user ID")

        # Validate group exists if group_id is being changed
        if user.group_id:
            group_check_query = """
                SELECT COUNT(*) as count
                FROM dradic_tech.groups
                WHERE id = :group_id
            """
            group_exists = DatabaseModel.execute_query(
                group_check_query, {"group_id": user.group_id}
            )

            if not group_exists or group_exists[0]["count"] == 0:
                raise HTTPException(status_code=400, detail="Group not found")

        user_data = user.dict(exclude_unset=True)
        updated_user = DatabaseModel.update_record("users", user_id, user_data)

        if not updated_user:
            raise HTTPException(status_code=404, detail="User not found")

        return User(**updated_user)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update user: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to update user: {str(e)}"
        ) from e


@users_router.delete("/{user_id}")
async def delete_user(user_id: str, current_user: dict = current_user_dependency):
    """Delete a user"""
    try:
        # Ensure user can only delete themselves
        if user_id != current_user.get("uid"):
            raise HTTPException(status_code=403, detail="Cannot delete another user")

        # Check if user has expense items
        expense_items_check_query = """
            SELECT COUNT(*) as count
            FROM dradic_tech.expense_items
            WHERE user_id = :user_id
        """
        expense_items = DatabaseModel.execute_query(
            expense_items_check_query, {"user_id": user_id}
        )

        if expense_items and expense_items[0]["count"] > 0:
            raise HTTPException(
                status_code=400,
                detail="Cannot delete user that has expense items. Delete expense items first.",
            )

        # Check if user has income sources
        income_sources_check_query = """
            SELECT COUNT(*) as count
            FROM dradic_tech.income_sources
            WHERE user_id = :user_id
        """
        income_sources = DatabaseModel.execute_query(
            income_sources_check_query, {"user_id": user_id}
        )

        if income_sources and income_sources[0]["count"] > 0:
            raise HTTPException(
                status_code=400,
                detail="Cannot delete user that has income sources. Delete income sources first.",
            )

        deleted = DatabaseModel.delete_record("users", user_id)

        if not deleted:
            raise HTTPException(status_code=404, detail="User not found")

        return {"message": "User deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete user: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to delete user: {str(e)}"
        ) from e


@users_router.get("/{user_id}/expense-items")
async def get_user_expense_items(
    user_id: str, current_user: dict = current_user_dependency
):
    """Get all expense items for a user"""
    try:
        # Ensure user can only access their own expense items
        if user_id != current_user.get("uid"):
            raise HTTPException(
                status_code=403, detail="Cannot access another user's expense items"
            )

        query = """
            SELECT
                ei.id, ei.name, ei.category, ei.is_fixed, ei.user_id,
                u.name as user_name, u.email as user_email
            FROM dradic_tech.expense_items ei
            JOIN dradic_tech.users u ON ei.user_id = u.id
            WHERE ei.user_id = :user_id
            ORDER BY ei.name
        """

        expense_items = DatabaseModel.execute_query(query, {"user_id": user_id})
        return expense_items
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch user expense items: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch user expense items: {str(e)}"
        ) from e
