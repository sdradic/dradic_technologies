import logging as logger
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException

from models import (
    IncomeSource,
    IncomeSourceCreate,
    IncomeSourceResponse,
    IncomeSourceWithUser,
)
from utils.auth import get_current_user
from utils.db import DatabaseModel

income_sources_router = APIRouter()

# Module-level singleton for dependency injection
current_user_dependency = Depends(get_current_user)


@income_sources_router.post("/", response_model=IncomeSource)
async def create_income_source(
    source: IncomeSourceCreate, current_user: dict = current_user_dependency
):
    """Create a new income source"""
    try:
        # Ensure user can only create income sources for themselves
        if source.user_id != current_user.get("uid"):
            raise HTTPException(
                status_code=403, detail="Cannot create income source for another user"
            )

        # Validate user exists
        user_check_query = """
            SELECT COUNT(*) as count
            FROM dradic_tech.users
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
    category: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
    current_user: dict = current_user_dependency,
):
    """Get income sources with optional filters"""
    try:
        # If user_id is specified, ensure it matches the current user
        if user_id and user_id != current_user.get("uid"):
            raise HTTPException(
                status_code=403, detail="Cannot access another user's income sources"
            )

        # If no user_id is specified, default to current user's sources
        if not user_id:
            user_id = current_user.get("uid")

        # Build the query with filters
        query = """
            SELECT
                isc.id, isc.name, isc.category, isc.user_id, isc.created_at, isc.updated_at,
                u.name as user_name, u.email as user_email
            FROM dradic_tech.income_sources isc
            JOIN dradic_tech.users u ON isc.user_id = u.id
            WHERE isc.user_id = :user_id
        """
        params = {"user_id": user_id}

        if category:
            query += " AND isc.category = :category"
            params["category"] = category

        # Get total count
        count_query = f"SELECT COUNT(*) as total FROM ({query}) as subquery"
        total_count = DatabaseModel.execute_query(count_query, params)
        total = total_count[0]["total"] if total_count else 0

        # Add pagination
        query += " ORDER BY isc.name LIMIT :limit OFFSET :offset"
        params["limit"] = str(limit)
        params["offset"] = str(offset)

        sources = DatabaseModel.execute_query(query, params)

        return IncomeSourceResponse(
            sources=[IncomeSourceWithUser(**source) for source in sources],
            total_count=total,
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch income sources: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch income sources: {str(e)}"
        ) from e


@income_sources_router.get("/{source_id}", response_model=IncomeSourceWithUser)
async def get_income_source(
    source_id: str, current_user: dict = current_user_dependency
):
    """Get a specific income source by ID"""
    try:
        query = """
            SELECT
                isc.id, isc.name, isc.category, isc.user_id, isc.created_at, isc.updated_at,
                u.name as user_name, u.email as user_email
            FROM dradic_tech.income_sources isc
            JOIN dradic_tech.users u ON isc.user_id = u.id
            WHERE isc.id = :source_id
        """
        sources = DatabaseModel.execute_query(query, {"source_id": source_id})

        if not sources:
            raise HTTPException(status_code=404, detail="Income source not found")

        source = sources[0]

        # Ensure user can only access their own income sources
        if source["user_id"] != current_user.get("uid"):
            raise HTTPException(
                status_code=403, detail="Cannot access another user's income source"
            )

        return IncomeSourceWithUser(**source)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch income source: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch income source: {str(e)}"
        ) from e


@income_sources_router.put("/{source_id}", response_model=IncomeSource)
async def update_income_source(
    source_id: str,
    source: IncomeSourceCreate,
    current_user: dict = current_user_dependency,
):
    """Update an income source"""
    try:
        # First check if the source exists and belongs to the current user
        existing_source_query = """
            SELECT user_id FROM dradic_tech.income_sources WHERE id = :source_id
        """
        existing_sources = DatabaseModel.execute_query(
            existing_source_query, {"source_id": source_id}
        )

        if not existing_sources:
            raise HTTPException(status_code=404, detail="Income source not found")

        if existing_sources[0]["user_id"] != current_user.get("uid"):
            raise HTTPException(
                status_code=403, detail="Cannot update another user's income source"
            )

        # Ensure the user_id in the update matches the current user
        if source.user_id != current_user.get("uid"):
            raise HTTPException(
                status_code=403, detail="Cannot change income source ownership"
            )

        # Validate user exists if user_id is being changed
        if source.user_id:
            user_check_query = """
                SELECT COUNT(*) as count
                FROM dradic_tech.users
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
async def delete_income_source(
    source_id: str, current_user: dict = current_user_dependency
):
    """Delete an income source"""
    try:
        # First check if the source exists and belongs to the current user
        existing_source_query = """
            SELECT user_id FROM dradic_tech.income_sources WHERE id = :source_id
        """
        existing_sources = DatabaseModel.execute_query(
            existing_source_query, {"source_id": source_id}
        )

        if not existing_sources:
            raise HTTPException(status_code=404, detail="Income source not found")

        if existing_sources[0]["user_id"] != current_user.get("uid"):
            raise HTTPException(
                status_code=403, detail="Cannot delete another user's income source"
            )

        # Check if source has incomes
        income_check_query = """
            SELECT COUNT(*) as count
            FROM dradic_tech.incomes
            WHERE source_id = :source_id
        """
        incomes = DatabaseModel.execute_query(
            income_check_query, {"source_id": source_id}
        )

        if incomes and incomes[0]["count"] > 0:
            raise HTTPException(
                status_code=400,
                detail="Cannot delete income source that has incomes. Delete incomes first.",
            )

        deleted = DatabaseModel.delete_record("income_sources", str(source_id))

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


@income_sources_router.get("/{source_id}/incomes")
async def get_source_incomes(
    source_id: str,
    limit: int = 100,
    offset: int = 0,
    current_user: dict = current_user_dependency,
):
    """Get all incomes for a specific income source"""
    try:
        # First check if the source belongs to the current user
        source_check_query = """
            SELECT user_id FROM dradic_tech.income_sources WHERE id = :source_id
        """
        sources = DatabaseModel.execute_query(
            source_check_query, {"source_id": source_id}
        )

        if not sources:
            raise HTTPException(status_code=404, detail="Income source not found")

        if sources[0]["user_id"] != current_user.get("uid"):
            raise HTTPException(
                status_code=403, detail="Cannot access another user's income source"
            )

        query = """
            SELECT
                i.id, i.source_id, i.date, i.amount, i.currency, i.created_at, i.updated_at,
                isc.name as source_name, isc.category as source_category,
                u.name as user_name, u.email as user_email,
                g.name as group_name
            FROM dradic_tech.incomes i
            JOIN dradic_tech.income_sources isc ON i.source_id = isc.id
            JOIN dradic_tech.users u ON isc.user_id = u.id
            LEFT JOIN dradic_tech.groups g ON u.group_id = g.id
            WHERE i.source_id = :source_id
            ORDER BY i.date DESC
            LIMIT :limit OFFSET :offset
        """

        incomes = DatabaseModel.execute_query(
            query, {"source_id": source_id, "limit": limit, "offset": offset}
        )

        return incomes
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch source incomes: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch source incomes: {str(e)}"
        ) from e


@income_sources_router.get("/categories/")
async def get_categories(current_user: dict = current_user_dependency):
    """Get all unique categories"""
    try:
        query = """
            SELECT DISTINCT category
            FROM dradic_tech.income_sources
            WHERE category IS NOT NULL AND user_id = :user_id
            ORDER BY category
        """

        categories = DatabaseModel.execute_query(
            query, {"user_id": current_user.get("uid")}
        )
        return [cat["category"] for cat in categories if cat["category"]]
    except Exception as e:
        logger.error(f"Failed to fetch categories: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch categories: {str(e)}"
        ) from e
