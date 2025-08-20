-- Complete Supabase Schema for dradic_tech Expense Tracker
-- This file contains the full database schema for deployment to Supabase

-- Create the schema
CREATE SCHEMA IF NOT EXISTS dradic_tech;

-- Create currency enum type
CREATE TYPE dradic_tech.currency AS ENUM ('USD', 'CLP', 'EUR');

-- Create user role enum type
CREATE TYPE dradic_tech.user_role AS ENUM ('admin', 'user');

-- Create groups table
CREATE TABLE dradic_tech.groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    description VARCHAR,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create users table
CREATE TABLE dradic_tech.users (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    role dradic_tech.user_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_groups junction table for many-to-many relationship
CREATE TABLE dradic_tech.user_groups (
    user_id VARCHAR NOT NULL REFERENCES dradic_tech.users(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES dradic_tech.groups(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, group_id)
);

-- Create expense_items table
CREATE TABLE dradic_tech.expense_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    category VARCHAR,
    is_fixed BOOLEAN NOT NULL DEFAULT FALSE,
    user_id VARCHAR NOT NULL REFERENCES dradic_tech.users(id)
);

-- Create expenses table
CREATE TABLE dradic_tech.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES dradic_tech.expense_items(id),
    date DATE NOT NULL,
    amount FLOAT NOT NULL,
    currency VARCHAR NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create income_sources table
CREATE TABLE dradic_tech.income_sources (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    category VARCHAR,
    is_recurring BOOLEAN NOT NULL DEFAULT TRUE,
    user_id VARCHAR NOT NULL REFERENCES dradic_tech.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create incomes table
CREATE TABLE dradic_tech.incomes (
    id VARCHAR PRIMARY KEY,
    source_id VARCHAR NOT NULL REFERENCES dradic_tech.income_sources(id) ON DELETE CASCADE,
    amount FLOAT NOT NULL,
    currency dradic_tech.currency NOT NULL,
    date DATE NOT NULL,
    description VARCHAR,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE UNIQUE INDEX ix_dradic_tech_users_email ON dradic_tech.users (email);
CREATE INDEX ix_dradic_tech_user_groups_user_id ON dradic_tech.user_groups (user_id);
CREATE INDEX ix_dradic_tech_user_groups_group_id ON dradic_tech.user_groups (group_id);
CREATE INDEX ix_dradic_tech_expenses_date ON dradic_tech.expenses (date);
CREATE INDEX ix_dradic_tech_expense_items_user_id ON dradic_tech.expense_items (user_id);
CREATE INDEX ix_dradic_tech_incomes_date ON dradic_tech.incomes (date);
CREATE INDEX ix_dradic_tech_income_sources_user_id ON dradic_tech.income_sources (user_id);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE dradic_tech.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE dradic_tech.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE dradic_tech.user_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE dradic_tech.expense_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE dradic_tech.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE dradic_tech.income_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE dradic_tech.incomes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for Supabase Auth integration
-- auth.uid() returns the authenticated user's ID from Supabase Auth

-- Groups policy - users can see groups they belong to
CREATE POLICY "Users can view groups they belong to" ON dradic_tech.groups
    FOR SELECT USING (
        id IN (
            SELECT group_id FROM dradic_tech.user_groups
            WHERE user_id = auth.uid()::text
        )
    );

-- Users policy - authenticated users can manage their own profile
CREATE POLICY "Users can view their own data" ON dradic_tech.users
    FOR SELECT USING (id = auth.uid()::text);

CREATE POLICY "Users can insert their own data" ON dradic_tech.users
    FOR INSERT WITH CHECK (id = auth.uid()::text);

CREATE POLICY "Users can update their own data" ON dradic_tech.users
    FOR UPDATE USING (id = auth.uid()::text);

-- User groups policy - users can view their own group memberships
CREATE POLICY "Users can view their own group memberships" ON dradic_tech.user_groups
    FOR SELECT USING (user_id = auth.uid()::text);

-- User groups policy - admins can manage all group memberships
CREATE POLICY "Admins can manage all group memberships" ON dradic_tech.user_groups
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM dradic_tech.users
            WHERE id = auth.uid()::text AND role = 'admin'
        )
    );

-- Expense items policy - users can manage their own expense items
CREATE POLICY "Users can manage their own expense items" ON dradic_tech.expense_items
    FOR ALL USING (user_id = auth.uid()::text);

-- Expenses policy - users can manage their own expenses
CREATE POLICY "Users can manage their own expenses" ON dradic_tech.expenses
    FOR ALL USING (
        item_id IN (
            SELECT id FROM dradic_tech.expense_items WHERE user_id = auth.uid()::text
        )
    );

-- Income sources policy - users can manage their own income sources
CREATE POLICY "Users can manage their own income sources" ON dradic_tech.income_sources
    FOR ALL USING (user_id = auth.uid()::text);

-- Incomes policy - users can manage their own incomes
CREATE POLICY "Users can manage their own incomes" ON dradic_tech.incomes
    FOR ALL USING (
        source_id IN (
            SELECT id FROM dradic_tech.income_sources WHERE user_id = auth.uid()::text
        )
    );

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION dradic_tech.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_income_sources_updated_at
    BEFORE UPDATE ON dradic_tech.income_sources
    FOR EACH ROW
    EXECUTE FUNCTION dradic_tech.update_updated_at_column();

CREATE TRIGGER update_incomes_updated_at
    BEFORE UPDATE ON dradic_tech.incomes
    FOR EACH ROW
    EXECUTE FUNCTION dradic_tech.update_updated_at_column();

-- Grant necessary permissions for authenticated users
GRANT USAGE ON SCHEMA dradic_tech TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA dradic_tech TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA dradic_tech TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA dradic_tech TO authenticated;
