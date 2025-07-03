import logging as logger
from datetime import date
from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from models import (
    Income,
    IncomeCreate,
    IncomeResponse,
    IncomeSummary,
    IncomeWithDetails,
    MonthlyIncomeSummary,
)
from utils.db import DatabaseModel

incomes_router = APIRouter()


@incomes_router.post("/", response_model=Income)
async def create_income(income: IncomeCreate):
    """Create a new income record"""
    try:
        # Validate income source exists
        source_check_query = """
            SELECT COUNT(*) as count
            FROM dradic_tech.income_sources
            WHERE id = :source_id
        """
        source_exists = DatabaseModel.execute_query(
            source_check_query, {"source_id": income.source_id}
        )

        if not source_exists or source_exists[0]["count"] == 0:
            raise HTTPException(status_code=400, detail="Income source not found")

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
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
):
    """Get incomes with optional filters"""
    try:
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
            WHERE 1=1
        """
        params = {}

        if user_id:
            query += " AND u.id = :user_id"
            params["user_id"] = user_id

        if source_id:
            query += " AND i.source_id = :source_id"
            params["source_id"] = source_id

        if start_date:
            query += " AND i.date >= :start_date"
            params["start_date"] = start_date

        if end_date:
            query += " AND i.date <= :end_date"
            params["end_date"] = end_date

        # Get total count
        count_query = f"SELECT COUNT(*) as total FROM ({query}) as subquery"
        total_count = DatabaseModel.execute_query(count_query, params)
        total = total_count[0]["total"] if total_count else 0

        # Add ordering and pagination
        query += " ORDER BY i.date DESC, i.created_at DESC LIMIT :limit OFFSET :skip"
        params["limit"] = limit
        params["skip"] = skip

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
            WHERE 1=1
        """

        # Apply same filters for summary
        summary_params = {
            k: v for k, v in params.items() if k not in ["limit", "skip"]
        }

        if user_id:
            summary_query += " AND u.id = :user_id"
        if source_id:
            summary_query += " AND i.source_id = :source_id"
        if start_date:
            summary_query += " AND i.date >= :start_date"
        if end_date:
            summary_query += " AND i.date <= :end_date"

        summary_query += " GROUP BY i.currency"

        summary_data = DatabaseModel.execute_query(summary_query, summary_params)

        # For simplicity, return the first currency's summary or defaults
        if summary_data:
            summary = IncomeSummary(
                total_amount=float(summary_data[0]["total_amount"] or 0),
                currency=summary_data[0]["currency"],
                count=int(summary_data[0]["count"] or 0),
            )
        else:
            summary = IncomeSummary(total_amount=0.0, currency="USD", count=0)

        return IncomeResponse(
            incomes=[IncomeWithDetails(**income) for income in incomes],
            total_count=total,
            summary=summary,
        )
    except Exception as e:
        logger.error(f"Failed to fetch incomes: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch incomes: {str(e)}"
        ) from e


@incomes_router.get("/monthly-summary", response_model=MonthlyIncomeSummary)
async def get_monthly_income_summary(
    year: int = Query(..., ge=2000, le=9999),
    month: int = Query(..., ge=1, le=12),
    user_id: Optional[str] = None,
    currency: str = "USD",
):
    """Get monthly income summary"""
    try:
        # Build the query with filters
        query = """
            SELECT
                i.currency,
                SUM(i.amount) as total_amount,
                COUNT(*) as count,
                isc.category
            FROM dradic_tech.incomes i
            JOIN dradic_tech.income_sources isc ON i.source_id = isc.id
            JOIN dradic_tech.users u ON isc.user_id = u.id
            WHERE EXTRACT(YEAR FROM i.date) = :year
                AND EXTRACT(MONTH FROM i.date) = :month
                AND i.currency = :currency
        """
        params = {"year": year, "month": month, "currency": currency}

        if user_id:
            query += " AND u.id = :user_id"
            params["user_id"] = user_id

        query += " GROUP BY i.currency, isc.category ORDER BY isc.category"

        summary_data = DatabaseModel.execute_query(query, params)

        # Calculate total and build category summaries
        total_amount = 0.0
        total_count = 0
        categories = []

        for row in summary_data:
            category_total = float(row["total_amount"] or 0)
            category_count = int(row["count"] or 0)
            total_amount += category_total
            total_count += category_count

            categories.append({
                "category": row["category"],
                "total_amount": category_total,
                "count": category_count,
            })

        return MonthlyIncomeSummary(
            year=year,
            month=month,
            total_amount=total_amount,
            currency=currency,
            categories=categories,
        )
    except Exception as e:
        logger.error(f"Failed to fetch monthly income summary: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch monthly income summary: {str(e)}"
        ) from e


@incomes_router.get("/{income_id}", response_model=IncomeWithDetails)
async def get_income(income_id: str):
    """Get a specific income record by ID"""
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
            raise HTTPException(status_code=404, detail="Income record not found")

        return IncomeWithDetails(**incomes[0])
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch income: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch income: {str(e)}"
        ) from e


@incomes_router.put("/{income_id}", response_model=Income)
async def update_income(income_id: str, income: IncomeCreate):
    """Update an income record"""
    try:
        # Validate income source exists if source_id is being changed
        if income.source_id:
            source_check_query = """
                SELECT COUNT(*) as count
                FROM dradic_tech.income_sources
                WHERE id = :source_id
            """
            source_exists = DatabaseModel.execute_query(
                source_check_query, {"source_id": income.source_id}
            )

            if not source_exists or source_exists[0]["count"] == 0:
                raise HTTPException(status_code=400, detail="Income source not found")

        income_data = income.dict(exclude_unset=True)
        updated_income = DatabaseModel.update_record(
            "incomes", income_id, income_data
        )

        if not updated_income:
            raise HTTPException(status_code=404, detail="Income record not found")

        return Income(**updated_income)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update income: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to update income: {str(e)}"
        ) from e


@incomes_router.delete("/{income_id}")
async def delete_income(income_id: str):
    """Delete an income record"""
    try:
        deleted = DatabaseModel.delete_record("incomes", income_id)

        if not deleted:
            raise HTTPException(status_code=404, detail="Income record not found")

        return {"message": "Income record deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete income: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to delete income: {str(e)}"
        ) from e
