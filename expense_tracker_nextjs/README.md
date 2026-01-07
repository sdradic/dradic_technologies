# Expense Tracker (Next.js)

A modern expense and income tracking application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🔐 **Authentication**: Secure login with Supabase Auth
- 📊 **Dashboard**: Visual overview with charts and statistics
- 💸 **Expense Management**: Track expenses with categories and items
- 💰 **Income Management**: Track income sources and amounts
- 🌓 **Dark Mode**: Toggle between light and dark themes
- 📱 **Responsive**: Mobile-friendly design

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Charts**: Chart.js with react-chartjs-2
- **Notifications**: react-hot-toast
- **Backend**: Unified backend API (FastAPI)

## Project Structure

```
expense_tracker_nextjs/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard page
│   ├── expenses/          # Expenses management page
│   ├── incomes/           # Incomes management page
│   ├── login/             # Login page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Root page (redirects)
│   ├── providers.tsx      # Context providers
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── AuthGuard.tsx     # Protected route wrapper
│   ├── Loader.tsx        # Loading spinner
│   ├── Navbar.tsx        # Mobile navigation
│   ├── Sidebar.tsx       # Desktop navigation
│   └── ThemeToggle.tsx   # Theme switcher
├── contexts/              # React contexts
│   ├── AuthContext.tsx   # Authentication state
│   └── ThemeContext.tsx  # Theme state
├── lib/                   # Utilities and APIs
│   ├── apis.ts           # API client
│   ├── supabase.ts       # Supabase client
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Utility functions
└── [config files]
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account and project
- Unified backend API running

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Pages

### Dashboard (`/dashboard`)
- Monthly overview with cards showing total income, expenses, and remaining balance
- Donut chart displaying expenses by category (top 4)
- Table of recent expenses
- Month/year/currency selector

### Expenses (`/expenses`)
- List all expenses with filtering by currency
- Create/edit/delete expenses
- Create expense items (categories)
- Summary card showing total expenses

### Incomes (`/incomes`)
- List all incomes with filtering by currency
- Create/edit/delete incomes
- Create income sources
- Summary card showing total incomes
- Recurring income indicator

### Login (`/login`)
- Email/password authentication
- Redirects to dashboard on success

## API Integration

The app integrates with the unified backend API for all data operations:

- **Expenses**: `/api/expense-tracker/expenses/`
- **Expense Items**: `/api/expense-tracker/expense-items/`
- **Incomes**: `/api/expense-tracker/incomes/`
- **Income Sources**: `/api/expense-tracker/income-sources/`
- **Dashboard**: `/api/expense-tracker/expenses/dashboard/monthly/{year}/{month}`

## Authentication

Authentication is handled via Supabase Auth:
- Session management with automatic token refresh
- Protected routes with AuthGuard component
- User profile display in sidebar

## Key Differences from Old Implementation

1. **Framework**: Next.js App Router instead of React Router
2. **Simplified**: No Groups functionality (can be added later)
3. **Backend**: All data from unified backend APIs
4. **UI**: Cleaner, card-based design similar to gym_tracker
5. **Pages**: Only 4 pages (login, dashboard, expenses, incomes)

## Development

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## License

Private project for Dradic Technologies.
