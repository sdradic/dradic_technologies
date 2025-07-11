import logging as logger
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, HTTPException, Depends
from models import Group, GroupCreate
from utils.db import DatabaseModel
from utils.auth import get_current_user

groups_router = APIRouter()

@groups_router.post("/", response_model=Group)
async def create_group(group: GroupCreate, current_user: dict = Depends(get_current_user)):
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
async def get_groups(current_user: dict = Depends(get_current_user)):
    """Get all groups that the current user has access to"""
    try:
        user_id = current_user.get("user_id")
        
        # Get groups that the user belongs to or all groups (you can customize this logic)
        query = """
            SELECT DISTINCT g.id, g.name, g.description, g.created_at
            FROM dradic_tech.groups g
            LEFT JOIN dradic_tech.users u ON g.id = u.group_id
            WHERE u.id = :user_id OR u.id IS NULL
            ORDER BY g.created_at DESC
        """
        groups = DatabaseModel.execute_query(query, {"user_id": user_id})
        return [Group(**group) for group in groups]
    except Exception as e:
        logger.error(f"Failed to fetch groups: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch groups: {str(e)}"
        ) from e

@groups_router.get("/{group_id}", response_model=Group)
async def get_group(group_id: UUID, current_user: dict = Depends(get_current_user)):
    """Get a specific group by ID"""
    try:
        user_id = current_user.get("user_id")
        
        # Check if user has access to this group
        access_query = """
            SELECT g.id, g.name, g.description, g.created_at
            FROM dradic_tech.groups g
            LEFT JOIN dradic_tech.users u ON g.id = u.group_id
            WHERE g.id = :group_id AND (u.id = :user_id OR u.id IS NULL)
        """
        groups = DatabaseModel.execute_query(access_query, {"group_id": group_id, "user_id": user_id})

        if not groups:
            raise HTTPException(status_code=404, detail="Group not found or access denied")

        return Group(**groups[0])
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch group: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch group: {str(e)}"
        ) from e

@groups_router.put("/{group_id}", response_model=Group)
async def update_group(group_id: UUID, group: GroupCreate, current_user: dict = Depends(get_current_user)):
    """Update a group"""
    try:
        user_id = current_user.get("user_id")
        
        # Check if user has access to this group
        access_query = """
            SELECT COUNT(*) as count
            FROM dradic_tech.groups g
            LEFT JOIN dradic_tech.users u ON g.id = u.group_id
            WHERE g.id = :group_id AND (u.id = :user_id OR u.id IS NULL)
        """
        access_result = DatabaseModel.execute_query(access_query, {"group_id": group_id, "user_id": user_id})
        
        if not access_result or access_result[0]["count"] == 0:
            raise HTTPException(status_code=404, detail="Group not found or access denied")

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
async def delete_group(group_id: UUID, current_user: dict = Depends(get_current_user)):
    """Delete a group"""
    try:
        user_id = current_user.get("user_id")
        
        # Check if user has access to this group
        access_query = """
            SELECT COUNT(*) as count
            FROM dradic_tech.groups g
            LEFT JOIN dradic_tech.users u ON g.id = u.group_id
            WHERE g.id = :group_id AND (u.id = :user_id OR u.id IS NULL)
        """
        access_result = DatabaseModel.execute_query(access_query, {"group_id": group_id, "user_id": user_id})
        
        if not access_result or access_result[0]["count"] == 0:
            raise HTTPException(status_code=404, detail="Group not found or access denied")

        # Check if group has users
        user_check_query = """
            SELECT COUNT(*) as user_count
            FROM dradic_tech.users
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
async def get_group_users(group_id: UUID, current_user: dict = Depends(get_current_user)):
    """Get all users in a group"""
    try:
        user_id = current_user.get("user_id")
        
        # Check if user has access to this group
        access_query = """
            SELECT COUNT(*) as count
            FROM dradic_tech.groups g
            LEFT JOIN dradic_tech.users u ON g.id = u.group_id
            WHERE g.id = :group_id AND (u.id = :user_id OR u.id IS NULL)
        """
        access_result = DatabaseModel.execute_query(access_query, {"group_id": group_id, "user_id": user_id})
        
        if not access_result or access_result[0]["count"] == 0:
            raise HTTPException(status_code=404, detail="Group not found or access denied")

        query = """
            SELECT u.id, u.name, u.email, u.created_at, u.group_id
            FROM dradic_tech.users u
            WHERE u.group_id = :group_id
            ORDER BY u.created_at DESC
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
