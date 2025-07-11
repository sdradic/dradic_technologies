# Dradic Technologies Unified API

This is the unified API backend for all Dradic Technologies projects, including:

- Blog CMS
- Expense Tracker
- Dradic Tech Website
- And more...

## 🚀 Features

- **Authentication**: JWT-based authentication system
- **Modular Design**: Organized by feature with FastAPI routers
- **CORS**: Pre-configured for local development
- **Documentation**: Automatic API documentation with Swagger UI and ReDoc
- **Database Integration**: Supabase PostgreSQL integration
- **Real-time Updates**: WebSocket support for real-time features

## 📦 Installation

This project is part of the Dradic Technologies monorepo. To get started:

### From the root directory:

```bash
pnpm backend:install
pnpm backend:dev
```

### Manual Setup

1. **Navigate to the backend directory:**

   ```bash
   cd unified_backend/apis
   ```

2. **Install dependencies with uv:**

   ```bash
   uv sync
   ```

3. **Create a `.env` file with your configuration:**

   ```env
   # Database
   DATABASE_URL=your-supabase-database-url

   # Authentication
   JWT_SECRET=your-jwt-secret-key
   JWT_ALGORITHM=HS256
   JWT_EXPIRES_IN=30d

   # Supabase
   SUPABASE_URL=your-supabase-project-url
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

   # Server
   PORT=8000
   DEBUG=true
   ```

4. **Run the development server:**
   ```bash
   python -m uvicorn main:app --reload
   ```

## API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Project Structure

```
backend/
├── apis/
│   ├── __init__.py
│   ├── server.py           # Main FastAPI application
│   └── routers/           # API route modules
│       ├── __init__.py
│       ├── auth.py        # Authentication routes
│       ├── blog.py        # Blog CMS routes
│       ├── portfolio.py   # Portfolio routes
│       └── expense_tracker/
│           ├── expenses.py
│           ├── expenses_items.py
│           ├── groups.py
│           └── users.py
├── requirements.txt       # Project dependencies
└── README.md             # This file
```

## Authentication

### Register a new user

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "user@example.com",
  "email": "user@example.com",
  "full_name": "John Doe",
  "password": "securepassword"
}
```

### Get access token

```http
POST /api/auth/token
Content-Type: application/x-www-form-urlencoded

grant_type=password&username=user@example.com&password=securepassword
```

### Access protected routes

```http
GET /api/me
Authorization: Bearer your-jwt-token
```

## Environment Variables

| Variable                      | Description                         | Default                  |
| ----------------------------- | ----------------------------------- | ------------------------ |
| `SECRET_KEY`                  | Secret key for JWT token generation | `your-secret-key-here`   |
| `DATABASE_URL`                | Database connection URL             | `sqlite:///./sql_app.db` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time in minutes    | `30`                     |

## Development

### Running Tests

```bash
# Install test dependencies
pip install -r requirements-test.txt

# Run tests
pytest
```

### Code Style

This project uses `black` for code formatting and `flake8` for linting.

```bash
# Format code
black .

# Check code style
flake8
```

## Deployment

For production deployment, consider using:

- Gunicorn with Uvicorn workers for production
- Environment variables for configuration
- A proper database (PostgreSQL recommended)
- HTTPS with a valid certificate

## License

Proprietary - All rights reserved
