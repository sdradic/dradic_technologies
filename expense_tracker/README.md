# Expense Tracker

A modern personal finance management application built with React Router v7 and TypeScript. Features comprehensive expense tracking, group management, income tracking, and beautiful data visualizations with full backend integration.

## 🚀 Features

### Personal Finance Management

- **Expense Tracking**: Create, edit, and categorize expenses with detailed information
- **Income Management**: Track multiple income sources and recurring payments
- **Group Collaboration**: Share expenses with family, friends, or roommates
- **Dashboard Analytics**: Visual insights into spending patterns and trends
- **Category Management**: Organize expenses with custom categories and expense items

### User Experience

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between themes for comfortable viewing
- **Real-time Updates**: Live data synchronization across devices
- **Intuitive Interface**: Clean, modern design with smooth interactions
- **Data Visualization**: Charts and graphs for financial insights

### Technical Features

- **Authentication**: Secure user registration and login with Supabase Auth
- **Multi-user Support**: User profiles and group-based expense sharing
- **Data Export**: Export financial data for external analysis
- **Offline Support**: Works with cached data when offline

## 🛠️ Tech Stack

### Frontend

- **React Router v7** - Modern routing with SSR support
- **TypeScript 5.7** - Type-safe development
- **Tailwind CSS v4** - Modern utility-first styling
- **React 19** - Latest React features and concurrent rendering
- **Chart.js 4.5** - Beautiful data visualization and charts
- **React Hot Toast** - Elegant notification system
- **Vite 5.4** - Fast build tool and dev server

### Backend & Services

- **Unified Backend API** - FastAPI-based backend with full integration
- **Supabase** - Database, authentication, and real-time subscriptions
- **PostgreSQL** - Relational database for financial data storage
- **Server-Side Rendering** - SEO-optimized page rendering

### Development Tools

- **ESLint & Prettier** - Code quality and formatting
- **Docker** - Containerized deployment
- **TypeScript** - Full type safety across the application

## 📦 Installation

This project is part of the Dradic Technologies monorepo. To get started:

1. **From the root directory:**

   ```bash
   pnpm install
   ```

2. **Start the development environment:**
   ```bash
   pnpm start
   ```
   Then select "Expense Tracker" from the menu.

## 🎯 Quick Start

### Manual Setup

1. **Navigate to the project:**

   ```bash
   cd expense_tracker
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Start development server:**

   ```bash
   pnpm dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Backend API Configuration
VITE_API_BASE_URL=http://localhost:8000
```

## 📁 Project Structure

```
expense_tracker/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── CardCarrousel.tsx      # Mobile-friendly card carousel
│   │   ├── CreateEditModal.tsx    # Modal for creating/editing items
│   │   ├── DatePicker.tsx         # Date selection component
│   │   ├── Dropdown.tsx           # Dropdown selection component
│   │   ├── EmptyState.tsx         # Empty state placeholder
│   │   ├── HeaderButton.tsx       # Header action buttons
│   │   ├── HeaderControls.tsx     # Page header controls
│   │   ├── HeaderDropdown.tsx     # Header dropdown menu
│   │   ├── Icons.tsx              # SVG icon components
│   │   ├── Loader.tsx             # Loading spinner
│   │   ├── Navbar.tsx             # Mobile navigation
│   │   ├── PageHeader.tsx         # Page header component
│   │   ├── Sidebar.tsx            # Desktop sidebar navigation
│   │   ├── SimpleCard.tsx         # Financial data cards
│   │   ├── SimpleForm.tsx         # Form components
│   │   ├── SimpleModal.tsx        # Modal dialog component
│   │   ├── SimpleTable.tsx        # Data table with actions
│   │   ├── ThemeToggle.tsx        # Dark/light theme switcher
│   │   └── UserProfile.tsx        # User profile component
│   ├── contexts/            # React contexts
│   │   ├── AuthContext.tsx        # Authentication context
│   │   └── ThemeContext.tsx       # Theme management
│   ├── hooks/               # Custom React hooks
│   │   ├── useExpenseItems.tsx    # Expense items data management
│   │   ├── useExpensesData.tsx    # Expenses data management
│   │   ├── useGroups.tsx          # Groups data management
│   │   ├── useIncomeSources.tsx   # Income sources management
│   │   └── useIncomesTableData.tsx # Income table data
│   ├── modules/             # Core modules
│   │   ├── apis.ts                # API functions and backend integration
│   │   ├── store.ts               # Global state management
│   │   ├── supabase.ts            # Supabase client configuration
│   │   ├── types.ts               # TypeScript type definitions
│   │   └── utils.ts               # Utility functions
│   ├── routes/              # Application routes
│   │   ├── 404.tsx                # Not found page
│   │   ├── contact.tsx            # Contact page
│   │   ├── dashboard.tsx          # Main dashboard
│   │   ├── expenses.tsx           # Expense management
│   │   ├── groups.tsx             # Group management
│   │   ├── incomes.tsx            # Income tracking
│   │   ├── login.tsx              # User login
│   │   ├── logout.tsx             # User logout
│   │   ├── settings.tsx           # User settings
│   │   └── signup.tsx             # User registration
│   ├── app.css              # Global styles
│   ├── root.tsx             # Root component
│   └── routes.ts            # Route configuration
├── public/                  # Static assets
│   └── favicon.ico
├── Dockerfile              # Container configuration
├── package.json            # Dependencies and scripts
├── react-router.config.ts  # React Router configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build configuration
```

## 🎨 Key Pages & Features

### Main Application Pages

- **Dashboard** (`/dashboard`) - Financial overview with charts and summaries
- **Expenses** (`/expenses`) - Comprehensive expense tracking and management
- **Incomes** (`/incomes`) - Income sources and earnings tracking
- **Groups** (`/groups`) - Shared expense groups and collaboration
- **Settings** (`/settings`) - User preferences and account management
- **Authentication** (`/login`, `/signup`) - Secure user authentication

### Component Architecture

#### Data Management Components

- **SimpleCard**: Financial data display cards with actions
- **SimpleTable**: Advanced data tables with sorting, filtering, and pagination
- **CreateEditModal**: Unified modal for creating and editing financial records
- **EmptyState**: User-friendly empty state placeholders

#### Navigation & Layout

- **Navbar**: Responsive mobile navigation with hamburger menu
- **Sidebar**: Desktop sidebar navigation with route highlighting
- **PageHeader**: Consistent page headers with breadcrumbs and actions
- **HeaderControls**: Dynamic header controls for different page contexts

#### Data Visualization

- **Chart.js Integration**: Beautiful charts for financial insights
- **CardCarrousel**: Mobile-optimized card carousel for quick data access
- **Dashboard Analytics**: Real-time financial metrics and trends

## 🔐 Authentication & Security

### User Management

- **Secure Registration**: New user signup with email verification
- **Protected Routes**: Authentication-required pages with automatic redirects
- **Session Management**: Persistent sessions with automatic token refresh
- **Multi-user Support**: Individual user accounts with isolated data

### Security Features

- **Supabase Auth**: Industry-standard authentication with JWT tokens
- **Data Isolation**: Users can only access their own financial data
- **Group Permissions**: Controlled access to shared expense groups
- **API Security**: All backend calls are authenticated and authorized

## 🔧 Available Scripts

```bash
# Development
pnpm dev              # Start development server on port 3000
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm format           # Format code with Prettier
pnpm format:check     # Check code formatting
pnpm typecheck        # Run TypeScript checks
pnpm type-check       # Alternative TypeScript check (no emit)

# Maintenance
pnpm clean            # Clean build artifacts
```

## 🎯 Usage & Features

### Personal Finance Tracking

- **Expense Management**: Add, edit, and categorize personal and shared expenses
- **Income Tracking**: Record multiple income sources with recurring schedules
- **Budget Planning**: Set spending limits and track progress
- **Financial Insights**: Visual analytics and spending pattern analysis

### Collaboration Features

- **Group Expenses**: Create groups for shared expenses (roommates, trips, etc.)
- **Expense Splitting**: Automatically split bills among group members
- **Settlement Tracking**: Keep track of who owes what to whom
- **Group Analytics**: Shared spending insights and summaries

### Data Management

- **Real-time Sync**: Changes sync instantly across all devices
- **Data Export**: Export financial data for tax preparation or analysis
- **Backup & Recovery**: Secure cloud-based data storage
- **Multi-device Support**: Access your data from any device

## 🐳 Docker Deployment

Build and run with Docker:

```bash
# Build the image
docker build -t expense-tracker .

# Run the container (maps to port 3000)
docker run -p 3000:3000 expense-tracker
```

## 🌐 Deployment Options

The application can be deployed to any platform supporting Node.js:

- **Vercel** - Recommended for React Router apps
- **Netlify** - Static site hosting with serverless functions
- **AWS ECS** - Container orchestration
- **Google Cloud Run** - Serverless containers
- **Railway** - Simple deployment platform

## 🎯 About This Application

This expense tracker demonstrates modern full-stack development practices with:

- **Modern React Patterns**: Hooks, contexts, and concurrent features
- **Type Safety**: Full TypeScript coverage for reliability
- **Performance**: Optimized data fetching and caching strategies
- **User Experience**: Intuitive interface with responsive design
- **Scalability**: Modular architecture supporting growth

Perfect for personal finance management, shared household expenses, or as a foundation for larger financial applications.

## 📝 License

This project is part of Dradic Technologies and follows the same licensing terms.
