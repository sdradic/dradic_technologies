# 💾 Expense Tracker – Database Setup & Migrations

This backend uses **SQLAlchemy** and **Alembic** to manage database migrations for a normalized, group-aware expense tracking app.

## 🚀 Quickstart

### 1. Set your environment variable

Make sure you have the database URL ready in your environment:

```bash
export NEON_EXPENSE_DB_URL=postgresql+asyncpg://user:password@host/dbname
```

### 2. Run migrations

Navigate to the migrations directory:

```bash
cd backend/db_migrations
```

Run Alembic commands:

```bash
# Apply all migrations
alembic upgrade head

# Revert the most recent migration
alembic downgrade -1

# Create a new migration after changes
alembic revision --autogenerate -m "Add new table or column"
```

## 🧱 Database Schema

This setup is designed for real-world flexibility, collaboration, and future expansion.

### `groups`

- `id` (UUID, PK)
- `name` (String, required)
- `description` (String)
- `created_at` (timestamp, default `now()`)

> A group represents a unit like a family, company, or project team.

### `users`

- `id` (String, PK)
- `name` (String, required)
- `email` (String, unique, required)
- `group_id` (FK → groups.id)
- `created_at` (timestamp, default `now()`)

> Each user belongs to one group. You can expand to multi-group support later if needed.

### `expense_items`

- `id` (UUID, PK)
- `name` (String, required)
- `category` (String)
- `is_fixed` (Boolean, default `false`)
- `user_id` (FK → users.id, required)

> Think of this as a recurring bill or spend category — rent, Netflix, Credit Card, etc.

### `expenses`

- `id` (UUID, PK)
- `item_id` (FK → expense_items.id)
- `date` (Date, required)
- `amount` (Float, required)
- `currency` (String, required)
- `created_at` (timestamp, default `now()`)

> Each record is an actual spend, typically monthly.

## 📊 Usage Notes

- Monthly/annual summaries? Just filter `expenses` by `date`.
- Currency validation can be enforced via enum or application logic.
- Want to add shared group expenses, splits, or budgets? This schema is ready to extend.

## 🔮 Next Steps

- [ ] Write ETL script to import data from `2025_new.xlsx`
- [ ] Add API endpoints (FastAPI recommended)
- [ ] Create admin interface (or CSV uploader)
- [ ] Add analytics (e.g., total by category, month)
