import logging as logger
from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from models import (
    IncomeSource,
    IncomeSourceCreate,
    IncomeSourceResponse,
    IncomeSourceWithUser,
)
from utils.db import DatabaseModel

income_sources_router = APIRouter()


@income_sources_router.post("/", response_model=IncomeSource)
async def create_income_source(source: IncomeSourceCreate):
    """Create a new income source"""
    try:
        # Validate user exists
        user_check_query = """
            SELECT COUNT(*) as count
            FROM tallyup.users
            WHERE id = :user_id
        """
        user_exists = DatabaseModel.execute_query(
            user_check_query, {"user_id": source.user_id}
        )

        if not user_exists or user_exists[0]["count"] == 0:
            raise HTTPException(status_code=400, detail="User not found")

        source_data = source.dict()
        new_source = DatabaseModel.insert_record("income_sources", source_data)
        return IncomeSource(**new_source)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to create income source: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to create income source: {str(e)}"
        ) from e


@income_sources_router.get("/", response_model=IncomeSourceResponse)
async def get_income_sources(
    user_id: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
):
    """Get income sources with optional filters"""
    try:
        # Build the query with filters
        query = """
            SELECT
                isc.id, isc.name, isc.category, isc.is_recurring, isc.user_id,
                isc.created_at, isc.updated_at,
                u.name as user_name, u.email as user_email
            FROM tallyup.income_sources isc
            JOIN tallyup.users u ON isc.user_id = u.id
            WHERE 1=1
        """
        params = {}

        if user_id:
            query += " AND isc.user_id = :user_id"
            params["user_id"] = user_id

        # Get total count
        count_query = f"SELECT COUNT(*) as total FROM ({query}) as subquery"
        total_count = DatabaseModel.execute_query(count_query, params)
        total = total_count[0]["total"] if total_count else 0

        # Add ordering and pagination
        query += " ORDER BY isc.name LIMIT :limit OFFSET :skip"
        params["limit"] = limit
        params["skip"] = skip

        sources = DatabaseModel.execute_query(query, params)

        return IncomeSourceResponse(
            items=[IncomeSourceWithUser(**source) for source in sources],
            total_count=total,
        )
    except Exception as e:
        logger.error(f"Failed to fetch income sources: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch income sources: {str(e)}"
        ) from e


@income_sources_router.get("/{source_id}", response_model=IncomeSourceWithUser)
async def get_income_source(source_id: str):
    """Get a specific income source by ID"""
    try:
        query = """
            SELECT
                isc.id, isc.name, isc.category, isc.is_recurring, isc.user_id,
                isc.created_at, isc.updated_at,
                u.name as user_name, u.email as user_email
            FROM tallyup.income_sources isc
            JOIN tallyup.users u ON isc.user_id = u.id
            WHERE isc.id = :source_id
        """
        sources = DatabaseModel.execute_query(query, {"source_id": source_id})

        if not sources:
            raise HTTPException(status_code=404, detail="Income source not found")

        return IncomeSourceWithUser(**sources[0])
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch income source: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch income source: {str(e)}"
        ) from e


@income_sources_router.put("/{source_id}", response_model=IncomeSource)
async def update_income_source(source_id: str, source: IncomeSourceCreate):
    """Update an income source"""
    try:
        # Validate user exists if user_id is being changed
        if source.user_id:
            user_check_query = """
                SELECT COUNT(*) as count
                FROM tallyup.users
                WHERE id = :user_id
            """
            user_exists = DatabaseModel.execute_query(
                user_check_query, {"user_id": source.user_id}
            )

            if not user_exists or user_exists[0]["count"] == 0:
                raise HTTPException(status_code=400, detail="User not found")

        source_data = source.dict(exclude_unset=True)
        updated_source = DatabaseModel.update_record(
            "income_sources", source_id, source_data
        )

        if not updated_source:
            raise HTTPException(status_code=404, detail="Income source not found")

        return IncomeSource(**updated_source)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update income source: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to update income source: {str(e)}"
        ) from e


@income_sources_router.delete("/{source_id}")
async def delete_income_source(source_id: str):
    """Delete an income source"""
    try:
        # Check if source has income records
        income_check_query = """
            SELECT COUNT(*) as count
            FROM tallyup.incomes
            WHERE source_id = :source_id
        """
        incomes = DatabaseModel.execute_query(
            income_check_query, {"source_id": source_id}
        )

        if incomes and incomes[0]["count"] > 0:
            raise HTTPException(
                status_code=400,
                detail="Cannot delete income source that has income records. Delete income records first.",
            )

        deleted = DatabaseModel.delete_record("income_sources", source_id)

        if not deleted:
            raise HTTPException(status_code=404, detail="Income source not found")

        return {"message": "Income source deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete income source: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to delete income source: {str(e)}"
        ) from e 