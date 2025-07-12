import logging as logger
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, HTTPException, Depends
from models import (
    ExpenseItem,
    ExpenseItemCreate,
    ExpenseItemResponse,
    ExpenseItemWithUser,
)
from utils.db import DatabaseModel
from utils.auth import get_current_user

expense_items_router = APIRouter()

@expense_items_router.post("/", response_model=ExpenseItem)
async def create_expense_item(item: ExpenseItemCreate, current_user: dict = Depends(get_current_user)):
    """Create a new expense item"""
    try:
        # Ensure user can only create expense items for themselves
        if item.user_id != current_user.get("uid"):
            raise HTTPException(status_code=403, detail="Cannot create expense item for another user")

        # Validate user exists
        user_check_query = """
            SELECT COUNT(*) as count
            FROM dradic_tech.users
            WHERE id = :user_id
        """
        user_exists = DatabaseModel.execute_query(
            user_check_query, {"user_id": item.user_id}
        )
        logger.info(item)
        if not user_exists or user_exists[0]["count"] == 0:
            raise HTTPException(status_code=400, detail="User not found")

        item_data = item.dict()
        new_item = DatabaseModel.insert_record("expense_items", item_data)
        return ExpenseItem(**new_item)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to create expense item: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to create expense item: {str(e)}"
        ) from e

@expense_items_router.get("/", response_model=ExpenseItemResponse)
async def get_expense_items(
    user_id: Optional[str] = None,
    category: Optional[str] = None,
    is_fixed: Optional[bool] = None,
    limit: int = 100,
    offset: int = 0,
    current_user: dict = Depends(get_current_user)
):
    """Get expense items with optional filters"""
    try:
        # If user_id is specified, ensure it matches the current user
        if user_id and user_id != current_user.get("uid"):
            raise HTTPException(status_code=403, detail="Cannot access another user's expense items")
        
        # If no user_id is specified, default to current user's items
        if not user_id:
            user_id = current_user.get("uid")

        # Build the query with filters
        query = """
            SELECT
                ei.id, ei.name, ei.category, ei.is_fixed, ei.user_id,
                u.name as user_name, u.email as user_email
            FROM dradic_tech.expense_items ei
            JOIN dradic_tech.users u ON ei.user_id = u.id
            WHERE ei.user_id = :user_id
        """
        params = {"user_id": user_id}

        if category:
            query += " AND ei.category = :category"
            params["category"] = category

        if is_fixed is not None:
            query += " AND ei.is_fixed = :is_fixed"
            params["is_fixed"] = is_fixed

        # Get total count
        count_query = f"SELECT COUNT(*) as total FROM ({query}) as subquery"
        total_count = DatabaseModel.execute_query(count_query, params)
        total = total_count[0]["total"] if total_count else 0

        # Add pagination
        query += " ORDER BY ei.name LIMIT :limit OFFSET :offset"
        params["limit"] = limit
        params["offset"] = offset

        items = DatabaseModel.execute_query(query, params)

        return ExpenseItemResponse(
            items=[ExpenseItemWithUser(**item) for item in items], total_count=total
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch expense items: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch expense items: {str(e)}"
        ) from e

@expense_items_router.get("/{item_id}", response_model=ExpenseItemWithUser)
async def get_expense_item(item_id: UUID, current_user: dict = Depends(get_current_user)):
    """Get a specific expense item by ID"""
    try:
        query = """
            SELECT
                ei.id, ei.name, ei.category, ei.is_fixed, ei.user_id,
                u.name as user_name, u.email as user_email
            FROM dradic_tech.expense_items ei
            JOIN dradic_tech.users u ON ei.user_id = u.id
            WHERE ei.id = :item_id
        """
        items = DatabaseModel.execute_query(query, {"item_id": item_id})

        if not items:
            raise HTTPException(status_code=404, detail="Expense item not found")

        item = items[0]
        
        # Ensure user can only access their own expense items
        if item["user_id"] != current_user.get("uid"):
            raise HTTPException(status_code=403, detail="Cannot access another user's expense item")

        return ExpenseItemWithUser(**item)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch expense item: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch expense item: {str(e)}"
        ) from e

@expense_items_router.put("/{item_id}", response_model=ExpenseItem)
async def update_expense_item(item_id: UUID, item: ExpenseItemCreate, current_user: dict = Depends(get_current_user)):
    """Update an expense item"""
    try:
        # First check if the item exists and belongs to the current user
        existing_item_query = """
            SELECT user_id FROM dradic_tech.expense_items WHERE id = :item_id
        """
        existing_items = DatabaseModel.execute_query(existing_item_query, {"item_id": item_id})
        
        if not existing_items:
            raise HTTPException(status_code=404, detail="Expense item not found")
        
        if existing_items[0]["user_id"] != current_user.get("uid"):
            raise HTTPException(status_code=403, detail="Cannot update another user's expense item")

        # Ensure the user_id in the update matches the current user
        if item.user_id != current_user.get("uid"):
            raise HTTPException(status_code=403, detail="Cannot change expense item ownership")

        # Validate user exists if user_id is being changed
        if item.user_id:
            user_check_query = """
                SELECT COUNT(*) as count
                FROM dradic_tech.users
                WHERE id = :user_id
            """
            user_exists = DatabaseModel.execute_query(
                user_check_query, {"user_id": item.user_id}
            )

            if not user_exists or user_exists[0]["count"] == 0:
                raise HTTPException(status_code=400, detail="User not found")

        item_data = item.dict(exclude_unset=True)
        updated_item = DatabaseModel.update_record("expense_items", item_id, item_data)

        if not updated_item:
            raise HTTPException(status_code=404, detail="Expense item not found")

        return ExpenseItem(**updated_item)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update expense item: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to update expense item: {str(e)}"
        ) from e

@expense_items_router.delete("/{item_id}")
async def delete_expense_item(item_id: UUID, current_user: dict = Depends(get_current_user)):
    """Delete an expense item"""
    try:
        # First check if the item exists and belongs to the current user
        existing_item_query = """
            SELECT user_id FROM dradic_tech.expense_items WHERE id = :item_id
        """
        existing_items = DatabaseModel.execute_query(existing_item_query, {"item_id": item_id})
        
        if not existing_items:
            raise HTTPException(status_code=404, detail="Expense item not found")
        
        if existing_items[0]["user_id"] != current_user.get("uid"):
            raise HTTPException(status_code=403, detail="Cannot delete another user's expense item")

        # Check if item has expenses
        expense_check_query = """
            SELECT COUNT(*) as count
            FROM dradic_tech.expenses
            WHERE item_id = :item_id
        """
        expenses = DatabaseModel.execute_query(
            expense_check_query, {"item_id": item_id}
        )

        if expenses and expenses[0]["count"] > 0:
            raise HTTPException(
                status_code=400,
                detail="Cannot delete expense item that has expenses. Delete expenses first.",
            )

        deleted = DatabaseModel.delete_record("expense_items", item_id)

        if not deleted:
            raise HTTPException(status_code=404, detail="Expense item not found")

        return {"message": "Expense item deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete expense item: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to delete expense item: {str(e)}"
        ) from e

@expense_items_router.get("/{item_id}/expenses")
async def get_item_expenses(item_id: UUID, limit: int = 100, offset: int = 0, current_user: dict = Depends(get_current_user)):
    """Get all expenses for a specific expense item"""
    try:
        # First check if the item belongs to the current user
        item_check_query = """
            SELECT user_id FROM dradic_tech.expense_items WHERE id = :item_id
        """
        items = DatabaseModel.execute_query(item_check_query, {"item_id": item_id})
        
        if not items:
            raise HTTPException(status_code=404, detail="Expense item not found")
        
        if items[0]["user_id"] != current_user.get("uid"):
            raise HTTPException(status_code=403, detail="Cannot access another user's expense item")

        query = """
            SELECT
                e.id, e.item_id, e.date, e.amount, e.currency, e.created_at,
                ei.name as item_name, ei.category as item_category, ei.is_fixed as item_is_fixed,
                u.name as user_name, u.email as user_email,
                g.name as group_name
            FROM dradic_tech.expenses e
            JOIN dradic_tech.expense_items ei ON e.item_id = ei.id
            JOIN dradic_tech.users u ON ei.user_id = u.id
            LEFT JOIN dradic_tech.groups g ON u.group_id = g.id
            WHERE e.item_id = :item_id
            ORDER BY e.date DESC
            LIMIT :limit OFFSET :offset
        """

        expenses = DatabaseModel.execute_query(
            query, {"item_id": item_id, "limit": limit, "offset": offset}
        )

        return expenses
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch item expenses: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch item expenses: {str(e)}"
        ) from e

@expense_items_router.get("/categories/")
async def get_categories(user_id: Optional[str] = None, current_user: dict = Depends(get_current_user)):
    """Get all unique categories"""
    try:
        # If user_id is specified, ensure it matches the current user
        if user_id and user_id != current_user.get("uid"):
            raise HTTPException(status_code=403, detail="Cannot access another user's categories")
        
        # If no user_id is specified, default to current user's categories
        if not user_id:
            user_id = current_user.get("uid")

        query = """
            SELECT DISTINCT category
            FROM dradic_tech.expense_items
            WHERE category IS NOT NULL AND user_id = :user_id
            ORDER BY category
        """

        categories = DatabaseModel.execute_query(query, {"user_id": user_id})
        return [cat["category"] for cat in categories if cat["category"]]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch categories: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch categories: {str(e)}"
        ) from e
