import logging as logger
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, HTTPException
from models import Group, GroupCreate
from utils.db import DatabaseModel

groups_router = APIRouter()


@groups_router.post("/", response_model=Group)
async def create_group(group: GroupCreate):
    """Create a new group"""
    try:
        group_data = group.dict()
        new_group = DatabaseModel.insert_record("groups", group_data)
        return Group(**new_group)
    except Exception as e:
        logger.error(f"Failed to create group: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to create group: {str(e)}"
        ) from e


@groups_router.get("/", response_model=List[Group])
async def get_groups(user_id: Optional[str] = None):
    """Get all groups"""
    try:
        query = """
            SELECT id, name, description, created_at
            FROM tallyup.groups
            WHERE 1=1
            ORDER BY created_at DESC
        """
        if user_id:
            query += " AND EXISTS (SELECT 1 FROM tallyup.users WHERE users.group_id = groups.id AND users.id = :user_id)"
            groups = DatabaseModel.execute_query(query, {"user_id": user_id})
        else:
            groups = DatabaseModel.execute_query(query)
        return [Group(**group) for group in groups]
    except Exception as e:
        logger.error(f"Failed to fetch groups: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch groups: {str(e)}"
        ) from e


@groups_router.get("/{group_id}", response_model=Group)
async def get_group(group_id: UUID):
    """Get a specific group by ID"""
    try:
        query = """
            SELECT id, name, description, created_at
            FROM tallyup.groups
            WHERE id = :group_id
        """
        groups = DatabaseModel.execute_query(query, {"group_id": group_id})

        if not groups:
            raise HTTPException(status_code=404, detail="Group not found")

        return Group(**groups[0])
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch group: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch group: {str(e)}"
        ) from e


@groups_router.put("/{group_id}", response_model=Group)
async def update_group(group_id: UUID, group: GroupCreate):
    """Update a group"""
    try:
        group_data = group.dict(exclude_unset=True)
        updated_group = DatabaseModel.update_record("groups", group_id, group_data)

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
async def delete_group(group_id: UUID):
    """Delete a group"""
    try:
        # Check if group has users
        user_check_query = """
            SELECT COUNT(*) as user_count
            FROM tallyup.users
            WHERE group_id = :group_id
        """
        user_count = DatabaseModel.execute_query(
            user_check_query, {"group_id": group_id}
        )

        if user_count and user_count[0]["user_count"] > 0:
            raise HTTPException(
                status_code=400,
                detail="Cannot delete group that has users. Remove users first.",
            )

        deleted = DatabaseModel.delete_record("groups", group_id)

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
async def get_group_users(group_id: UUID):
    """Get all users in a group"""
    try:
        query = """
            SELECT u.id, u.name, u.email, u.created_at, u.group_id
            FROM tallyup.users u
            WHERE u.group_id = :group_id
            ORDER BY u.created_at DESC
        """
        users = DatabaseModel.execute_query(query, {"group_id": group_id})
        return users
    except Exception as e:
        logger.error(f"Failed to fetch group users: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch group users: {str(e)}"
        ) from e
