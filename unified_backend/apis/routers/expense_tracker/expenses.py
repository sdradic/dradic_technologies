import logging as logger
from datetime import date, datetime
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query

from models import (
    DashboardCard,
    DashboardDataWithExpenses,
    DashboardDonutData,
    DashboardDonutGraph,
    DashboardTable,
    DashboardTableRow,
    Expense,
    ExpenseCreate,
    ExpenseResponse,
    ExpenseSummary,
    ExpenseWithDetails,
)
from utils.auth import get_current_user
from utils.db import DatabaseModel

expenses_router = APIRouter()

# Module-level singleton for dependency injection
current_user_dependency = Depends(get_current_user)


@expenses_router.post("/", response_model=Expense)
async def create_expense(
    expense: ExpenseCreate, current_user: dict = current_user_dependency
):
    """Create a new expense"""
    try:
        # Validate expense item exists and belongs to current user
        item_check_query = """
            SELECT user_id FROM dradic_tech.expense_items WHERE id = :item_id
        """
        item_result = DatabaseModel.execute_query(
            item_check_query, {"item_id": expense.item_id}
        )

        if not item_result:
            raise HTTPException(status_code=400, detail="Expense item not found")

        if item_result[0]["user_id"] != current_user.get("uid"):
            raise HTTPException(
                status_code=403, detail="Cannot create expense for another user's item"
            )

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
    current_user: dict = current_user_dependency,
):
    """Get expenses with optional filters"""
    try:
        # If user_id is specified, ensure it matches the current user
        if user_id and user_id != current_user.get("uid"):
            raise HTTPException(
                status_code=403, detail="Cannot access another user's expenses"
            )

        # If no user_id is specified, default to current user's expenses
        if not user_id:
            user_id = current_user.get("uid")

        # Build the query with filters
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
            WHERE u.id = :user_id
        """
        params = {"user_id": user_id}

        if item_id:
            query += " AND e.item_id = :item_id"
            params["item_id"] = str(item_id)

        if category:
            query += " AND ei.category = :category"
            params["category"] = category

        if currency:
            query += " AND e.currency = :currency"
            params["currency"] = currency

        if start_date:
            query += " AND e.date >= :start_date"
            params["start_date"] = str(start_date)

        if end_date:
            query += " AND e.date <= :end_date"
            params["end_date"] = str(end_date)

        # Get total count
        count_query = f"SELECT COUNT(*) as total FROM ({query}) as subquery"
        total_count = DatabaseModel.execute_query(count_query, params)
        total = total_count[0]["total"] if total_count else 0

        # Add ordering and pagination
        query += " ORDER BY e.date DESC, e.created_at DESC LIMIT :limit OFFSET :offset"
        params["limit"] = str(limit)
        params["offset"] = str(offset)

        expenses = DatabaseModel.execute_query(query, params)

        # Calculate summary
        summary_query = """
            SELECT
                SUM(e.amount) as total_amount,
                e.currency,
                COUNT(*) as count
            FROM dradic_tech.expenses e
            JOIN dradic_tech.expense_items ei ON e.item_id = ei.id
            JOIN dradic_tech.users u ON ei.user_id = u.id
            WHERE u.id = :user_id
        """

        # Apply same filters for summary
        summary_params = {
            k: v for k, v in params.items() if k not in ["limit", "offset"]
        }

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
            summary = ExpenseSummary(total_amount=0.0, currency="CLP", count=0)

        return ExpenseResponse(
            expenses=[ExpenseWithDetails(**expense) for expense in expenses],
            total_count=total,
            summary=summary,
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch expenses: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch expenses: {str(e)}"
        ) from e


@expenses_router.get("/{expense_id}", response_model=ExpenseWithDetails)
async def get_expense(expense_id: UUID, current_user: dict = current_user_dependency):
    """Get a specific expense by ID"""
    try:
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
            WHERE e.id = :expense_id
        """
        expenses = DatabaseModel.execute_query(query, {"expense_id": expense_id})

        if not expenses:
            raise HTTPException(status_code=404, detail="Expense not found")

        expense = expenses[0]

        # Double check with user_id from expense_items
        user_check_query = """
            SELECT ei.user_id FROM dradic_tech.expense_items ei
            JOIN dradic_tech.expenses e ON e.item_id = ei.id
            WHERE e.id = :expense_id
        """
        user_check = DatabaseModel.execute_query(
            user_check_query, {"expense_id": expense_id}
        )

        if not user_check or user_check[0]["user_id"] != current_user.get("uid"):
            raise HTTPException(
                status_code=403, detail="Cannot access another user's expense"
            )

        return ExpenseWithDetails(**expense)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch expense: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch expense: {str(e)}"
        ) from e


@expenses_router.put("/{expense_id}", response_model=Expense)
async def update_expense(
    expense_id: UUID,
    expense: ExpenseCreate,
    current_user: dict = current_user_dependency,
):
    """Update an expense"""
    try:
        # First check if the expense exists and belongs to the current user
        existing_expense_query = """
            SELECT ei.user_id FROM dradic_tech.expenses e
            JOIN dradic_tech.expense_items ei ON e.item_id = ei.id
            WHERE e.id = :expense_id
        """
        existing_result = DatabaseModel.execute_query(
            existing_expense_query, {"expense_id": expense_id}
        )

        if not existing_result:
            raise HTTPException(status_code=404, detail="Expense not found")

        if existing_result[0]["user_id"] != current_user.get("uid"):
            raise HTTPException(
                status_code=403, detail="Cannot update another user's expense"
            )

        # Validate expense item exists and belongs to current user if item_id is being changed
        if expense.item_id:
            item_check_query = """
                SELECT user_id FROM dradic_tech.expense_items WHERE id = :item_id
            """
            item_result = DatabaseModel.execute_query(
                item_check_query, {"item_id": expense.item_id}
            )

            if not item_result:
                raise HTTPException(status_code=400, detail="Expense item not found")

            if item_result[0]["user_id"] != current_user.get("uid"):
                raise HTTPException(
                    status_code=403,
                    detail="Cannot assign expense to another user's item",
                )

        expense_data = expense.dict(exclude_unset=True)
        updated_expense = DatabaseModel.update_record(
            "expenses", str(expense_id), expense_data
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
async def delete_expense(
    expense_id: UUID, current_user: dict = current_user_dependency
):
    """Delete an expense"""
    try:
        # First check if the expense exists and belongs to the current user
        existing_expense_query = """
            SELECT ei.user_id FROM dradic_tech.expenses e
            JOIN dradic_tech.expense_items ei ON e.item_id = ei.id
            WHERE e.id = :expense_id
        """
        existing_result = DatabaseModel.execute_query(
            existing_expense_query, {"expense_id": expense_id}
        )

        if not existing_result:
            raise HTTPException(status_code=404, detail="Expense not found")

        if existing_result[0]["user_id"] != current_user.get("uid"):
            raise HTTPException(
                status_code=403, detail="Cannot delete another user's expense"
            )

        deleted = DatabaseModel.delete_record("expenses", str(expense_id))

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


@expenses_router.get("/currencies/")
async def get_currencies(current_user: dict = current_user_dependency):
    """Get all unique currencies used in expenses"""
    try:
        user_id = current_user.get("uid")

        query = """
            SELECT DISTINCT e.currency
            FROM dradic_tech.expenses e
            JOIN dradic_tech.expense_items ei ON e.item_id = ei.id
            JOIN dradic_tech.users u ON ei.user_id = u.id
            WHERE u.id = :user_id
            ORDER BY e.currency
        """

        currencies = DatabaseModel.execute_query(query, {"user_id": user_id})
        return [curr["currency"] for curr in currencies if curr["currency"]]
    except Exception as e:
        logger.error(f"Failed to fetch currencies: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch currencies: {str(e)}"
        ) from e


@expenses_router.get(
    "/dashboard/monthly/{year}/{month}", response_model=DashboardDataWithExpenses
)
async def get_monthly_dashboard(
    year: int,
    month: int,
    currency: str = "CLP",
    current_user: dict = current_user_dependency,
):
    """Get unified monthly dashboard data including expenses, income, and summaries with actual expense objects for edit modal"""
    try:
        # Validate month
        if month < 1 or month > 12:
            raise HTTPException(
                status_code=400, detail="Month must be between 1 and 12"
            )

        user_id = current_user.get("uid")

        # Get expenses for the month with full details for edit modal
        expenses_query = """
            SELECT
                e.id,
                e.item_id,
                e.amount,
                e.currency,
                e.date,
                e.created_at,
                ei.name as item_name,
                ei.category as item_category,
                ei.is_fixed as item_is_fixed,
                u.name as user_name,
                u.email as user_email,
                g.name as group_name
            FROM dradic_tech.expenses e
            JOIN dradic_tech.expense_items ei ON e.item_id = ei.id
            JOIN dradic_tech.users u ON ei.user_id = u.id
            LEFT JOIN dradic_tech.groups g ON u.group_id = g.id
            WHERE EXTRACT(YEAR FROM e.date) = :year
            AND EXTRACT(MONTH FROM e.date) = :month
            AND e.currency = :currency
            AND u.id = :user_id
            ORDER BY e.date DESC
        """

        # Get income for the month
        income_query = """
            SELECT
                i.id,
                i.amount,
                i.currency,
                i.date,
                i.description,
                ins.name as source_name
            FROM dradic_tech.incomes i
            JOIN dradic_tech.income_sources ins ON i.source_id = ins.id
            JOIN dradic_tech.users u ON ins.user_id = u.id
            WHERE EXTRACT(YEAR FROM i.date) = :year
            AND EXTRACT(MONTH FROM i.date) = :month
            AND i.currency = :currency
            AND u.id = :user_id
            ORDER BY i.date DESC
        """

        params = {
            "year": year,
            "month": month,
            "currency": currency,
            "user_id": user_id,
        }

        expenses_data = DatabaseModel.execute_query(expenses_query, params)
        income_data = DatabaseModel.execute_query(income_query, params)

        # Calculate totals
        total_expenses = sum(float(exp["amount"]) for exp in expenses_data)
        total_income = sum(float(inc["amount"]) for inc in income_data)
        total_savings = total_income - total_expenses

        # Create dashboard cards
        cards = [
            DashboardCard(
                title="Total Income",
                description="Total income for the month",
                value=total_income,
                currency=currency,
            ),
            DashboardCard(
                title="Total Expenses",
                description="Total expenses for the month",
                value=total_expenses,
                currency=currency,
            ),
            DashboardCard(
                title="Total Savings",
                description="Total savings for the month",
                value=total_savings,
                currency=currency,
            ),
        ]

        # Create donut graph data (group expenses by category)
        category_totals: dict[str, float] = {}
        for expense in expenses_data:
            category = expense["item_category"] or "Uncategorized"
            amount = float(expense["amount"])
            category_totals[category] = category_totals.get(category, 0) + amount

        # Sort categories by amount and take only top 4
        sorted_categories = sorted(
            category_totals.items(), key=lambda x: x[1], reverse=True
        )[:4]

        donut_data = [
            DashboardDonutData(label=cat, value=amount)
            for cat, amount in sorted_categories
            if amount > 0
        ]

        donut_graph = DashboardDonutGraph(
            title="Expenses by category",
            description="Top 4 expense categories",
            data=donut_data,
        )

        # Create table data
        table_rows = []
        for expense in expenses_data:
            table_rows.append(
                DashboardTableRow(
                    id=str(expense["id"]),
                    name=expense["item_name"],
                    category=expense["item_category"] or "Uncategorized",
                    amount=f"{currency} {abs(float(expense['amount'])):,.0f}",
                    date=expense["date"].strftime("%m/%d/%Y"),
                    description=expense["item_name"],
                )
            )

        table = DashboardTable(
            title=f"{datetime(year, month, 1).strftime('%B')}",
            description="Click on an expense to edit it.",
            columns=["Name", "Category", "Amount", "Date", "Description"],
            data=table_rows,
        )

        # Create full expense objects for edit modal
        expenses = [ExpenseWithDetails(**expense) for expense in expenses_data]

        return DashboardDataWithExpenses(
            year=year,
            month=month,
            currency=currency,
            cards=cards,
            donut_graph=donut_graph,
            table=table,
            total_expenses=total_expenses,
            total_income=total_income,
            total_savings=total_savings,
            expenses=expenses,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch dashboard data: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch dashboard data: {str(e)}"
        ) from e
