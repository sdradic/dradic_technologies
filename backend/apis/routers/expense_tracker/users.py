import logging as logger
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, HTTPException
from models import User, UserCreate, UserWithGroup
from utils.db import DatabaseModel

users_router = APIRouter()


@users_router.post("/", response_model=User)
async def create_user(user: UserCreate):
    """Create a new user"""
    try:
        # Check if email already exists
        email_check_query = """
            SELECT COUNT(*) as count
            FROM tallyup.users
            WHERE email = :email
        """
        email_exists = DatabaseModel.execute_query(
            email_check_query, {"email": user.email}
        )

        if email_exists and email_exists[0]["count"] > 0:
            raise HTTPException(status_code=400, detail="Email already registered")

        # Validate group_id if provided
        if user.group_id:
            group_check_query = """
                SELECT COUNT(*) as count
                FROM tallyup.groups
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
async def get_users(group_id: Optional[UUID] = None):
    """Get all users, optionally filtered by group"""
    try:
        query = """
            SELECT
                u.id, u.name, u.email, u.created_at, u.group_id,
                g.name as group_name, g.description as group_description
            FROM tallyup.users u
            LEFT JOIN tallyup.groups g ON u.group_id = g.id
        """
        params = {}

        if group_id:
            query += " WHERE u.group_id = :group_id"
            params["group_id"] = group_id

        query += " ORDER BY u.created_at DESC"

        users = DatabaseModel.execute_query(query, params)
        return [UserWithGroup(**user) for user in users]
    except Exception as e:
        logger.error(f"Failed to fetch users: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch users: {str(e)}"
        ) from e


@users_router.get("/{user_id}", response_model=UserWithGroup)
async def get_user(user_id: str):
    """Get a specific user by ID"""
    try:
        query = """
            SELECT
                u.id, u.name, u.email, u.created_at, u.group_id,
                g.name as group_name, g.description as group_description
            FROM tallyup.users u
            LEFT JOIN tallyup.groups g ON u.group_id = g.id
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
async def update_user(user: UserCreate):
    """Update a user"""
    try:
        # Validate group_id if provided
        if user.group_id:
            group_check_query = """
                SELECT COUNT(*) as count
                FROM tallyup.groups
                WHERE id = :group_id
            """
            group_exists = DatabaseModel.execute_query(
                group_check_query, {"group_id": user.group_id}
            )

            if not group_exists or group_exists[0]["count"] == 0:
                raise HTTPException(status_code=400, detail="Group not found")

        user_data = user.dict(exclude_unset=True)
        updated_user = DatabaseModel.update_record("users", user.id, user_data)

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
async def delete_user(user_id: str):
    """Delete a user"""
    try:
        # Check if user has expense items
        expense_item_check_query = """
            SELECT COUNT(*) as count
            FROM tallyup.expense_items
            WHERE user_id = :user_id
        """
        expense_items = DatabaseModel.execute_query(
            expense_item_check_query, {"user_id": user_id}
        )

        if expense_items and expense_items[0]["count"] > 0:
            raise HTTPException(
                status_code=400,
                detail="Cannot delete user that has expense items. Delete expense items first.",
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
async def get_user_expense_items(user_id: str):
    """Get all expense items for a user"""
    try:
        query = """
            SELECT ei.id, ei.name, ei.category, ei.is_fixed, ei.user_id,
                   u.name as user_name, u.email as user_email
            FROM tallyup.expense_items ei
            JOIN tallyup.users u ON ei.user_id = u.id
            WHERE ei.user_id = :user_id
            ORDER BY ei.name
        """
        items = DatabaseModel.execute_query(query, {"user_id": user_id})
        return items
    except Exception as e:
        logger.error(f"Failed to fetch user expense items: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch user expense items: {str(e)}"
        ) from e
