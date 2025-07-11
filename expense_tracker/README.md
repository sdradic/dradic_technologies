# Expense Tracker

A comprehensive personal finance management application for tracking expenses, income, and financial goals with beautiful visualizations and insights.

## 🚀 Features

- **Expense Tracking**: Log and categorize daily expenses
- **Income Management**: Track multiple income sources
- **Visual Analytics**: Beautiful charts and graphs for financial insights
- **Category Management**: Custom categories and groups
- **Monthly/Yearly Reports**: Comprehensive financial reporting
- **User Authentication**: Secure login and user management
- **Responsive Design**: Works perfectly on desktop and mobile
- **Dark/Light Theme**: Toggle between themes for comfortable viewing

## 🛠️ Tech Stack

- **Frontend**: React Router v7, TypeScript, Tailwind CSS
- **Backend**: FastAPI (unified backend)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
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
│   │   ├── AddIncomeModal.tsx
│   │   ├── CardCarrousel.tsx
│   │   ├── DatePicker.tsx
│   │   ├── Dropdown.tsx
│   │   ├── ExpenseModal.tsx
│   │   ├── HeaderControls.tsx
│   │   ├── IncomeModal.tsx
│   │   ├── Navbar.tsx
│   │   ├── PageHeader.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── Sidebar.tsx
│   │   ├── SimpleCard.tsx
│   │   ├── SimpleDonutGraph.tsx
│   │   ├── SimpleModal.tsx
│   │   ├── SimpleTable.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── UserProfile.tsx
│   │   └── ...
│   ├── contexts/           # React contexts
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── mocks/              # Mock data for development
│   │   └── mockData.ts
│   ├── modules/            # Utility modules
│   │   ├── apis.ts        # API client functions
│   │   ├── store.ts       # State management
│   │   ├── supabase.ts    # Supabase client
│   │   ├── types.ts       # TypeScript type definitions
│   │   └── utils.ts       # Utility functions
│   ├── pages/             # Page components
│   │   ├── GroupsPage.tsx
│   │   ├── MonthlyExpensesPage.tsx
│   │   ├── MonthlyIncomesPage.tsx
│   │   └── YearlyPage.tsx
│   ├── routes/            # Route components
│   │   ├── _layout.tsx
│   │   ├── dashboard.tsx
│   │   ├── expenses.tsx
│   │   ├── incomes.tsx
│   │   ├── login.tsx
│   │   ├── settings.tsx
│   │   └── ...
│   └── root.tsx           # Root component
├── public/                # Static assets
└── package.json
```

## 🎨 Key Components

### Dashboard

Comprehensive financial overview with:

- Monthly expense summary
- Income vs expense comparison
- Category breakdown charts
- Recent transactions list
- Quick action buttons

### Expense Management

Complete expense tracking system:

- Add/edit/delete expenses
- Category assignment
- Date and amount tracking
- Receipt image upload
- Bulk operations

### Income Tracking

Multiple income source management:

- Regular salary tracking
- Freelance income
- Investment returns
- Other income sources
- Income categorization

### Analytics & Reports

Rich financial insights:

- Monthly/yearly comparisons
- Category spending analysis
- Trend visualization
- Budget vs actual tracking
- Export functionality

### User Management

Secure user system:

- Registration and login
- Profile management
- Settings customization
- Theme preferences
- Data privacy controls

## 🚀 Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm typecheck    # Run TypeScript type checking
pnpm clean        # Clean build artifacts
```

## 🔗 API Integration

This project integrates with the unified backend API for:

- User authentication and management
- Expense CRUD operations
- Income tracking
- Category management
- Analytics data
- Report generation

## 🎯 Core Features

### Expense Tracking

- **Quick Add**: Fast expense entry with smart defaults
- **Categories**: Customizable expense categories
- **Groups**: Organize expenses into logical groups
- **Tags**: Add custom tags for better organization
- **Recurring**: Set up recurring expenses

### Income Management

- **Multiple Sources**: Track various income streams
- **Regular Income**: Salary and regular payments
- **Variable Income**: Freelance and project-based income
- **Investment Income**: Dividends and returns

### Analytics & Insights

- **Visual Charts**: Donut charts, bar graphs, line charts
- **Trend Analysis**: Spending patterns over time
- **Category Breakdown**: See where money goes
- **Budget Tracking**: Compare actual vs planned spending
- **Savings Goals**: Track progress toward financial goals

### User Experience

- **Responsive Design**: Works on all devices
- **Dark/Light Theme**: Comfortable viewing options
- **Fast Performance**: Optimized for speed
- **Offline Support**: Basic functionality without internet
- **Data Export**: Export data in various formats

## 🚀 Deployment

### Build for Production

```bash
pnpm build
```

The build output will be in the `build/` directory, ready for deployment.

### Recommended Hosting

- Vercel
- Netlify
- AWS S3 + CloudFront

### Environment Setup

For production deployment:

- Configure production API endpoints
- Set up proper authentication
- Enable analytics tracking
- Configure data backup

## 📊 Data Management

### Data Structure

- **Expenses**: Amount, category, date, description, tags
- **Income**: Amount, source, date, description
- **Categories**: Name, color, icon, budget limits
- **Users**: Profile, preferences, settings

### Data Security

- **Encryption**: Sensitive data encryption
- **Backup**: Regular data backups
- **Privacy**: User data protection
- **Compliance**: GDPR and privacy compliance

## 🤝 Contributing

1. Follow the monorepo development workflow
2. Ensure all tests pass
3. Follow the established code style
4. Update documentation as needed
5. Test data integrity and security

## 📄 License

This project is proprietary to Dradic Technologies.

---

**Built with ❤️ by Dradic Technologies**
