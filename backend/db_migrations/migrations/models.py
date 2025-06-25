from datetime import datetime, timezone
from enum import Enum

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
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


class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)

    # Relationships
    expenses = relationship("Expense", back_populates="user")
    groups = relationship("UserGroup", back_populates="user")


class Group(Base):
    __tablename__ = "groups"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)

    # Relationships
    users = relationship("UserGroup", back_populates="group")
    expenses = relationship("Expense", back_populates="group")


class UserGroup(Base):
    __tablename__ = "user_groups"
    user_id = Column(String, ForeignKey("users.id"), primary_key=True)
    group_id = Column(String, ForeignKey("groups.id"), primary_key=True)
    role = Column(String, nullable=False)  # e.g., "admin", "member"

    # Relationships
    user = relationship("User", back_populates="groups")
    group = relationship("Group", back_populates="users")


class Expense(Base):
    __tablename__ = "expenses"
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=False)
    description = Column(String)
    amount = Column(Float, nullable=False)
    currency = Column(SQLEnum(Currency), nullable=False)
    date = Column(DateTime, nullable=False)
    category = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)

    # Foreign keys
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    group_id = Column(String, ForeignKey("groups.id"))

    # Relationships
    user = relationship("User", back_populates="expenses")
    group = relationship("Group", back_populates="expenses")
