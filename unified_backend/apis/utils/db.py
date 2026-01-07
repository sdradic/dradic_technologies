import os
from typing import Any, Dict, List, Optional, TypeVar
from uuid import UUID, uuid4
import uuid

import pandas as pd
from pydantic import BaseModel
from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    Float,
    ForeignKey,
    MetaData,
    String,
    Table,
    create_engine,
    text,
)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.sql import func

# Database connection
SQLALCHEMY_DATABASE_URL = os.getenv("SUPABASE_DATABASE_URL")

if not SQLALCHEMY_DATABASE_URL:
    raise ValueError("SUPABASE_DATABASE_URL environment variable is required")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=240,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Define schema metadata
metadata = MetaData(schema="dradic_tech")

# Define tables matching the migration schema
groups_table = Table(
    "groups",
    metadata,
    Column("id", PG_UUID(as_uuid=True), primary_key=True, default=uuid4),
    Column("name", String, nullable=False),
    Column("description", String),
    Column(
        "created_at", DateTime(timezone=True), server_default=func.now(), nullable=False
    ),
)

users_table = Table(
    "users",
    metadata,
    Column("id", String, primary_key=True),
    Column("name", String, nullable=False),
    Column("email", String, nullable=False, unique=True),
    Column(
        "created_at", DateTime(timezone=True), server_default=func.now(), nullable=False
    ),
    Column(
        "group_id",
        PG_UUID(as_uuid=True),
        ForeignKey("dradic_tech.groups.id"),
        nullable=True,
    ),
)

expense_items_table = Table(
    "expense_items",
    metadata,
    Column("id", PG_UUID(as_uuid=True), primary_key=True, default=uuid4),
    Column("name", String, nullable=False),
    Column("category", String),
    Column("is_fixed", Boolean, nullable=False, server_default=text("false")),
    Column("user_id", String, ForeignKey("dradic_tech.users.id"), nullable=False),
)

expenses_table = Table(
    "expenses",
    metadata,
    Column("id", PG_UUID(as_uuid=True), primary_key=True, default=uuid4),
    Column(
        "item_id",
        PG_UUID(as_uuid=True),
        ForeignKey("dradic_tech.expense_items.id"),
        nullable=False,
    ),
    Column("date", Date, nullable=False),
    Column("amount", Float, nullable=False),
    Column("currency", String, nullable=False),
    Column(
        "created_at", DateTime(timezone=True), server_default=func.now(), nullable=False
    ),
)

income_sources_table = Table(
    "income_sources",
    metadata,
    Column("id", String, primary_key=True),
    Column("name", String, nullable=False),
    Column("category", String),
    Column("is_recurring", Boolean, nullable=False, server_default=text("true")),
    Column("user_id", String, ForeignKey("dradic_tech.users.id"), nullable=False),
    Column(
        "created_at", DateTime(timezone=True), server_default=func.now(), nullable=False
    ),
    Column(
        "updated_at", DateTime(timezone=True), server_default=func.now(), nullable=False
    ),
)

incomes_table = Table(
    "incomes",
    metadata,
    Column("id", String, primary_key=True),
    Column("source_id", String, ForeignKey("dradic_tech.income_sources.id"), nullable=False),
    Column("amount", Float, nullable=False),
    Column("currency", String, nullable=False),
    Column("date", Date, nullable=False),
    Column("description", String),
    Column(
        "created_at", DateTime(timezone=True), server_default=func.now(), nullable=False
    ),
    Column(
        "updated_at", DateTime(timezone=True), server_default=func.now(), nullable=False
    ),
)

# Gym Tracker tables
exercises_table = Table(
    "exercises",
    metadata,
    Column("id", PG_UUID(as_uuid=True), primary_key=True, default=uuid4),
    Column("name", String, nullable=False, unique=True),
    Column("muscles_trained", JSONB, nullable=False),  # JSONB column type
    Column(
        "created_at", DateTime(timezone=True), server_default=func.now(), nullable=False
    ),
    Column(
        "updated_at", DateTime(timezone=True), server_default=func.now(), nullable=False
    ),
)

gym_activity_table = Table(
    "gym_activity",
    metadata,
    Column("id", PG_UUID(as_uuid=True), primary_key=True, default=uuid4),
    Column("user_id", String, ForeignKey("dradic_tech.users.id"), nullable=False),
    Column("exercise_id", PG_UUID(as_uuid=True), ForeignKey("dradic_tech.exercises.id"), nullable=False),
    Column("sets", Float, nullable=False),
    Column("reps", Float, nullable=False),
    Column("weight", Float, nullable=True),
    Column(
        "created_at", DateTime(timezone=True), server_default=func.now(), nullable=False
    ),
    Column(
        "updated_at", DateTime(timezone=True), server_default=func.now(), nullable=False
    ),
)


def get_db() -> Session:
    """Get database session"""
    db = SessionLocal()
    try:
        return db
    finally:
        db.close()


T = TypeVar("T", bound=BaseModel)


class DatabaseModel(BaseModel):
    class Config:
        from_attributes = True

    @staticmethod
    def fetch_as_dataframe(query: str, params: Optional[Dict] = None) -> pd.DataFrame:
        """Execute a raw SQL query and return results as a pandas DataFrame"""
        with engine.connect() as conn:
            result = conn.execute(text(query), params or {})
            columns = result.keys()
            data = result.fetchall()
            return pd.DataFrame(data, columns=columns)

    @staticmethod
    def execute_query(
        query: str, params: Optional[Dict] = None
    ) -> List[Dict[str, Any]]:
        """Execute a SQL query and return results as a list of dictionaries"""
        with engine.connect() as conn:
            result = conn.execute(text(query), params or {})
            return [dict(row._mapping) for row in result]

    @staticmethod
    def insert_record(table_name: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Insert a record into the specified table"""
        # Get the table object
        table_map = {
            "groups": groups_table,
            "users": users_table,
            "expense_items": expense_items_table,
            "expenses": expenses_table,
            "income_sources": income_sources_table,
            "incomes": incomes_table,
            "exercises": exercises_table,
            "gym_activity": gym_activity_table,
        }

        if table_name not in table_map:
            raise ValueError(f"Unknown table: {table_name}")

        table = table_map[table_name]

        with engine.connect() as conn:
            # Add ID if not present
            if "id" not in data:
                if table_name in ["income_sources", "incomes"]:
                    data["id"] = str(uuid.uuid4())
                else:
                    data["id"] = uuid4()

            # Insert and return the record
            conn.execute(table.insert().values(**data))
            conn.commit()

            # Fetch the inserted record
            inserted = conn.execute(
                table.select().where(table.c.id == data["id"])
            ).first()

            return dict(inserted._mapping) if inserted else data

    @staticmethod
    def update_record(
        table_name: str, record_id: str, data: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        """Update a record in the specified table"""
        table_map = {
            "groups": groups_table,
            "users": users_table,
            "expense_items": expense_items_table,
            "expenses": expenses_table,
            "income_sources": income_sources_table,
            "incomes": incomes_table,
            "exercises": exercises_table,
            "gym_activity": gym_activity_table,
        }

        if table_name not in table_map:
            raise ValueError(f"Unknown table: {table_name}")

        table = table_map[table_name]

        with engine.connect() as conn:
            # Update the record
            result = conn.execute(
                table.update().where(table.c.id == record_id).values(**data)
            )
            conn.commit()

            if result.rowcount == 0:
                return None

            # Fetch the updated record
            updated = conn.execute(
                table.select().where(table.c.id == record_id)
            ).first()

            return dict(updated._mapping) if updated else None

    @staticmethod
    def delete_record(table_name: str, record_id: str) -> bool:
        """Delete a record from the specified table"""
        table_map = {
            "groups": groups_table,
            "users": users_table,
            "expense_items": expense_items_table,
            "expenses": expenses_table,
            "income_sources": income_sources_table,
            "incomes": incomes_table,
            "exercises": exercises_table,
            "gym_activity": gym_activity_table,
        }

        if table_name not in table_map:
            raise ValueError(f"Unknown table: {table_name}")

        table = table_map[table_name]

        with engine.connect() as conn:
            result = conn.execute(table.delete().where(table.c.id == record_id))
            conn.commit()
            return result.rowcount > 0
