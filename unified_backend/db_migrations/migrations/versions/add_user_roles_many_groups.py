"""add_user_roles_many_groups

Revision ID: add_user_roles_many_groups
Revises: af7607bd7e97
Create Date: 2025-01-27 10:00:00.000000

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "add_user_roles_many_groups"
down_revision: Union[str, None] = "af7607bd7e97"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """
    Add user roles and convert single group_id to many-to-many relationship
    """
    # Create user role enum type
    op.execute("""
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'dradic_tech')) THEN
                CREATE TYPE dradic_tech.user_role AS ENUM ('admin', 'user');
            END IF;
        END
        $$;
    """)

    # Add role column to users table with default value 'user'
    op.add_column(
        "users",
        sa.Column(
            "role",
            sa.Enum("admin", "user", name="user_role", schema="dradic_tech"),
            nullable=False,
            server_default="user",
        ),
        schema="dradic_tech",
    )

    # Create user_groups junction table
    op.create_table(
        "user_groups",
        sa.Column(
            "user_id",
            sa.String(),
            sa.ForeignKey("dradic_tech.users.id", ondelete="CASCADE"),
            primary_key=True,
        ),
        sa.Column(
            "group_id",
            sa.UUID(as_uuid=True),
            sa.ForeignKey("dradic_tech.groups.id", ondelete="CASCADE"),
            primary_key=True,
        ),
        schema="dradic_tech",
    )

    # Migrate existing group_id data to user_groups table
    op.execute("""
        INSERT INTO dradic_tech.user_groups (user_id, group_id)
        SELECT id, group_id FROM dradic_tech.users
        WHERE group_id IS NOT NULL
    """)

    # Drop the old group_id column from users table
    op.drop_column("users", "group_id", schema="dradic_tech")

    # Drop the old foreign key constraint (it will be dropped automatically when column is dropped)

    # Update RLS policies to work with the new many-to-many relationship
    # Drop old policy
    op.execute(
        'DROP POLICY IF EXISTS "Users can view groups they belong to" ON dradic_tech.groups'
    )

    # Create new policy for groups
    op.execute("""
        CREATE POLICY "Users can view groups they belong to" ON dradic_tech.groups
        FOR SELECT USING (
            id IN (
                SELECT group_id FROM dradic_tech.user_groups
                WHERE user_id = auth.uid()::text
            )
        )
    """)

    # Create policy for user_groups table
    op.execute("ALTER TABLE dradic_tech.user_groups ENABLE ROW LEVEL SECURITY")

    op.execute("""
        CREATE POLICY "Users can view their own group memberships" ON dradic_tech.user_groups
        FOR SELECT USING (user_id = auth.uid()::text)
    """)

    op.execute("""
        CREATE POLICY "Admins can manage all group memberships" ON dradic_tech.user_groups
        FOR ALL USING (
            EXISTS (
                SELECT 1 FROM dradic_tech.users
                WHERE id = auth.uid()::text AND role = 'admin'
            )
        )
    """)


def downgrade() -> None:
    """
    Revert changes: remove roles and restore single group_id
    """
    # Add back group_id column
    op.add_column(
        "users",
        sa.Column("group_id", sa.UUID(as_uuid=True), nullable=True),
        schema="dradic_tech",
    )

    # Migrate data back from user_groups to group_id (take first group if multiple)
    op.execute("""
        UPDATE dradic_tech.users
        SET group_id = (
            SELECT group_id FROM dradic_tech.user_groups
            WHERE user_id = dradic_tech.users.id
            LIMIT 1
        )
    """)

    # Add foreign key constraint back
    op.create_foreign_key(
        "fk_users_group_id_groups",
        "users",
        "groups",
        ["group_id"],
        ["id"],
        source_schema="dradic_tech",
        referent_schema="dradic_tech",
    )

    # Drop user_groups table
    op.drop_table("user_groups", schema="dradic_tech")

    # Remove role column
    op.drop_column("users", "role", schema="dradic_tech")

    # Drop user_role enum type
    op.execute("DROP TYPE IF EXISTS dradic_tech.user_role")

    # Restore old RLS policies
    op.execute(
        'DROP POLICY IF EXISTS "Users can view groups they belong to" ON dradic_tech.groups'
    )
    op.execute(
        'DROP POLICY IF EXISTS "Users can view their own group memberships" ON dradic_tech.user_groups'
    )
    op.execute(
        'DROP POLICY IF EXISTS "Admins can manage all group memberships" ON dradic_tech.user_groups'
    )

    op.execute("""
        CREATE POLICY "Users can view groups they belong to" ON dradic_tech.groups
        FOR SELECT USING (
            id IN (SELECT group_id FROM dradic_tech.users WHERE id = auth.uid()::text)
        )
    """)
