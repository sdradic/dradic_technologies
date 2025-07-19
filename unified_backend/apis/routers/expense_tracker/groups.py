import logging as logger
from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException

from models import Group, GroupCreate
from utils.auth import get_current_user
from utils.db import DatabaseModel

groups_router = APIRouter()

# Module-level singleton for dependency injection
current_user_dependency = Depends(get_current_user)


@groups_router.post("/", response_model=Group)
async def create_group(
    group: GroupCreate, current_user: dict = current_user_dependency
):
    """Create a new group"""
    try:
        # For now, allow any authenticated user to create groups
        # In a real application, you might want to add ownership logic
        pass

        group_data = group.dict()
        new_group = DatabaseModel.insert_record("groups", group_data)
        return Group(**new_group)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to create group: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to create group: {str(e)}"
        ) from e


@groups_router.get("/", response_model=List[Group])
async def get_groups(current_user: dict = current_user_dependency):
    """Get all groups that the current user belongs to"""
    try:
        query = """
            SELECT g.id, g.name, g.description, g.created_at
            FROM dradic_tech.groups g
            JOIN dradic_tech.users u ON g.id = u.group_id
            WHERE u.id = :user_id
            ORDER BY g.name
        """
        groups = DatabaseModel.execute_query(
            query, {"user_id": current_user.get("uid")}
        )
        return [Group(**group) for group in groups]
    except Exception as e:
        logger.error(f"Failed to fetch groups: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch groups: {str(e)}"
        ) from e


@groups_router.get("/{group_id}", response_model=Group)
async def get_group(group_id: UUID, current_user: dict = current_user_dependency):
    """Get a specific group by ID"""
    try:
        query = """
            SELECT g.id, g.name, g.description, g.created_at
            FROM dradic_tech.groups g
            JOIN dradic_tech.users u ON g.id = u.group_id
            WHERE g.id = :group_id AND u.id = :user_id
        """
        groups = DatabaseModel.execute_query(
            query, {"group_id": group_id, "user_id": current_user.get("uid")}
        )

        if not groups:
            raise HTTPException(
                status_code=404, detail="Group not found or access denied"
            )

        return Group(**groups[0])
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch group: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch group: {str(e)}"
        ) from e


@groups_router.put("/{group_id}", response_model=Group)
async def update_group(
    group_id: UUID, group: GroupCreate, current_user: dict = current_user_dependency
):
    """Update a group"""
    try:
        # First check if the group exists and user belongs to it
        existing_group_query = """
            SELECT g.id FROM dradic_tech.groups g
            JOIN dradic_tech.users u ON g.id = u.group_id
            WHERE g.id = :group_id AND u.id = :user_id
        """
        existing_groups = DatabaseModel.execute_query(
            existing_group_query,
            {"group_id": group_id, "user_id": current_user.get("uid")},
        )

        if not existing_groups:
            raise HTTPException(
                status_code=404, detail="Group not found or access denied"
            )

        # For now, allow any group member to update the group
        # In a real application, you might want to add admin/owner logic
        group_data = group.dict(exclude_unset=True)
        updated_group = DatabaseModel.update_record("groups", str(group_id), group_data)

        if not updated_group:
            raise HTTPException(status_code=404, detail="Group not found")

        return Group(**updated_group)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update group: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to update group: {str(e)}"
        ) from e


@groups_router.delete("/{group_id}")
async def delete_group(group_id: UUID, current_user: dict = current_user_dependency):
    """Delete a group"""
    try:
        # First check if the group exists and user belongs to it
        existing_group_query = """
            SELECT g.id FROM dradic_tech.groups g
            JOIN dradic_tech.users u ON g.id = u.group_id
            WHERE g.id = :group_id AND u.id = :user_id
        """
        existing_groups = DatabaseModel.execute_query(
            existing_group_query,
            {"group_id": group_id, "user_id": current_user.get("uid")},
        )

        if not existing_groups:
            raise HTTPException(
                status_code=404, detail="Group not found or access denied"
            )

        # Check if group has users
        user_check_query = """
            SELECT COUNT(*) as count
            FROM dradic_tech.users
            WHERE group_id = :group_id
        """
        users = DatabaseModel.execute_query(user_check_query, {"group_id": group_id})

        if users and users[0]["count"] > 0:
            raise HTTPException(
                status_code=400,
                detail="Cannot delete group that has users. Remove users first.",
            )

        deleted = DatabaseModel.delete_record("groups", str(group_id))

        if not deleted:
            raise HTTPException(status_code=404, detail="Group not found")

        return {"message": "Group deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete group: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to delete group: {str(e)}"
        ) from e


@groups_router.get("/{group_id}/users")
async def get_group_users(group_id: UUID, current_user: dict = current_user_dependency):
    """Get all users in a group"""
    try:
        # First check if the group exists and user belongs to it
        group_check_query = """
            SELECT g.id FROM dradic_tech.groups g
            JOIN dradic_tech.users u ON g.id = u.group_id
            WHERE g.id = :group_id AND u.id = :user_id
        """
        groups = DatabaseModel.execute_query(
            group_check_query,
            {"group_id": group_id, "user_id": current_user.get("uid")},
        )

        if not groups:
            raise HTTPException(
                status_code=404, detail="Group not found or access denied"
            )

        query = """
            SELECT id, name, email, group_id, created_at, updated_at
            FROM dradic_tech.users
            WHERE group_id = :group_id
            ORDER BY name
        """

        users = DatabaseModel.execute_query(query, {"group_id": group_id})
        return users
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch group users: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch group users: {str(e)}"
        ) from e
