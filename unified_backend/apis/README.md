# Dradic Technologies Unified API

A modern FastAPI-based backend serving multiple Dradic Technologies applications with comprehensive authentication, database management, and API documentation.

**Supported Applications:**

- **Dradic Tech Blog CMS**: Content management, blog posts, admin authentication
- **Expense Tracker**: Personal finance management, group expenses, income tracking
- **Portfolio API**: Project showcases and portfolio data
- **File Management**: Secure file uploads and downloads

## 🚀 Features

### Core Functionality

- **JWT Authentication**: Secure token-based authentication with Supabase integration
- **Modular Router Design**: Organized by application with dedicated FastAPI routers
- **Global Authentication Middleware**: Centralized auth handling with optional authentication for public endpoints
- **CORS Configuration**: Pre-configured for both local development and production deployments

### API Documentation

- **Automatic Documentation**: Interactive Swagger UI and ReDoc interfaces
- **OpenAPI Schema**: Complete API specification with request/response models
- **Tagged Endpoints**: Organized by application for easy navigation

### Database & Storage

- **Supabase Integration**: PostgreSQL database with real-time capabilities
- **File Management**: Secure file upload/download with cloud storage
- **Data Models**: SQLAlchemy models with Pydantic validation

### Development Features

- **Hot Reload**: Development server with automatic reload on code changes
- **Type Safety**: Full Python type hints with mypy checking
- **Code Quality**: Ruff linting and formatting with strict configuration
- **Environment Management**: Modern dependency management with uv

## 📦 Installation

This project is part of the Dradic Technologies monorepo.

### Prerequisites

- **Python** >= 3.12
- **uv** (modern Python package manager) - [Install from here](https://docs.astral.sh/uv/)

### Quick Start (Recommended)

**From the monorepo root:**

```bash
./run_local.sh
```

This interactive script will start the backend and let you choose a frontend.

### Manual Setup

1. **Navigate to the backend directory:**

   ```bash
   cd unified_backend/apis
   ```

2. **Install dependencies with uv:**

   ```bash
   uv sync
   ```

3. **Set up environment variables:**

   Configure your environment variables according to your setup. The application expects Supabase credentials and other configuration through environment variables.

4. **Run the development server:**
   ```bash
   uv run uvicorn main:app --reload --port 8000
   ```

### Alternative Development Command

```bash
# Start with uvicorn directly
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 🌐 API Documentation

Once the server is running, access the interactive documentation:

- **Swagger UI**: http://localhost:8000/docs - Interactive API testing interface
- **ReDoc**: http://localhost:8000/redoc - Beautiful API documentation
- **OpenAPI JSON**: http://localhost:8000/openapi.json - Machine-readable API specification
- **Health Check**: http://localhost:8000/health - Server health status

## 📁 Project Structure

```
unified_backend/apis/
├── main.py                    # FastAPI application with middleware and routing
├── models.py                  # SQLAlchemy database models
├── pyproject.toml            # Dependencies and project configuration
├── uv.lock                   # Locked dependency versions
├── Dockerfile                # Container configuration
├── routers/                  # API route modules organized by application
│   ├── blog.py              # Blog CMS endpoints (posts, admin, auth)
│   ├── portfolio.py         # Portfolio and project showcase endpoints
│   └── expense_tracker/     # Expense tracker application endpoints
│       ├── __init__.py
│       ├── expense_items.py # Expense categories and items
│       ├── expenses.py      # Individual expense management
│       ├── groups.py        # Shared expense groups
│       ├── income_sources.py # Income source management
│       ├── incomes.py       # Income tracking
│       └── users.py         # User profile management
├── utils/                   # Shared utilities and services
│   ├── auth.py             # Authentication helpers and JWT handling
│   ├── db.py               # Database connection and session management
│   └── supabase_service.py # Supabase integration service
├── tests/                   # Test suite
├── infra/                   # Infrastructure as Code (Terraform)
└── README.md               # This file
```

## 🔐 API Endpoints

### Authentication & Authorization

The API uses **JWT tokens** with **Supabase Auth** integration. Authentication is handled globally through middleware with the following patterns:

- **Public Endpoints**: No authentication required (health, docs, public blog posts)
- **Optional Auth**: Public access allowed, enhanced features with authentication
- **Protected Endpoints**: Authentication required for all access

### Blog CMS API (`/api/blog/`)

```bash
# Public blog posts (with optional authentication for admin features)
GET    /api/blog/posts-separated           # Get all blog posts with content
GET    /api/blog/posts-separated/{slug}    # Get specific blog post
GET    /api/blog/posts-metadata            # Get blog post metadata only

# Admin endpoints (authentication required)
POST   /api/blog/posts                     # Create new blog post
PUT    /api/blog/posts/{slug}              # Update existing blog post
DELETE /api/blog/posts/{slug}              # Delete blog post
POST   /api/blog/auth/verify               # Verify admin authentication
```

### Expense Tracker API (`/api/expense-tracker/`)

All expense tracker endpoints require authentication.

```bash
# Groups
GET    /api/expense-tracker/groups         # Get user's groups
POST   /api/expense-tracker/groups         # Create new group
PUT    /api/expense-tracker/groups/{id}    # Update group
DELETE /api/expense-tracker/groups/{id}    # Delete group

# Expenses
GET    /api/expense-tracker/expenses       # Get user's expenses
POST   /api/expense-tracker/expenses       # Create new expense
PUT    /api/expense-tracker/expenses/{id}  # Update expense
DELETE /api/expense-tracker/expenses/{id}  # Delete expense

# Income Tracking
GET    /api/expense-tracker/incomes        # Get user's incomes
POST   /api/expense-tracker/incomes        # Create new income
GET    /api/expense-tracker/income-sources # Get income sources

# Expense Items (Categories)
GET    /api/expense-tracker/expense-items  # Get expense categories
POST   /api/expense-tracker/expense-items  # Create expense category

# User Management
GET    /api/expense-tracker/users/me       # Get current user profile
PUT    /api/expense-tracker/users/me       # Update user profile
```

### File Management

```bash
GET    /api/files?filename={name}          # Download file from storage
```

## 🔧 Environment Configuration

The application uses environment variables for configuration. Key variables include:

### Supabase Configuration

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for backend operations

### Server Configuration

- `DRADIC__ENV` - Environment setting (`LOCAL`, `DEV`, `PROD`)
- `PORT` - Server port (default: 8000)

### CORS Settings

The application is pre-configured with CORS for:

- **Production**: Vercel deployment URLs
- **Local Development**: `http://localhost:3000` (when `DRADIC__ENV=LOCAL`)

## 🛠️ Development

### Available Commands

```bash
# Start development server with hot reload
uv run uvicorn main:app --reload --port 8000

# Install/update dependencies
uv sync

# Type checking
uv run mypy main.py models.py utils/ routers/

# Code formatting and linting
uv run ruff check .
uv run ruff format .
```

### Development Tools

This project uses modern Python development tools:

- **uv**: Fast Python package management and virtual environments
- **Ruff**: Extremely fast Python linter and formatter
- **MyPy**: Static type checking for Python
- **FastAPI**: Automatic API documentation and validation

## 🚀 Tech Stack

### Core Framework

- **FastAPI** - Modern, fast web framework with automatic API documentation
- **Uvicorn** - Lightning-fast ASGI server
- **Pydantic** - Data validation and serialization using Python type hints

### Database & Storage

- **Supabase** - PostgreSQL database with real-time capabilities
- **SQLAlchemy** - SQL toolkit and Object-Relational Mapping (ORM)
- **Cloud Storage** - File management with secure download endpoints

### Authentication

- **JWT Tokens** - Stateless authentication
- **Supabase Auth** - User management and authentication provider
- **Global Middleware** - Centralized authentication handling

### Development

- **Python 3.12+** - Latest Python features and performance improvements
- **Type Hints** - Full type safety with mypy validation
- **Modern Tooling** - uv for package management, ruff for linting

## 🐳 Deployment

### Docker Support

The project includes a Dockerfile for containerized deployment:

```bash
# Build the image
docker build -t dradic-api .

# Run the container
docker run -p 8000:8000 dradic-api
```

### Deploy command

`sh run_build_and_deploy.sh $(date +"%s") DEV`

### Production Considerations

- **ASGI Server**: Uvicorn with multiple workers for production
- **Environment Variables**: Secure configuration management
- **Database**: PostgreSQL via Supabase for production reliability
- **CORS**: Pre-configured for Vercel and custom domains
- **Monitoring**: Built-in health check endpoint at `/health`

## 📝 License

This project is proprietary to Dradic Technologies.

---

**Built with FastAPI** - High performance, easy to learn, fast to code, ready for production
