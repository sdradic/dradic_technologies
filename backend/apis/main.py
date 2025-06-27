import os
from typing import Any
from dotenv import load_dotenv
from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from routers.expense_tracker import expense_items, expenses, groups, users, incomes, income_sources
from routers.blog import blog_router

# Load environment variables from .env file
load_dotenv()

app = FastAPI(
    title="Dradic Technologies API",
    description="Unified API for all Dradic Technologies projects",
    version="1.0.0",
)

DRADIC_ENV = os.getenv("DRADIC__ENV")

if DRADIC_ENV == "LOCAL":
    allowed_origins = [
        "http://localhost:3000",
    ]
else:
    allowed_origins = [
        "https://expense-tracker-kappa-livid.vercel.app",
        "https://dradic-technologies.vercel.app",
        "https://blog-cms-livid.vercel.app",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
)


# Add error handling middleware
@app.middleware("http")
async def errors_handling(request: Any, call_next):
    try:
        return await call_next(request)
    except Exception as exc:
        return JSONResponse(
            status_code=500,
            content={"detail": str(exc)},
        )


# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to Dradic Technologies Unified API"}

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc)}


# Include routers
app.include_router(
    blog_router,
    prefix="/api/blog",
    tags=["Blog"],
)
app.include_router(
    groups.groups_router,
    prefix="/api/expense-tracker/groups",
    tags=["Expense Tracker - Groups"],
)
app.include_router(
    users.users_router,
    prefix="/api/expense-tracker/users",
    tags=["Expense Tracker - Users"],
)
app.include_router(
    expense_items.expense_items_router,
    prefix="/api/expense-tracker/expense-items",
    tags=["Expense Tracker - Expense Items"],
)
app.include_router(
    expenses.expenses_router,
    prefix="/api/expense-tracker/expenses",
    tags=["Expense Tracker - Expenses"],
)
app.include_router(
    income_sources.income_sources_router,
    prefix="/api/expense-tracker/income-sources",
    tags=["Expense Tracker - Income Sources"],
)
app.include_router(
    incomes.incomes_router,
    prefix="/api/expense-tracker/incomes",
    tags=["Expense Tracker - Incomes"],
)   

if __name__ == "__main__":
    import os

    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
