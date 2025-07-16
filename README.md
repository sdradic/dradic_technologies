# Dradic Technologies - Monorepo

A unified repository containing all Dradic Technologies projects and applications.

## 🏗️ Project Structure

```
dradic_technologies/
├── dradic_tech/           # Main company website, portfolio & blog CMS
├── expense_tracker/       # Personal expense tracking application
├── unified_backend/       # Shared backend APIs (FastAPI)
│   └── apis/             # FastAPI application
│   └── db_migrations/    # Database migrations
└── package.json          # Root workspace configuration
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0
- **Python** >= 3.12
- **uv** (Python package manager)

### Installation

1. **Install frontend dependencies**

   ```bash
   pnpm install
   ```

2. **Install backend dependencies**

   ```bash
   pnpm backend:install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

## 🛠️ Development

### Start Development Environment

Use the start script to launch the backend and select a frontend project:

```bash
pnpm start
```

This will:

1. Start the backend API on port 8000
2. Let you choose which frontend project to run on port 3000

### Manual Development

#### Start backend only

```bash
pnpm backend:dev
```

#### Start individual frontend projects

```bash
# Dradic Tech website & blog
cd dradic_tech && pnpm dev

# Expense Tracker
cd expense_tracker && pnpm dev
```

## 📦 Available Scripts

### Root Level Commands

```bash
pnpm start              # Start backend + select frontend
pnpm backend:dev        # Start backend server
pnpm backend:install    # Install backend dependencies
```

### Individual Project Commands

Each project has its own scripts:

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm typecheck` - TypeScript type checking

## 🏛️ Architecture

### Frontend Stack

- **React Router v7** - Full-stack React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Build tool and dev server
- **Supabase** - Authentication and additional services

### Backend Stack

- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **Alembic** - Database migration tool
- **Supabase** - Database and auth services

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

- Supabase credentials
- API endpoints
- JWT secrets

### Workspace Management

This monorepo uses pnpm workspaces for dependency management:

- Shared dependencies are hoisted to the root
- Each project can have its own specific dependencies
- Consistent versioning across all projects

## 📁 Project Details

### Dradic Tech (`dradic_tech/`)

Main company website, portfolio, and integrated blog content management system.

- **Features**:
  - Company website and project showcase
  - Contact forms and business information
  - **Blog CMS**: Markdown editor, post management, admin panel
  - **Blog Frontend**: Public blog with search and navigation
  - Authentication and user management

### Expense Tracker (`expense_tracker/`)

Personal finance management application for tracking expenses and income.

- **Features**: Expense/income tracking, categories, reports, authentication

### Unified Backend (`unified_backend/`)

Shared FastAPI backend serving all frontend applications.

- **Port**: 8000 (default)
- **Features**: REST APIs, authentication, database management

## 📄 License

This project is proprietary to Dradic Technologies.

---

**Built by Dradic Technologies**
