import logging as logger
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException

from models import User, UserCreate, UserGroupMembership, UserWithGroups
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

        # Note: Groups are now managed separately through user_groups table

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


@users_router.get("/", response_model=List[UserWithGroups])
async def get_users(
    group_id: Optional[UUID] = None, current_user: dict = current_user_dependency
):
    """Get all users, optionally filtered by group"""
    try:
        # Build the query with optional group filter
        if group_id:
            # Get users in a specific group
            query = """
                SELECT DISTINCT
                    u.id, u.name, u.email, u.role, u.created_at
                FROM dradic_tech.users u
                JOIN dradic_tech.user_groups ug ON u.id = ug.user_id
                WHERE ug.group_id = :group_id
                ORDER BY u.name
            """
            params = {"group_id": group_id}
            users = DatabaseModel.execute_query(query, params)
        else:
            # Get all users
            query = """
                SELECT
                    u.id, u.name, u.email, u.role, u.created_at
                FROM dradic_tech.users u
                ORDER BY u.name
            """
            users = DatabaseModel.execute_query(query, {})

        # For each user, get their groups
        result = []
        for user in users:
            groups_query = """
                SELECT g.id, g.name, g.description, g.created_at
                FROM dradic_tech.groups g
                JOIN dradic_tech.user_groups ug ON g.id = ug.group_id
                WHERE ug.user_id = :user_id
                ORDER BY g.name
            """
            groups = DatabaseModel.execute_query(groups_query, {"user_id": user["id"]})

            # Convert groups to Group objects
            from models import Group

            user_groups = [Group(**group) for group in groups]

            user_data = {**user, "groups": user_groups}
            result.append(UserWithGroups(**user_data))

        return result
    except Exception as e:
        logger.error(f"Failed to fetch users: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch users: {str(e)}"
        ) from e


@users_router.get("/{user_id}", response_model=UserWithGroups)
async def get_user(user_id: str, current_user: dict = current_user_dependency):
    """Get a specific user by ID"""
    try:
        # Get user data
        user_query = """
            SELECT
                u.id, u.name, u.email, u.role, u.created_at
            FROM dradic_tech.users u
            WHERE u.id = :user_id
        """
        users = DatabaseModel.execute_query(user_query, {"user_id": user_id})

        if not users:
            raise HTTPException(status_code=404, detail="User not found")

        user = users[0]

        # Get user's groups
        groups_query = """
            SELECT g.id, g.name, g.description, g.created_at
            FROM dradic_tech.groups g
            JOIN dradic_tech.user_groups ug ON g.id = ug.group_id
            WHERE ug.user_id = :user_id
            ORDER BY g.name
        """
        groups = DatabaseModel.execute_query(groups_query, {"user_id": user_id})

        # Convert groups to Group objects
        from models import Group

        user_groups = [Group(**group) for group in groups]

        user_data = {**user, "groups": user_groups}
        return UserWithGroups(**user_data)
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

        # Note: Groups are now managed separately through user_groups table

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


@users_router.post("/{user_id}/groups/{group_id}")
async def add_user_to_group(
    user_id: str, group_id: UUID, current_user: dict = current_user_dependency
):
    """Add a user to a group"""
    try:
        # Check if user exists
        user_check_query = """
            SELECT COUNT(*) as count
            FROM dradic_tech.users
            WHERE id = :user_id
        """
        user_exists = DatabaseModel.execute_query(
            user_check_query, {"user_id": user_id}
        )

        if not user_exists or user_exists[0]["count"] == 0:
            raise HTTPException(status_code=404, detail="User not found")

        # Check if group exists
        group_check_query = """
            SELECT COUNT(*) as count
            FROM dradic_tech.groups
            WHERE id = :group_id
        """
        group_exists = DatabaseModel.execute_query(
            group_check_query, {"group_id": group_id}
        )

        if not group_exists or group_exists[0]["count"] == 0:
            raise HTTPException(status_code=404, detail="Group not found")

        # Check if user is already in the group
        existing_membership_query = """
            SELECT COUNT(*) as count
            FROM dradic_tech.user_groups
            WHERE user_id = :user_id AND group_id = :group_id
        """
        existing_membership = DatabaseModel.execute_query(
            existing_membership_query, {"user_id": user_id, "group_id": group_id}
        )

        if existing_membership and existing_membership[0]["count"] > 0:
            raise HTTPException(status_code=400, detail="User is already in this group")

        # Add user to group
        insert_query = """
            INSERT INTO dradic_tech.user_groups (user_id, group_id)
            VALUES (:user_id, :group_id)
        """
        DatabaseModel.execute_query(
            insert_query, {"user_id": user_id, "group_id": group_id}
        )

        return {"message": f"User {user_id} added to group {group_id} successfully"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to add user to group: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to add user to group: {str(e)}"
        ) from e


@users_router.delete("/{user_id}/groups/{group_id}")
async def remove_user_from_group(
    user_id: str, group_id: UUID, current_user: dict = current_user_dependency
):
    """Remove a user from a group"""
    try:
        # Check if user is in the group
        membership_query = """
            SELECT COUNT(*) as count
            FROM dradic_tech.user_groups
            WHERE user_id = :user_id AND group_id = :group_id
        """
        membership = DatabaseModel.execute_query(
            membership_query, {"user_id": user_id, "group_id": group_id}
        )

        if not membership or membership[0]["count"] == 0:
            raise HTTPException(status_code=404, detail="User is not in this group")

        # Remove user from group
        delete_query = """
            DELETE FROM dradic_tech.user_groups
            WHERE user_id = :user_id AND group_id = :group_id
        """
        DatabaseModel.execute_query(
            delete_query, {"user_id": user_id, "group_id": group_id}
        )

        return {"message": f"User {user_id} removed from group {group_id} successfully"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to remove user from group: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to remove user from group: {str(e)}"
        ) from e


@users_router.get("/{user_id}/groups")
async def get_user_groups(user_id: str, current_user: dict = current_user_dependency):
    """Get all groups for a user"""
    try:
        # Ensure user can only access their own groups
        if user_id != current_user.get("uid"):
            raise HTTPException(
                status_code=403, detail="Cannot access another user's groups"
            )

        query = """
            SELECT
                ug.user_id, ug.group_id,
                g.name as group_name, g.description as group_description
            FROM dradic_tech.user_groups ug
            JOIN dradic_tech.groups g ON ug.group_id = g.id
            WHERE ug.user_id = :user_id
            ORDER BY g.name
        """

        groups = DatabaseModel.execute_query(query, {"user_id": user_id})
        return [UserGroupMembership(**group) for group in groups]

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch user groups: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch user groups: {str(e)}"
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
