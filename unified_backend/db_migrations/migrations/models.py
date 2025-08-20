from datetime import datetime, timezone
from enum import Enum
from uuid import uuid4

from sqlalchemy import (
    UUID,
    Boolean,
    Column,
    Date,
    DateTime,
    Float,
    ForeignKey,
    String,
    Table,
)
from sqlalchemy import (
    Enum as SQLEnum,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class Currency(str, Enum):
    USD = "USD"
    CLP = "CLP"
    EUR = "EUR"


class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"


# Junction table for many-to-many relationship between users and groups
user_groups = Table(
    "user_groups",
    Base.metadata,
    Column(
        "user_id",
        String,
        ForeignKey("dradic_tech.users.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "group_id",
        UUID(as_uuid=True),
        ForeignKey("dradic_tech.groups.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    schema="dradic_tech",
)


class Group(Base):
    __tablename__ = "groups"
    __table_args__ = {"schema": "dradic_tech"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name = Column(String, nullable=False)
    description = Column(String)
    created_at = Column(
        DateTime(timezone=True), default=datetime.now(timezone.utc), nullable=False
    )

    # Relationships
    users = relationship("User", secondary=user_groups, back_populates="groups")


class User(Base):
    __tablename__ = "users"
    __table_args__ = {"schema": "dradic_tech"}

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    role = Column(
        SQLEnum(UserRole, schema="dradic_tech"), nullable=False, default=UserRole.USER
    )
    created_at = Column(
        DateTime(timezone=True), default=datetime.now(timezone.utc), nullable=False
    )

    # Relationships
    groups = relationship("Group", secondary=user_groups, back_populates="users")
    expense_items = relationship("ExpenseItem", back_populates="user")
    income_sources = relationship("IncomeSource", back_populates="user")


class ExpenseItem(Base):
    __tablename__ = "expense_items"
    __table_args__ = {"schema": "dradic_tech"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name = Column(String, nullable=False)
    category = Column(String)
    is_fixed = Column(Boolean, nullable=False, default=False)
    user_id = Column(String, ForeignKey("dradic_tech.users.id"), nullable=False)

    # Relationships
    user = relationship("User", back_populates="expense_items")
    expenses = relationship("Expense", back_populates="expense_item")


class Expense(Base):
    __tablename__ = "expenses"
    __table_args__ = {"schema": "dradic_tech"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    item_id = Column(
        UUID(as_uuid=True), ForeignKey("dradic_tech.expense_items.id"), nullable=False
    )
    date = Column(Date, nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String, nullable=False)
    created_at = Column(
        DateTime(timezone=True), default=datetime.now(timezone.utc), nullable=False
    )

    # Relationships
    expense_item = relationship("ExpenseItem", back_populates="expenses")


class IncomeSource(Base):
    __tablename__ = "income_sources"
    __table_args__ = {"schema": "dradic_tech"}

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    category = Column(String)
    is_recurring = Column(Boolean, nullable=False, default=True)
    user_id = Column(
        String, ForeignKey("dradic_tech.users.id", ondelete="CASCADE"), nullable=False
    )
    created_at = Column(
        DateTime(timezone=True), default=datetime.now(timezone.utc), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True), default=datetime.now(timezone.utc), nullable=False
    )

    # Relationships
    user = relationship("User", back_populates="income_sources")
    incomes = relationship("Income", back_populates="income_source")


class Income(Base):
    __tablename__ = "incomes"
    __table_args__ = {"schema": "dradic_tech"}

    id = Column(String, primary_key=True)
    source_id = Column(
        String,
        ForeignKey("dradic_tech.income_sources.id", ondelete="CASCADE"),
        nullable=False,
    )
    amount = Column(Float, nullable=False)
    currency = Column(SQLEnum(Currency, schema="dradic_tech"), nullable=False)
    date = Column(Date, nullable=False)
    description = Column(String)
    created_at = Column(
        DateTime(timezone=True), default=datetime.now(timezone.utc), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True), default=datetime.now(timezone.utc), nullable=False
    )

    # Relationships
    income_source = relationship("IncomeSource", back_populates="incomes")
