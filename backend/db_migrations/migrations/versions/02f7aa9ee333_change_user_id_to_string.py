"""change_user_id_to_string

Revision ID: 02f7aa9ee333
Revises: dfbacce5537a
Create Date: 2025-06-19 23:53:46.380162

"""

from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "02f7aa9ee333"
down_revision: Union[str, None] = "dfbacce5537a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Drop foreign key constraints first
    op.execute('ALTER TABLE tallyup.expenses DROP CONSTRAINT IF EXISTS expenses_item_id_fkey')
    op.execute('ALTER TABLE tallyup.expense_items DROP CONSTRAINT IF EXISTS expense_items_user_id_fkey')
    op.execute('ALTER TABLE tallyup.users DROP CONSTRAINT IF EXISTS users_group_id_fkey')

    # Change groups.id to String first since it's referenced by other tables
    op.execute('''
        ALTER TABLE tallyup.groups
        ALTER COLUMN id TYPE VARCHAR USING id::text
    ''')

    # Change users.id to String
    op.execute('''
        ALTER TABLE tallyup.users
        ALTER COLUMN id TYPE VARCHAR USING id::text
    ''')

    # Change expense_items.user_id to String
    op.execute('''
        ALTER TABLE tallyup.expense_items
        ALTER COLUMN user_id TYPE VARCHAR USING user_id::text
    ''')

    # Change users.group_id to String
    op.execute('''
        ALTER TABLE tallyup.users
        ALTER COLUMN group_id TYPE VARCHAR USING group_id::text
    ''')

    # Recreate foreign key constraints
    op.execute('''
        ALTER TABLE tallyup.expense_items
        ADD CONSTRAINT expense_items_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES tallyup.users (id)
    ''')

    op.execute('''
        ALTER TABLE tallyup.users
        ADD CONSTRAINT users_group_id_fkey
        FOREIGN KEY (group_id) REFERENCES tallyup.groups (id)
    ''')

    op.execute('''
        ALTER TABLE tallyup.expenses
        ADD CONSTRAINT expenses_item_id_fkey
        FOREIGN KEY (item_id) REFERENCES tallyup.expense_items (id)
    ''')


def downgrade():
    # Drop foreign key constraints first
    op.execute('ALTER TABLE tallyup.expenses DROP CONSTRAINT IF EXISTS expenses_item_id_fkey')
    op.execute('ALTER TABLE tallyup.expense_items DROP CONSTRAINT IF EXISTS expense_items_user_id_fkey')
    op.execute('ALTER TABLE tallyup.users DROP CONSTRAINT IF EXISTS users_group_id_fkey')

    # Revert expense_items.user_id to UUID
    op.execute('''
        ALTER TABLE tallyup.expense_items
        ALTER COLUMN user_id TYPE UUID USING user_id::uuid
    ''')

    # Revert users.group_id to UUID
    op.execute('''
        ALTER TABLE tallyup.users
        ALTER COLUMN group_id TYPE UUID USING group_id::uuid
    ''')

    # Revert users.id to UUID
    op.execute('''
        ALTER TABLE tallyup.users
        ALTER COLUMN id TYPE UUID USING id::uuid
    ''')

    # Revert groups.id to UUID (must be after users since it's referenced by users)
    op.execute('''
        ALTER TABLE tallyup.groups
        ALTER COLUMN id TYPE UUID USING id::uuid
    ''')

    # Recreate foreign key constraints
    op.execute('''
        ALTER TABLE tallyup.expense_items
        ADD CONSTRAINT expense_items_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES tallyup.users (id)
    ''')

    op.execute('''
        ALTER TABLE tallyup.users
        ADD CONSTRAINT users_group_id_fkey
        FOREIGN KEY (group_id) REFERENCES tallyup.groups (id)
    ''')

    op.execute('''
        ALTER TABLE tallyup.expenses
        ADD CONSTRAINT expenses_item_id_fkey
        FOREIGN KEY (item_id) REFERENCES tallyup.expense_items (id)
    ''')
