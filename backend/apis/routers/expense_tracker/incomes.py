import logging as logger
from datetime import date
from typing import Optional

from fastapi import APIRouter, HTTPException, Query, Depends
from models import (
    Income,
    IncomeCreate,
    IncomeResponse,
    IncomeSummary,
    IncomeWithDetails,
    MonthlyIncomeSummary,
)
from utils.db import DatabaseModel
from utils.auth import get_current_user

incomes_router = APIRouter()

@incomes_router.post("/", response_model=Income)
async def create_income(income: IncomeCreate, current_user: dict = Depends(get_current_user)):
    """Create a new income record"""
    try:
        # Validate income source exists and belongs to current user
        source_check_query = """
            SELECT user_id FROM dradic_tech.income_sources WHERE id = :source_id
        """
        source_result = DatabaseModel.execute_query(
            source_check_query, {"source_id": income.source_id}
        )

        if not source_result:
            raise HTTPException(status_code=400, detail="Income source not found")
        
        if source_result[0]["user_id"] != current_user.get("user_id"):
            raise HTTPException(status_code=403, detail="Cannot create income for another user's source")

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
    current_user: dict = Depends(get_current_user)
):
    """Get incomes with optional filters"""
    try:
        # If user_id is specified, ensure it matches the current user
        if user_id and user_id != current_user.get("user_id"):
            raise HTTPException(status_code=403, detail="Cannot access another user's incomes")
        
        # If no user_id is specified, default to current user's incomes
        if not user_id:
            user_id = current_user.get("user_id")

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
            WHERE u.id = :user_id
        """
        params = {"user_id": user_id}

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
            WHERE u.id = :user_id
        """

        # Apply same filters for summary
        summary_params = {
            k: v for k, v in params.items() if k not in ["limit", "skip"]
        }

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
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch incomes: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch incomes: {str(e)}"
        ) from e

@incomes_router.get("/monthly-summary", response_model=MonthlyIncomeSummary)
async def get_monthly_income_summary(
    year: int = Query(..., ge=2000, le=9999),
    month: int = Query(..., ge=1, le=12),
    currency: str = "USD",
    current_user: dict = Depends(get_current_user)
):
    """Get monthly income summary"""
    try:
        user_id = current_user.get("user_id")
        
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
                AND u.id = :user_id
            GROUP BY i.currency, isc.category ORDER BY isc.category
        """
        params = {"year": year, "month": month, "currency": currency, "user_id": user_id}

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
            count=total_count,
            currency=currency,
            categories=categories,
        )
    except Exception as e:
        logger.error(f"Failed to fetch monthly income summary: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch monthly income summary: {str(e)}"
        ) from e

@incomes_router.get("/{income_id}", response_model=IncomeWithDetails)
async def get_income(income_id: str, current_user: dict = Depends(get_current_user)):
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
        
        # Check if income belongs to current user
        if income["user_name"] != current_user.get("name") and income["user_email"] != current_user.get("email"):
            # Double check with user_id from income_sources
            user_check_query = """
                SELECT isc.user_id FROM dradic_tech.income_sources isc 
                JOIN dradic_tech.incomes i ON i.source_id = isc.id
                WHERE i.id = :income_id
            """
            user_result = DatabaseModel.execute_query(user_check_query, {"income_id": income_id})
            if user_result and user_result[0]["user_id"] != current_user.get("user_id"):
                raise HTTPException(status_code=403, detail="Cannot access another user's income")

        return IncomeWithDetails(**income)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch income: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch income: {str(e)}"
        ) from e

@incomes_router.put("/{income_id}", response_model=Income)
async def update_income(income_id: str, income: IncomeCreate, current_user: dict = Depends(get_current_user)):
    """Update an income"""
    try:
        # First check if the income exists and belongs to the current user
        existing_income_query = """
            SELECT isc.user_id FROM dradic_tech.incomes i
            JOIN dradic_tech.income_sources isc ON i.source_id = isc.id
            WHERE i.id = :income_id
        """
        existing_result = DatabaseModel.execute_query(existing_income_query, {"income_id": income_id})
        
        if not existing_result:
            raise HTTPException(status_code=404, detail="Income not found")
        
        if existing_result[0]["user_id"] != current_user.get("user_id"):
            raise HTTPException(status_code=403, detail="Cannot update another user's income")

        # Validate income source exists and belongs to current user if source_id is being changed
        if income.source_id:
            source_check_query = """
                SELECT user_id FROM dradic_tech.income_sources WHERE id = :source_id
            """
            source_result = DatabaseModel.execute_query(
                source_check_query, {"source_id": income.source_id}
            )

            if not source_result:
                raise HTTPException(status_code=400, detail="Income source not found")
            
            if source_result[0]["user_id"] != current_user.get("user_id"):
                raise HTTPException(status_code=403, detail="Cannot assign income to another user's source")

        income_data = income.dict(exclude_unset=True)
        updated_income = DatabaseModel.update_record("incomes", income_id, income_data)

        if not updated_income:
            raise HTTPException(status_code=404, detail="Income not found")

        return Income(**updated_income)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update income: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to update income: {str(e)}"
        ) from e

@incomes_router.delete("/{income_id}")
async def delete_income(income_id: str, current_user: dict = Depends(get_current_user)):
    """Delete an income"""
    try:
        # First check if the income exists and belongs to the current user
        existing_income_query = """
            SELECT isc.user_id FROM dradic_tech.incomes i
            JOIN dradic_tech.income_sources isc ON i.source_id = isc.id
            WHERE i.id = :income_id
        """
        existing_result = DatabaseModel.execute_query(existing_income_query, {"income_id": income_id})
        
        if not existing_result:
            raise HTTPException(status_code=404, detail="Income not found")
        
        if existing_result[0]["user_id"] != current_user.get("user_id"):
            raise HTTPException(status_code=403, detail="Cannot delete another user's income")

        deleted = DatabaseModel.delete_record("incomes", income_id)

        if not deleted:
            raise HTTPException(status_code=404, detail="Income not found")

        return {"message": "Income deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete income: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to delete income: {str(e)}"
        ) from e
