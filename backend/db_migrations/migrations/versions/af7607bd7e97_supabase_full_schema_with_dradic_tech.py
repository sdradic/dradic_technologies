"""supabase_full_schema_with_dradic_tech

Revision ID: af7607bd7e97
Revises: 1f8eb3dfc59a
Create Date: 2025-07-02 20:06:49.142780

"""
from typing import Sequence, Union
import uuid

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'af7607bd7e97'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """
    Complete Supabase schema migration for dradic_tech expense tracker
    Includes all tables: groups, users, expense_items, expenses, income_sources, incomes
    """
    # Create the new schema
    op.execute("CREATE SCHEMA IF NOT EXISTS dradic_tech")
    
    # Create currency enum type in the new schema
    op.execute("""
        DO $$ 
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'currency' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'dradic_tech')) THEN
                CREATE TYPE dradic_tech.currency AS ENUM ('USD', 'CLP', 'EUR');
            END IF;
        END
        $$;
    """)
    
    # Create groups table
    op.create_table(
        'groups',
        sa.Column('id', sa.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column(
            'created_at', 
            sa.DateTime(timezone=True), 
            server_default=sa.func.now(), 
            nullable=False
        ),
        schema='dradic_tech'
    )
    
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column(
            'created_at', 
            sa.DateTime(timezone=True), 
            server_default=sa.func.now(), 
            nullable=False
        ),
        sa.Column(
            'group_id', 
            sa.UUID(as_uuid=True), 
            sa.ForeignKey('dradic_tech.groups.id'),
            nullable=True
        ),
        sa.UniqueConstraint('email'),
        schema='dradic_tech'
    )
    
    # Create expense_items table
    op.create_table(
        'expense_items',
        sa.Column('id', sa.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('category', sa.String(), nullable=True),
        sa.Column(
            'is_fixed', 
            sa.Boolean(), 
            nullable=False, 
            server_default=sa.text('false')
        ),
        sa.Column(
            'user_id', 
            sa.String(), 
            sa.ForeignKey('dradic_tech.users.id'),
            nullable=False
        ),
        schema='dradic_tech'
    )
    
    # Create expenses table
    op.create_table(
        'expenses',
        sa.Column('id', sa.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column(
            'item_id', 
            sa.UUID(as_uuid=True), 
            sa.ForeignKey('dradic_tech.expense_items.id'),
            nullable=False
        ),
        sa.Column('date', sa.Date(), nullable=False),
        sa.Column('amount', sa.Float(), nullable=False),
        sa.Column('currency', sa.String(), nullable=False),
        sa.Column(
            'created_at', 
            sa.DateTime(timezone=True), 
            server_default=sa.func.now(), 
            nullable=False
        ),
        schema='dradic_tech'
    )
    
    # Create income_sources table
    op.create_table(
        'income_sources',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('category', sa.String(), nullable=True),
        sa.Column(
            'is_recurring', 
            sa.Boolean(), 
            server_default=sa.text('true'), 
            nullable=False
        ),
        sa.Column(
            'user_id', 
            sa.String(), 
            sa.ForeignKey('dradic_tech.users.id', ondelete='CASCADE'),
            nullable=False
        ),
        sa.Column(
            'created_at', 
            sa.DateTime(timezone=True), 
            server_default=sa.func.now(), 
            nullable=False
        ),
        sa.Column(
            'updated_at', 
            sa.DateTime(timezone=True), 
            server_default=sa.func.now(), 
            nullable=False
        ),
        schema='dradic_tech'
    )
    
    # Create incomes table
    op.create_table(
        'incomes',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column(
            'source_id', 
            sa.String(), 
            sa.ForeignKey('dradic_tech.income_sources.id', ondelete='CASCADE'),
            nullable=False
        ),
        sa.Column('amount', sa.Float(), nullable=False),
        sa.Column(
            'currency', 
            sa.Enum('USD', 'CLP', 'EUR', name='currency_enum', schema='dradic_tech'),
            nullable=False
        ),
        sa.Column('date', sa.Date(), nullable=False),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column(
            'created_at', 
            sa.DateTime(timezone=True), 
            server_default=sa.func.now(), 
            nullable=False
        ),
        sa.Column(
            'updated_at', 
            sa.DateTime(timezone=True), 
            server_default=sa.func.now(), 
            nullable=False
        ),
        schema='dradic_tech'
    )
    
    # Create indexes for better performance
    op.create_index(
        'ix_dradic_tech_users_email', 
        'users', 
        ['email'], 
        unique=True, 
        schema='dradic_tech'
    )
    op.create_index(
        'ix_dradic_tech_expenses_date', 
        'expenses', 
        ['date'], 
        schema='dradic_tech'
    )
    op.create_index(
        'ix_dradic_tech_expense_items_user_id', 
        'expense_items', 
        ['user_id'], 
        schema='dradic_tech'
    )
    op.create_index(
        'ix_dradic_tech_incomes_date', 
        'incomes', 
        ['date'], 
        schema='dradic_tech'
    )
    op.create_index(
        'ix_dradic_tech_income_sources_user_id', 
        'income_sources', 
        ['user_id'], 
        schema='dradic_tech'
    )
    
    # Enable RLS (Row Level Security) for Supabase
    op.execute("ALTER TABLE dradic_tech.groups ENABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE dradic_tech.users ENABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE dradic_tech.expense_items ENABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE dradic_tech.expenses ENABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE dradic_tech.income_sources ENABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE dradic_tech.incomes ENABLE ROW LEVEL SECURITY")


def downgrade() -> None:
    """
    Drop all tables and schema
    """
    # Drop indexes first
    op.drop_index('ix_dradic_tech_income_sources_user_id', table_name='income_sources', schema='dradic_tech')
    op.drop_index('ix_dradic_tech_incomes_date', table_name='incomes', schema='dradic_tech')
    op.drop_index('ix_dradic_tech_expense_items_user_id', table_name='expense_items', schema='dradic_tech')
    op.drop_index('ix_dradic_tech_expenses_date', table_name='expenses', schema='dradic_tech')
    op.drop_index('ix_dradic_tech_users_email', table_name='users', schema='dradic_tech')
    
    # Drop tables in reverse order (respecting foreign key constraints)
    op.drop_table('incomes', schema='dradic_tech')
    op.drop_table('income_sources', schema='dradic_tech')
    op.drop_table('expenses', schema='dradic_tech')
    op.drop_table('expense_items', schema='dradic_tech')
    op.drop_table('users', schema='dradic_tech')
    op.drop_table('groups', schema='dradic_tech')
    
    # Drop the currency enum type
    op.execute("DROP TYPE IF EXISTS dradic_tech.currency")
    
    # Drop the schema
    op.execute("DROP SCHEMA IF EXISTS dradic_tech CASCADE")
