import logging as logger
from datetime import date, datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from models import (
    DashboardCard,
    DashboardData,
    DashboardDonutData,
    DashboardDonutGraph,
    DashboardTable,
    DashboardTableRow,
    Income,
    IncomeCreate,
    IncomeResponse,
    IncomeSummary,
    IncomeWithDetails,
)
from utils.auth import get_current_user
from utils.db import DatabaseModel

incomes_router = APIRouter()

# Module-level singleton for dependency injection
current_user_dependency = Depends(get_current_user)


@incomes_router.post("/", response_model=Income)
async def create_income(
    income: IncomeCreate, current_user: dict = current_user_dependency
):
    """Create a new income record"""
    try:
        # Verify the income source belongs to the current user
        source_query = """
            SELECT user_id FROM dradic_tech.income_sources
            WHERE id = :source_id
        """
        source_data = DatabaseModel.execute_query(
            source_query, {"source_id": income.source_id}
        )

        if not source_data:
            raise HTTPException(status_code=404, detail="Income source not found")

        if source_data[0]["user_id"] != current_user.get("uid"):
            raise HTTPException(
                status_code=403, detail="Cannot create income for another user's source"
            )

        # Insert the income record
        income_data = income.dict()
        new_income = DatabaseModel.insert_record("incomes", income_data)
        return Income(**new_income)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to create income: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to create income: {str(e)}"
        ) from e


@incomes_router.get("/", response_model=IncomeResponse)
async def get_incomes(
    user_id: Optional[str] = None,
    source_id: Optional[str] = None,
    category: Optional[str] = None,
    currency: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: dict = current_user_dependency,
):
    """Get incomes with optional filters"""
    try:
        # If user_id is specified, ensure it matches the current user
        if user_id and user_id != current_user.get("uid"):
            raise HTTPException(
                status_code=403, detail="Cannot access another user's incomes"
            )

        # If no user_id is specified, default to current user's incomes
        if not user_id:
            user_id = current_user.get("uid")

        # Build the query with filters
        query = """
            SELECT
                i.id, i.source_id, i.amount, i.currency, i.date, i.description,
                i.created_at, i.updated_at,
                isc.name as source_name, isc.category as source_category,
                u.name as user_name, u.email as user_email,
                g.name as group_name
            FROM dradic_tech.incomes i
            JOIN dradic_tech.income_sources isc ON i.source_id = isc.id
            JOIN dradic_tech.users u ON isc.user_id = u.id
            LEFT JOIN dradic_tech.groups g ON u.group_id = g.id
            WHERE isc.user_id = :user_id
        """
        params = {"user_id": user_id}

        if source_id:
            query += " AND i.source_id = :source_id"
            params["source_id"] = source_id

        if category:
            query += " AND isc.category = :category"
            params["category"] = category

        if currency:
            query += " AND i.currency = :currency"
            params["currency"] = currency

        if start_date:
            query += " AND i.date >= :start_date"
            params["start_date"] = str(start_date)

        if end_date:
            query += " AND i.date <= :end_date"
            params["end_date"] = str(end_date)

        # Get total count
        count_query = f"SELECT COUNT(*) as total FROM ({query}) as subquery"
        total_count = DatabaseModel.execute_query(count_query, params)
        total = total_count[0]["total"] if total_count else 0

        # Add ordering and pagination
        query += " ORDER BY i.date DESC, i.created_at DESC LIMIT :limit OFFSET :skip"
        params["limit"] = str(limit)
        params["skip"] = str(skip)

        incomes = DatabaseModel.execute_query(query, params)

        # Calculate summary
        summary_query = """
            SELECT
                SUM(i.amount) as total_amount,
                i.currency,
                COUNT(*) as count
            FROM dradic_tech.incomes i
            JOIN dradic_tech.income_sources isc ON i.source_id = isc.id
            JOIN dradic_tech.users u ON isc.user_id = u.id
            WHERE u.id = :user_id
        """

        # Apply same filters for summary
        summary_params = {k: v for k, v in params.items() if k not in ["limit", "skip"]}

        if source_id:
            summary_query += " AND i.source_id = :source_id"
        if category:
            summary_query += " AND isc.category = :category"
        if currency:
            summary_query += " AND i.currency = :currency"
        if start_date:
            summary_query += " AND i.date >= :start_date"
        if end_date:
            summary_query += " AND i.date <= :end_date"

        summary_query += " GROUP BY i.currency"

        summary_data = DatabaseModel.execute_query(summary_query, summary_params)

        summary = IncomeSummary(
            total_amount=float(summary_data[0]["total_amount"] or 0)
            if summary_data
            else 0.0,
            currency=summary_data[0]["currency"] if summary_data else "CLP",
            count=int(summary_data[0]["count"] or 0) if summary_data else 0,
        )

        return IncomeResponse(
            incomes=[IncomeWithDetails(**income) for income in incomes],
            total_count=total,
            summary=summary,
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch incomes: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch incomes: {str(e)}"
        ) from e


@incomes_router.get("/{income_id}", response_model=IncomeWithDetails)
async def get_income(income_id: str, current_user: dict = current_user_dependency):
    """Get a specific income by ID"""
    try:
        query = """
            SELECT
                i.id, i.source_id, i.amount, i.currency, i.date, i.description,
                i.created_at, i.updated_at,
                isc.name as source_name, isc.category as source_category,
                u.name as user_name, u.email as user_email,
                g.name as group_name
            FROM dradic_tech.incomes i
            JOIN dradic_tech.income_sources isc ON i.source_id = isc.id
            JOIN dradic_tech.users u ON isc.user_id = u.id
            LEFT JOIN dradic_tech.groups g ON u.group_id = g.id
            WHERE i.id = :income_id
        """
        incomes = DatabaseModel.execute_query(query, {"income_id": income_id})

        if not incomes:
            raise HTTPException(status_code=404, detail="Income not found")

        income = incomes[0]

        # Ensure user can only access their own incomes
        if income["user_name"] != current_user.get("name"):
            raise HTTPException(
                status_code=403, detail="Cannot access another user's income"
            )

        return IncomeWithDetails(**income)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch income: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch income: {str(e)}"
        ) from e


@incomes_router.put("/{income_id}", response_model=Income)
async def update_income(
    income_id: str,
    income: IncomeCreate,
    current_user: dict = current_user_dependency,
):
    """Update an income record"""
    try:
        # Verify the income belongs to the current user
        verify_query = """
            SELECT i.id, isc.user_id
            FROM dradic_tech.incomes i
            JOIN dradic_tech.income_sources isc ON i.source_id = isc.id
            WHERE i.id = :income_id
        """
        verify_data = DatabaseModel.execute_query(
            verify_query, {"income_id": income_id}
        )

        if not verify_data:
            raise HTTPException(status_code=404, detail="Income not found")

        if verify_data[0]["user_id"] != current_user.get("uid"):
            raise HTTPException(
                status_code=403, detail="Cannot update another user's income"
            )

        # Verify the new source belongs to the current user
        source_query = """
            SELECT user_id FROM dradic_tech.income_sources
            WHERE id = :source_id
        """
        source_data = DatabaseModel.execute_query(
            source_query, {"source_id": income.source_id}
        )

        if not source_data:
            raise HTTPException(status_code=404, detail="Income source not found")

        if source_data[0]["user_id"] != current_user.get("uid"):
            raise HTTPException(
                status_code=403, detail="Cannot use another user's income source"
            )

        # Update the income record
        update_query = """
            UPDATE dradic_tech.incomes
            SET source_id = :source_id, amount = :amount, currency = :currency,
                date = :date, description = :description, updated_at = NOW()
            WHERE id = :income_id
            RETURNING id, source_id, amount, currency, date, description, created_at, updated_at
        """
        result = DatabaseModel.execute_query(
            update_query,
            {
                "income_id": income_id,
                "source_id": income.source_id,
                "amount": income.amount,
                "currency": income.currency,
                "date": income.date,
                "description": income.description,
            },
        )

        if not result:
            raise HTTPException(
                status_code=500, detail="Failed to update income record"
            )

        return Income(**result[0])
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update income: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to update income: {str(e)}"
        ) from e


@incomes_router.delete("/{income_id}")
async def delete_income(income_id: str, current_user: dict = current_user_dependency):
    """Delete an income record"""
    try:
        # Verify the income belongs to the current user
        verify_query = """
            SELECT i.id, isc.user_id
            FROM dradic_tech.incomes i
            JOIN dradic_tech.income_sources isc ON i.source_id = isc.id
            WHERE i.id = :income_id
        """
        verify_data = DatabaseModel.execute_query(
            verify_query, {"income_id": income_id}
        )

        if not verify_data:
            raise HTTPException(status_code=404, detail="Income not found")

        if verify_data[0]["user_id"] != current_user.get("uid"):
            raise HTTPException(
                status_code=403, detail="Cannot delete another user's income"
            )

        # Delete the income record
        delete_query = "DELETE FROM dradic_tech.incomes WHERE id = :income_id"
        DatabaseModel.execute_query(delete_query, {"income_id": income_id})

        return {"message": "Income deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete income: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to delete income: {str(e)}"
        ) from e


@incomes_router.get("/dashboard/monthly/{year}/{month}", response_model=DashboardData)
async def get_monthly_dashboard(
    year: int,
    month: int,
    currency: str = "CLP",
    current_user: dict = current_user_dependency,
):
    """Get unified monthly income dashboard data"""
    try:
        # Validate month
        if month < 1 or month > 12:
            raise HTTPException(
                status_code=400, detail="Month must be between 1 and 12"
            )

        user_id = current_user.get("uid")

        # Get incomes for the month
        incomes_query = """
            SELECT
                i.id,
                i.amount,
                i.currency,
                i.date,
                i.description,
                ins.name as source_name,
                ins.category as source_category
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

        incomes_data = DatabaseModel.execute_query(incomes_query, params)

        # Calculate total
        total_income = sum(float(inc["amount"]) for inc in incomes_data)

        # Create dashboard cards
        cards = [
            DashboardCard(
                title="Total Income",
                description="Total income for the month",
                value=total_income,
                currency=currency,
            ),
            DashboardCard(
                title="Income Sources",
                description="Number of income sources used",
                value=len(set(inc["source_name"] for inc in incomes_data)),
                currency="",  # Not a currency value
            ),
            DashboardCard(
                title="Income Count",
                description="Number of income records",
                value=len(incomes_data),
                currency="",  # Not a currency value
            ),
        ]

        # Create donut graph data (group incomes by source category)
        category_totals: dict[str, float] = {}
        for income in incomes_data:
            category = income["source_category"] or "Uncategorized"
            amount = float(income["amount"])
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
            title="Income by source category",
            description="Top 4 income source categories",
            data=donut_data,
        )

        # Create table data
        table_rows = []
        for income in incomes_data:
            table_rows.append(
                DashboardTableRow(
                    id=str(income["id"]),
                    name=income["source_name"],
                    category=income["source_category"] or "Uncategorized",
                    amount=f"{currency} {abs(float(income['amount'])):,.0f}",
                    date=income["date"].strftime("%m/%d/%Y"),
                    description=income["description"] or income["source_name"],
                )
            )

        table = DashboardTable(
            title=f"{datetime(year, month, 1).strftime('%B')}",
            description="Click on an income to edit it.",
            columns=["Source", "Category", "Amount", "Date", "Description"],
            data=table_rows,
        )

        return DashboardData(
            year=year,
            month=month,
            currency=currency,
            cards=cards,
            donut_graph=donut_graph,
            table=table,
            total_expenses=0.0,  # Not applicable for income dashboard
            total_income=total_income,
            total_savings=total_income,  # All income is savings in this context
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch income dashboard data: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch income dashboard data: {str(e)}"
        ) from e
