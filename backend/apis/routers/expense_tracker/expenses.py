import logging as logger
from datetime import date
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query
from models import (
    CategorySummary,
    Expense,
    ExpenseCreate,
    ExpenseResponse,
    ExpenseSummary,
    ExpenseWithDetails,
    MonthlySummary,
)
from utils.db import DatabaseModel

expenses_router = APIRouter()


@expenses_router.post("/", response_model=Expense)
async def create_expense(expense: ExpenseCreate):
    """Create a new expense"""
    try:
        # Validate expense item exists
        item_check_query = """
            SELECT COUNT(*) as count
            FROM tallyup.expense_items
            WHERE id = :item_id
        """
        item_exists = DatabaseModel.execute_query(
            item_check_query, {"item_id": expense.item_id}
        )

        if not item_exists or item_exists[0]["count"] == 0:
            raise HTTPException(status_code=400, detail="Expense item not found")

        expense_data = expense.dict()
        new_expense = DatabaseModel.insert_record("expenses", expense_data)
        return Expense(**new_expense)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to create expense: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to create expense: {str(e)}"
        ) from e


@expenses_router.get("/", response_model=ExpenseResponse)
async def get_expenses(
    user_id: Optional[str] = None,
    item_id: Optional[UUID] = None,
    category: Optional[str] = None,
    currency: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
):
    """Get expenses with optional filters"""
    try:
        # Build the query with filters
        query = """
            SELECT
                e.id, e.item_id, e.date, e.amount, e.currency, e.created_at,
                ei.name as item_name, ei.category as item_category, ei.is_fixed as item_is_fixed,
                u.name as user_name, u.email as user_email,
                g.name as group_name
            FROM tallyup.expenses e
            JOIN tallyup.expense_items ei ON e.item_id = ei.id
            JOIN tallyup.users u ON ei.user_id = u.id
            LEFT JOIN tallyup.groups g ON u.group_id = g.id
            WHERE 1=1
        """
        params = {}

        if user_id:
            query += " AND u.id = :user_id"
            params["user_id"] = user_id

        if item_id:
            query += " AND e.item_id = :item_id"
            params["item_id"] = item_id

        if category:
            query += " AND ei.category = :category"
            params["category"] = category

        if currency:
            query += " AND e.currency = :currency"
            params["currency"] = currency

        if start_date:
            query += " AND e.date >= :start_date"
            params["start_date"] = start_date

        if end_date:
            query += " AND e.date <= :end_date"
            params["end_date"] = end_date

        # Get total count
        count_query = f"SELECT COUNT(*) as total FROM ({query}) as subquery"
        total_count = DatabaseModel.execute_query(count_query, params)
        total = total_count[0]["total"] if total_count else 0

        # Add ordering and pagination
        query += " ORDER BY e.date DESC, e.created_at DESC LIMIT :limit OFFSET :offset"
        params["limit"] = limit
        params["offset"] = offset

        expenses = DatabaseModel.execute_query(query, params)

        # Calculate summary
        summary_query = """
            SELECT
                SUM(e.amount) as total_amount,
                e.currency,
                COUNT(*) as count
            FROM tallyup.expenses e
            JOIN tallyup.expense_items ei ON e.item_id = ei.id
            JOIN tallyup.users u ON ei.user_id = u.id
            WHERE 1=1
        """

        # Apply same filters for summary
        summary_params = {
            k: v for k, v in params.items() if k not in ["limit", "offset"]
        }

        if user_id:
            summary_query += " AND u.id = :user_id"
        if item_id:
            summary_query += " AND e.item_id = :item_id"
        if category:
            summary_query += " AND ei.category = :category"
        if currency:
            summary_query += " AND e.currency = :currency"
        if start_date:
            summary_query += " AND e.date >= :start_date"
        if end_date:
            summary_query += " AND e.date <= :end_date"

        summary_query += " GROUP BY e.currency"

        summary_data = DatabaseModel.execute_query(summary_query, summary_params)

        # For simplicity, return the first currency's summary or defaults
        if summary_data:
            summary = ExpenseSummary(
                total_amount=float(summary_data[0]["total_amount"] or 0),
                currency=summary_data[0]["currency"],
                count=int(summary_data[0]["count"] or 0),
            )
        else:
            summary = ExpenseSummary(total_amount=0.0, currency="USD", count=0)

        return ExpenseResponse(
            expenses=[ExpenseWithDetails(**expense) for expense in expenses],
            total_count=total,
            summary=summary,
        )
    except Exception as e:
        logger.error(f"Failed to fetch expenses: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch expenses: {str(e)}"
        ) from e


@expenses_router.get("/{expense_id}", response_model=ExpenseWithDetails)
async def get_expense(expense_id: UUID):
    """Get a specific expense by ID"""
    try:
        query = """
            SELECT
                e.id, e.item_id, e.date, e.amount, e.currency, e.created_at,
                ei.name as item_name, ei.category as item_category, ei.is_fixed as item_is_fixed,
                u.name as user_name, u.email as user_email,
                g.name as group_name
            FROM tallyup.expenses e
            JOIN tallyup.expense_items ei ON e.item_id = ei.id
            JOIN tallyup.users u ON ei.user_id = u.id
            LEFT JOIN tallyup.groups g ON u.group_id = g.id
            WHERE e.id = :expense_id
        """
        expenses = DatabaseModel.execute_query(query, {"expense_id": expense_id})

        if not expenses:
            raise HTTPException(status_code=404, detail="Expense not found")

        return ExpenseWithDetails(**expenses[0])
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch expense: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch expense: {str(e)}"
        ) from e


@expenses_router.put("/{expense_id}", response_model=Expense)
async def update_expense(expense_id: UUID, expense: ExpenseCreate):
    """Update an expense"""
    try:
        # Validate expense item exists if item_id is being changed
        if expense.item_id:
            item_check_query = """
                SELECT COUNT(*) as count
                FROM tallyup.expense_items
                WHERE id = :item_id
            """
            item_exists = DatabaseModel.execute_query(
                item_check_query, {"item_id": expense.item_id}
            )

            if not item_exists or item_exists[0]["count"] == 0:
                raise HTTPException(status_code=400, detail="Expense item not found")

        expense_data = expense.dict(exclude_unset=True)
        updated_expense = DatabaseModel.update_record(
            "expenses", expense_id, expense_data
        )

        if not updated_expense:
            raise HTTPException(status_code=404, detail="Expense not found")

        return Expense(**updated_expense)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update expense: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to update expense: {str(e)}"
        ) from e


@expenses_router.delete("/{expense_id}")
async def delete_expense(expense_id: UUID):
    """Delete an expense"""
    try:
        deleted = DatabaseModel.delete_record("expenses", expense_id)

        if not deleted:
            raise HTTPException(status_code=404, detail="Expense not found")

        return {"message": "Expense deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete expense: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to delete expense: {str(e)}"
        ) from e


@expenses_router.get("/summary/monthly/{year}/{month}", response_model=MonthlySummary)
async def get_monthly_summary(
    year: int, month: int, user_id: Optional[str] = None, currency: str = "USD"
):
    """Get monthly expense summary"""
    try:
        # Validate month
        if month < 1 or month > 12:
            raise HTTPException(
                status_code=400, detail="Month must be between 1 and 12"
            )

        # Base query for monthly summary
        query = """
            SELECT
                ei.category,
                SUM(e.amount) as total_amount,
                COUNT(*) as count
            FROM tallyup.expenses e
            JOIN tallyup.expense_items ei ON e.item_id = ei.id
            JOIN tallyup.users u ON ei.user_id = u.id
            WHERE EXTRACT(YEAR FROM e.date) = :year
            AND EXTRACT(MONTH FROM e.date) = :month
            AND e.currency = :currency
        """
        params = {"year": year, "month": month, "currency": currency}

        if user_id:
            query += " AND u.id = :user_id"
            params["user_id"] = user_id

        query += " GROUP BY ei.category ORDER BY total_amount DESC"

        category_data = DatabaseModel.execute_query(query, params)

        # Calculate total
        total_query = """
            SELECT SUM(e.amount) as total_amount
            FROM tallyup.expenses e
            JOIN tallyup.expense_items ei ON e.item_id = ei.id
            JOIN tallyup.users u ON ei.user_id = u.id
            WHERE EXTRACT(YEAR FROM e.date) = :year
            AND EXTRACT(MONTH FROM e.date) = :month
            AND e.currency = :currency
        """

        if user_id:
            total_query += " AND u.id = :user_id"

        total_data = DatabaseModel.execute_query(total_query, params)
        total_amount = float(total_data[0]["total_amount"] or 0) if total_data else 0.0

        categories = [
            CategorySummary(
                category=cat["category"],
                total_amount=float(cat["total_amount"]),
                count=int(cat["count"]),
            )
            for cat in category_data
        ]

        return MonthlySummary(
            year=year,
            month=month,
            total_amount=total_amount,
            currency=currency,
            categories=categories,
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch monthly summary: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch monthly summary: {str(e)}"
        ) from e


@expenses_router.get("/currencies/")
async def get_currencies(user_id: Optional[str] = None):
    """Get all unique currencies used in expenses"""
    try:
        query = """
            SELECT DISTINCT e.currency
            FROM tallyup.expenses e
            JOIN tallyup.expense_items ei ON e.item_id = ei.id
            JOIN tallyup.users u ON ei.user_id = u.id
            WHERE 1=1
        """
        params = {}

        if user_id:
            query += " AND u.id = :user_id"
            params["user_id"] = user_id

        query += " ORDER BY e.currency"

        currencies = DatabaseModel.execute_query(query, params)
        return [curr["currency"] for curr in currencies if curr["currency"]]
    except Exception as e:
        logger.error(f"Failed to fetch currencies: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch currencies: {str(e)}"
        ) from e
