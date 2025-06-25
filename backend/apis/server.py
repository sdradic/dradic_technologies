import os
from datetime import datetime, timedelta
from typing import Optional

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from routers import auth, blog, portfolio
from routers.expense_tracker import (
    expenses,
    expenses_items,
    groups,
    users as expense_users,
)

# Load environment variables
load_dotenv()

# Security
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI(
    title="Dradic Technologies API",
    description="Unified API for all Dradic Technologies projects",
    version="1.0.0"
)

# CORS configuration
origins = [
    "http://localhost:3000",  # React default
    "http://localhost:8000",  # Common frontend ports
    "http://localhost:8080",
    "https://your-production-domain.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(blog.router, prefix="/api/blog", tags=["Blog"])
app.include_router(portfolio.router, prefix="/api/portfolio", tags=["Portfolio"])

# Expense Tracker routes
app.include_router(expenses.router, prefix="/api/expense-tracker/expenses", tags=["Expense Tracker - Expenses"])
app.include_router(expenses_items.router, prefix="/api/expense-tracker/expense-items", tags=["Expense Tracker - Expense Items"])
app.include_router(groups.router, prefix="/api/expense-tracker/groups", tags=["Expense Tracker - Groups"])
app.include_router(expense_users.router, prefix="/api/expense-tracker/users", tags=["Expense Tracker - Users"])

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to Dradic Technologies Unified API"}

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# Token and user models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class User(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = None

class UserInDB(User):
    hashed_password: str

# Authentication utilities
def verify_password(plain_password: str, hashed_password: str) -> bool:
    # In a real application, you would use a proper password hashing library
    # like passlib with bcrypt or argon2
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    # In a real application, use passlib with a proper hashing algorithm
    return pwd_context.hash(password)

def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)
    return None

def authenticate_user(db, username: str, password: str):
    user = get_user(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    # Here you would typically fetch the user from your database
    # For now, we'll return a mock user
    user = User(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

# Protected route example
@app.get("/api/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user