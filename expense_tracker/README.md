# Expense Tracker (Simplified)

A simplified personal finance management application showcasing UI components and design patterns. This version focuses on the visual presentation and user interface without the full expense tracking functionality.

## 🚀 Features

- **UI Components**: Beautiful, reusable components for financial applications
- **Responsive Design**: Works perfectly on desktop and mobile
- **Dark/Light Theme**: Toggle between themes for comfortable viewing
- **Authentication UI**: Login and user management interface
- **Component Library**: Cards, tables, charts, and form components

## 🛠️ Tech Stack

- **Frontend**: React Router v7, TypeScript, Tailwind CSS
- **Backend**: FastAPI (unified backend) - APIs available but not integrated
- **Database**: Supabase (PostgreSQL) - configured but not used in simplified version
- **Authentication**: Supabase Auth - UI only
- **Charts**: Custom chart components
- **Build Tool**: Vite
- **Package Manager**: pnpm

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

Create a `.env` file in the project root with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# API Configuration
VITE_API_BASE_URL=http://localhost:8000

# App Configuration
VITE_DEFAULT_CURRENCY=USD
```

## 📁 Project Structure

```
expense_tracker/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── CardCarrousel.tsx
│   │   ├── DatePicker.tsx
│   │   ├── Dropdown.tsx
│   │   ├── HeaderControls.tsx
│   │   ├── Icons.tsx
│   │   ├── Loader.tsx
│   │   ├── Navbar.tsx
│   │   ├── PageHeader.tsx
│   │   ├── SimpleCard.tsx
│   │   ├── SimpleDonutGraph.tsx
│   │   ├── SimpleModal.tsx
│   │   ├── SimpleTable.tsx
│   │   ├── SkeletonLoader.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── UserProfile.tsx
│   ├── contexts/            # React contexts
│   │   ├── AuthContext.tsx  # Authentication context
│   │   ├── ReloadContext.tsx # Reload state management
│   │   └── ThemeContext.tsx # Theme management
│   ├── modules/             # Core modules
│   │   ├── apis.ts          # API functions
│   │   ├── store.ts         # Global state
│   │   ├── supabase.ts      # Supabase client
│   │   ├── types.ts         # TypeScript types
│   │   └── utils.ts         # Utility functions
│   ├── routes/              # Application routes
│   │   ├── 404.tsx
│   │   ├── about.tsx
│   │   ├── dashboard.tsx
│   │   ├── expenses.tsx
│   │   ├── incomes.tsx
│   │   ├── login.tsx
│   │   ├── logout.tsx
│   │   └── settings.tsx
│   ├── app.css              # Global styles
│   ├── root.tsx             # Root component
│   └── routes.ts            # Route configuration
├── public/                  # Static assets
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🎨 Component Overview

### Core Components

- **SimpleCard**: Displays financial data in card format
- **SimpleTable**: Data table with sorting and actions
- **SimpleDonutGraph**: Chart component for data visualization
- **CardCarrousel**: Mobile-friendly card carousel
- **HeaderControls**: Page header with controls
- **ThemeToggle**: Dark/light theme switcher

### Layout Components

- **Navbar**: Mobile navigation
- **Sidebar**: Desktop navigation
- **PageHeader**: Page title and breadcrumbs
- **Loader**: Loading states
- **SkeletonLoader**: Content loading placeholders

## 🔐 Authentication

The application includes authentication UI components but operates in a simplified mode. Users can navigate through the interface without full backend integration.

## 🎯 Usage

This simplified version is perfect for:

- **UI/UX Development**: Building and testing component designs
- **Design System**: Establishing consistent design patterns
- **Prototyping**: Quick mockups and wireframes
- **Component Library**: Reusable components for other projects

## 🚧 Development Notes

- **No Data Persistence**: This version doesn't save or load real data
- **Static Content**: Pages show placeholder content
- **API Ready**: Backend APIs are available but not integrated
- **Component Focus**: Emphasis on UI components and user experience

## 📝 License

This project is part of Dradic Technologies and follows the same licensing terms.
