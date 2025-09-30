# Dradic Technologies - Monorepo

A unified repository containing all Dradic Technologies projects and applications. Features modern web applications built with React Router v7, TypeScript, and a unified FastAPI backend.

## 🏗️ Project Structure

```
dradic_technologies/
├── dradic_tech/           # Company website, portfolio & blog CMS
├── expense_tracker/       # Personal finance management application
├── unified_backend/       # Shared FastAPI backend serving both frontends
│   ├── apis/             # FastAPI application with routers
│   └── db_migrations/    # Database migrations with Alembic
├── infra/                # Infrastructure as Code (Terraform)
├── run_local.sh          # Development startup script
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (Package manager for frontend projects)
- **Python** >= 3.12
- **uv** (Modern Python package manager - install from https://docs.astral.sh/uv/)

### Installation

1. **Install frontend dependencies for each project**

   ```bash
   # Install dependencies for Dradic Tech
   cd dradic_tech && pnpm install

   # Install dependencies for Expense Tracker
   cd ../expense_tracker && pnpm install
   cd ..
   ```

2. **Install backend dependencies**

   ```bash
   cd unified_backend/apis
   uv sync
   cd ../..
   ```

3. **Set up environment variables**

   Each project requires its own environment configuration:

   ```bash
   # Create environment files for each frontend project
   # See individual project READMEs for specific variables needed
   ```

## 🛠️ Development

### Start Development Environment (Recommended)

Use the development script to launch the backend and select a frontend project:

```bash
./run_local.sh
```

This interactive script will:

1. Check port availability (8000 for backend, 3000 for frontend)
2. Start the FastAPI backend server on port 8000
3. Let you choose which frontend project to run on port 3000:
   - Dradic Tech (website & blog)
   - Expense Tracker (finance app)

### Manual Development

#### Start backend only

```bash
cd unified_backend/apis
uv run uvicorn main:app --reload --port 8000
```

#### Start individual frontend projects

```bash
# Dradic Tech website & blog CMS
cd dradic_tech && pnpm dev

# Expense Tracker application
cd expense_tracker && pnpm dev
```

Both frontend projects run on port 3000, so run them separately.

## 📦 Available Scripts

### Root Level Commands

```bash
./run_local.sh          # Interactive development script (recommended)
```

### Backend Commands

```bash
cd unified_backend/apis
uv run uvicorn main:app --reload --port 8000  # Start development server
uv sync                                       # Install/update dependencies
```

### Frontend Project Commands

Each frontend project (`dradic_tech/` and `expense_tracker/`) has:

```bash
pnpm dev              # Start development server on port 3000
pnpm build            # Build for production
pnpm start            # Start production server
pnpm typecheck        # TypeScript type checking
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm format           # Format code with Prettier
pnpm clean            # Clean build artifacts
```

## 🏛️ Architecture

### Frontend Stack

- **React Router v7** - Modern full-stack React framework with SSR
- **TypeScript** - Full type safety across all applications
- **Tailwind CSS v4** - Modern utility-first CSS framework
- **Vite** - Fast build tool and development server
- **React 19** - Latest React features and concurrent rendering
- **Supabase** - Authentication, database, and real-time features

### Backend Stack

- **FastAPI** - Modern, fast Python web framework with automatic API docs
- **SQLAlchemy** - Powerful SQL toolkit and ORM
- **Alembic** - Database migration management
- **PostgreSQL** - Robust relational database (via Supabase)
- **Pydantic** - Data validation and serialization
- **uvicorn** - ASGI server for production-ready performance

### Infrastructure

- **Docker** - Containerization for consistent deployments
- **Terraform** - Infrastructure as Code for cloud resources
- **Supabase** - Backend-as-a-Service for database and auth

## 🔧 Configuration

### Environment Variables

Each project requires its own environment configuration:

**Frontend Projects** (`dradic_tech/` and `expense_tracker/`):
Create `.env.local` files with:

- Supabase credentials (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- Backend API URL (`VITE_API_BASE_URL=http://localhost:8000`)

**Backend** (`unified_backend/apis/`):
Environment variables for database connections and authentication.

See individual project READMEs for complete environment variable documentation.

### Project Structure

This monorepo uses a simple structure without workspace management:

- Each frontend project manages its own dependencies independently
- Shared backend serves both frontend applications
- Consistent technology stack across all projects
- Individual Docker containers for deployment

## 📁 Project Details

### Dradic Tech (`dradic_tech/`)

**Company website, portfolio, and advanced blog content management system.**

**Key Features:**

- **Professional Portfolio**: Company showcase with project highlights and experience
- **Contact System**: Integrated contact forms for business inquiries
- **Blog CMS**: Full-featured content management with MDX editor and live preview
- **Blog Frontend**: Public blog with search, navigation, and performance optimizations
- **Performance Optimized**: Intelligent caching and optimized API calls
- **Authentication**: Secure admin access with Supabase Auth

**Tech Stack**: React Router v7, TypeScript, Tailwind CSS v4, MDXEditor, React 19

### Expense Tracker (`expense_tracker/`)

**Comprehensive personal finance management application with group collaboration.**

**Key Features:**

- **Expense Management**: Create, categorize, and track personal and shared expenses
- **Income Tracking**: Multiple income sources with recurring payment support
- **Group Collaboration**: Share expenses with family, friends, or roommates
- **Dashboard Analytics**: Visual insights with Chart.js data visualization
- **Multi-user Support**: Individual accounts with secure data isolation
- **Real-time Sync**: Live data synchronization across all devices

**Tech Stack**: React Router v7, TypeScript, Tailwind CSS v4, Chart.js, React Hot Toast

### Unified Backend (`unified_backend/`)

**Shared FastAPI backend serving both frontend applications with full API integration.**

**Key Features:**

- **REST APIs**: Complete API coverage for both blog and expense tracking
- **Authentication**: JWT-based authentication with Supabase integration
- **Database Management**: PostgreSQL with SQLAlchemy ORM and Alembic migrations
- **Auto Documentation**: Interactive API docs with FastAPI's automatic OpenAPI generation
- **Multi-tenant**: Supports both Dradic Tech blog and Expense Tracker data models

**Architecture**: FastAPI, SQLAlchemy, PostgreSQL, Pydantic, uvicorn

### Infrastructure (`infra/`)

**Terraform configurations for cloud infrastructure deployment.**

- **Infrastructure as Code**: Terraform modules for AWS/cloud deployment
- **Container Orchestration**: ECS configuration for scalable deployments
- **Multi-Environment**: Separate dev and prod configurations
- **Modular Architecture**: Reusable Terraform modules for networking, ECS, ECR, IAM, and SSM

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd dradic_technologies
   ```

2. **Follow the installation steps above**
3. **Run the development environment**

   ```bash
   ./run_local.sh
   ```

4. **Access the applications**
   - **Backend API**: http://localhost:8000 (with automatic docs at /docs)
   - **Frontend**: http://localhost:3000 (selected project)

## 🎯 About Dradic Technologies

Dradic Technologies specializes in modern web development and cloud solutions:

- **Cloud-Native Architectures**: AWS, containerization, and scalable deployments
- **Modern Web Applications**: React, TypeScript, and performance-optimized frontends
- **DevOps & Infrastructure**: CI/CD pipelines, Infrastructure as Code, and automation
- **Full-Stack Development**: End-to-end application development with unified backends

This monorepo demonstrates these capabilities through real-world applications with production-ready architecture, performance optimizations, and modern development practices.

## 📄 License

This project is proprietary to Dradic Technologies.

---

**Built by Dradic Technologies** - Modern web solutions and cloud architecture
