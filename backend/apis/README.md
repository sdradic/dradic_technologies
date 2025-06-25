# Dradic Technologies Unified API

This is the unified API backend for all Dradic Technologies projects, including:
- Blog CMS
- Expense Tracker
- Portfolio
- And more...

## Features

- **Authentication**: JWT-based authentication system
- **Modular Design**: Organized by feature with FastAPI routers
- **CORS**: Pre-configured for local development
- **Documentation**: Automatic API documentation with Swagger UI and ReDoc

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the `backend` directory with your configuration:
   ```
   SECRET_KEY=your-secret-key-here
   DATABASE_URL=sqlite:///./sql_app.db
   ```

4. Run the development server:
   ```bash
   uvicorn apis.server:app --reload
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

| Variable | Description | Default |
|----------|-------------|---------|
| `SECRET_KEY` | Secret key for JWT token generation | `your-secret-key-here` |
| `DATABASE_URL` | Database connection URL | `sqlite:///./sql_app.db` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time in minutes | `30` |

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
