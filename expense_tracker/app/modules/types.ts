export interface Group {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface GroupCreate {
  name: string;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  group_id?: string;
  created_at: string;
}

export interface UserCreate {
  id: string;
  name: string;
  email: string;
  group_id?: string;
}

export interface UserWithGroup extends User {
  group_name?: string;
  group_description?: string;
}

export interface ExpenseItem {
  id: string;
  name: string;
  category?: string;
  is_fixed: boolean;
  user_id: string;
}

export interface ExpenseItemCreate {
  name: string;
  category?: string;
  is_fixed: boolean;
  user_id: string;
}

export interface ExpenseItemWithUser extends ExpenseItem {
  user_name: string;
  user_email: string;
}

export interface Expense {
  id: string;
  item_id: string;
  date: string;
  amount: number;
  currency: string;
  created_at: string;
}

export interface ExpenseCreate {
  item_id: string;
  date: string;
  amount: number;
  currency: string;
}

export interface ExpenseWithDetails extends Expense {
  item_name: string;
  item_category?: string;
  item_is_fixed: boolean;
  user_name: string;
  user_email: string;
  group_name?: string;
}

export interface ExpenseSummary {
  total_amount: number;
  currency: string;
  count: number;
}

export interface CategorySummary {
  category?: string;
  total_amount: number;
  count: number;
}

export interface ExpenseItemResponse {
  items: ExpenseItemWithUser[];
  total_count: number;
}

export interface ExpenseResponse {
  expenses: ExpenseWithDetails[];
  total_count: number;
  summary: ExpenseSummary;
}

// Income Source Types
export interface IncomeSource {
  id: string;
  name: string;
  category?: string;
  is_recurring: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface IncomeSourceCreate {
  name: string;
  category?: string;
  is_recurring?: boolean;
  user_id: string;
}

export interface IncomeSourceWithUser extends IncomeSource {
  user_name: string;
  user_email: string;
}

// Income Types
export interface Income {
  id: string;
  source_id: string;
  amount: number;
  currency: string;
  date: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface IncomeCreate {
  source_id: string;
  amount: number;
  currency: string;
  date: string;
  description?: string;
}

export interface IncomeWithDetails extends Income {
  source_name: string;
  source_category?: string;
  source_is_recurring: boolean;
  user_name: string;
  user_email: string;
  group_name?: string;
}

export interface IncomeSummary {
  total_amount: number;
  currency: string;
  count: number;
}

export interface IncomeSourceResponse {
  sources: IncomeSourceWithUser[];
  total_count: number;
}

export interface IncomeResponse {
  incomes: IncomeWithDetails[];
  total_count: number;
  summary: IncomeSummary;
}

// Dashboard Types for unified API
export interface DashboardCard {
  title: string;
  description: string;
  value: number;
  currency: string;
  previous_value: number;
}

export interface DashboardDonutData {
  label: string;
  value: number;
}

export interface DashboardDonutGraph {
  title: string;
  description: string;
  data: DashboardDonutData[];
}

export interface DashboardTableRow {
  id: string;
  name: string;
  category: string;
  amount: string;
  date: string;
  description: string;
}

export interface DashboardTable {
  title: string;
  description: string;
  columns: string[];
  data: DashboardTableRow[] | DashboardTableRowWithRecurring[];
}

export interface DashboardData {
  year: number;
  month: number;
  currency: string;
  cards: DashboardCard[];
  donut_graph: DashboardDonutGraph;
  table: DashboardTable;
  total_expenses: number;
  total_income: number;
  total_savings: number;
}

export interface DashboardDataWithExpenses extends DashboardData {
  expenses: ExpenseWithDetails[];
}

export interface DashboardTableRowWithRecurring extends DashboardTableRow {
  recurring: boolean;
}
