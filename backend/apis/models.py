from datetime import date, datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr


# Group Models
class GroupBase(BaseModel):
    name: str
    description: Optional[str] = None

    class Config:
        from_attributes = True


class GroupCreate(GroupBase):
    pass


class Group(GroupBase):
    id: UUID
    created_at: datetime


# User Models
class UserBase(BaseModel):
    id: str
    name: str
    email: EmailStr
    group_id: Optional[UUID] = None

    class Config:
        from_attributes = True


class UserCreate(UserBase):
    pass


class User(UserBase):
    created_at: datetime


class UserWithGroup(User):
    group_name: Optional[str] = None
    group_description: Optional[str] = None


# Expense Item Models
class ExpenseItemBase(BaseModel):
    name: str
    category: Optional[str] = None
    is_fixed: bool = False
    user_id: str

    class Config:
        from_attributes = True


class ExpenseItemCreate(ExpenseItemBase):
    pass


class ExpenseItem(ExpenseItemBase):
    id: UUID


class ExpenseItemWithUser(ExpenseItem):
    user_name: str
    user_email: str


# Expense Models
class ExpenseBase(BaseModel):
    item_id: UUID
    date: date
    amount: float
    currency: str

    class Config:
        from_attributes = True


class ExpenseCreate(ExpenseBase):
    pass


class Expense(ExpenseBase):
    id: UUID
    created_at: datetime


class ExpenseWithDetails(Expense):
    item_name: str
    item_category: Optional[str] = None
    item_is_fixed: bool
    user_name: str
    user_email: str
    group_name: Optional[str] = None


# Summary Models
class ExpenseSummary(BaseModel):
    total_amount: float
    currency: str
    count: int


class CategorySummary(BaseModel):
    category: Optional[str]
    total_amount: float
    count: int


class MonthlySummary(BaseModel):
    year: int
    month: int
    total_amount: float
    currency: str
    categories: List[CategorySummary]


# Income Source Models
class IncomeSourceBase(BaseModel):
    name: str
    category: Optional[str] = None
    is_recurring: bool = True
    user_id: str

    class Config:
        from_attributes = True


class IncomeSourceCreate(IncomeSourceBase):
    pass


class IncomeSource(IncomeSourceBase):
    id: UUID
    created_at: datetime
    updated_at: datetime


class IncomeSourceWithUser(IncomeSource):
    user_name: str
    user_email: str


# Income Models
class IncomeBase(BaseModel):
    source_id: UUID
    amount: float
    currency: str
    date: date
    description: Optional[str] = None

    class Config:
        from_attributes = True


class IncomeCreate(IncomeBase):
    pass


class Income(IncomeBase):
    id: UUID
    created_at: datetime
    updated_at: datetime


class IncomeWithDetails(Income):
    source_name: str
    source_category: Optional[str] = None
    user_name: str
    user_email: str
    group_name: Optional[str] = None


class IncomeSummary(BaseModel):
    total_amount: float
    currency: str
    count: int


class MonthlyIncomeSummary(MonthlySummary):
    pass


# Response Models for API
class IncomeSourceResponse(BaseModel):
    items: List[IncomeSourceWithUser]
    total_count: int


class IncomeResponse(BaseModel):
    incomes: List[IncomeWithDetails]
    total_count: int
    summary: IncomeSummary


class ExpenseItemResponse(BaseModel):
    items: List[ExpenseItemWithUser]
    total_count: int


class ExpenseResponse(BaseModel):
    expenses: List[ExpenseWithDetails]
    total_count: int
    summary: ExpenseSummary


# Blog Models
class BlogPostMetadata(BaseModel):
    slug: str
    title: str
    created_at: str
    updated_at: str
    image: Optional[str] = None

    class Config:
        from_attributes = True


class BlogPost(BlogPostMetadata):
    content: str


class BlogPostCreate(BaseModel):
    slug: str
    title: str
    content: str
    image: Optional[str] = None

    class Config:
        from_attributes = True


class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    image: Optional[str] = None

    class Config:
        from_attributes = True


class BlogPostResponse(BaseModel):
    posts: List[BlogPost]
    total_count: int


# Auth Models
class AuthToken(BaseModel):
    token: str


class AuthUser(BaseModel):
    uid: str
    email: str
    name: str
    email_verified: bool
