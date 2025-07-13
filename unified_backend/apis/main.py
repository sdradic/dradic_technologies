import logging
import os
from datetime import datetime, timezone
from typing import Any, Optional

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from fastapi.security import HTTPBearer

from routers.blog import blog_router
from routers.expense_tracker import (
    expense_items,
    expenses,
    groups,
    income_sources,
    incomes,
    users,
)
from utils.auth import get_credentials_from_token

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Dradic Technologies API",
    description="Unified API for all Dradic Technologies projects",
    version="1.0.0",
)

DRADIC_ENV = os.getenv("DRADIC__ENV", "DEV")

allowed_origins = [
    "https://expense-tracker-kappa-livid.vercel.app",
    "https://dradic-technologies.vercel.app",
    "https://blog-cms-livid.vercel.app",
    "https://dradic-technologies-blog.vercel.app",
]

if DRADIC_ENV == "LOCAL":
    allowed_origins.extend(
        [
            "http://localhost:3000",
        ]
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
)

# Security scheme
security = HTTPBearer()

# Paths that don't require authentication
EXCLUDED_PATHS = {
    "/",
    "/health",
    "/docs",
    "/redoc",
    "/openapi.json",
}

# Paths that allow optional authentication (like public blog posts)
OPTIONAL_AUTH_PATHS = {
    "/api/blog/posts",
    "/api/blog/posts-metadata",
}


async def get_current_user_global(request: Request) -> Optional[dict]:
    """Global authentication dependency that checks all requests"""
    path = request.url.path

    # Skip authentication for excluded paths
    if path in EXCLUDED_PATHS:
        return None

    # Skip authentication for OPTIONS requests (CORS preflight)
    if request.method == "OPTIONS":
        return None

    # Skip auth for specific blog post paths (if they're individual posts)
    if path.startswith("/api/blog/posts/") and request.method == "GET":
        return None

    # Get authorization header
    authorization = request.headers.get("Authorization")

    # For optional auth paths, don't require auth but try to get user if present
    if path in OPTIONAL_AUTH_PATHS and request.method == "GET":
        if not authorization:
            return None
        try:
            token = authorization.replace("Bearer ", "")
            user_info = await get_credentials_from_token(token)
            return user_info
        except Exception as e:
            logger.warning(f"Optional auth failed for {path}: {e}")
            return None

    # For all other API paths, require authentication
    if path.startswith("/api/"):
        if not authorization:
            raise HTTPException(status_code=401, detail="Authentication required")

        try:
            token = authorization.replace("Bearer ", "")
            user_info = await get_credentials_from_token(token)
            if not user_info:
                raise HTTPException(status_code=401, detail="Invalid or expired token")
            return user_info
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Authentication error for {path}: {e}")
            raise HTTPException(status_code=401, detail="Authentication failed")

    return None


# Add authentication middleware
@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    """Middleware to handle authentication globally"""
    try:
        # Get current user (this will raise HTTPException if auth fails)
        user = await get_current_user_global(request)

        # Store user info in request state for use in endpoints
        request.state.current_user = user

        response = await call_next(request)
        return response
    except HTTPException as http_exc:
        return JSONResponse(
            status_code=http_exc.status_code, content={"detail": http_exc.detail}
        )
    except Exception as exc:
        logger.error(f"Middleware error: {exc}")
        return JSONResponse(
            status_code=500, content={"detail": "Internal server error"}
        )


# Add error handling middleware
@app.middleware("http")
async def errors_handling(request: Any, call_next):
    try:
        return await call_next(request)
    except Exception as exc:
        logger.error(f"Unhandled error: {exc}")
        return JSONResponse(
            status_code=500,
            content={"detail": str(exc)},
        )


# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to Dradic Technologies Unified API"}


# Favicon endpoint to prevent 404 errors
@app.get("/favicon.ico")
async def favicon():
    """Return an empty response for favicon requests to prevent 404 errors"""
    return Response(status_code=204)


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
