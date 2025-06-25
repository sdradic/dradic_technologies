"""create optimized expense tracker schema

Revision ID: dfbacce5537a
Revises: 4fa1f283c0bb
Create Date: 2025-06-11

"""

import uuid
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "dfbacce5537a"
down_revision: Union[str, None] = "4fa1f283c0bb"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Create schema first
    op.execute("CREATE SCHEMA IF NOT EXISTS tallyup")

    op.create_table(
        "groups",
        sa.Column("id", sa.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("name", sa.String, nullable=False),
        sa.Column("description", sa.String),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        schema="tallyup",
    )

    op.create_table(
        "users",
        sa.Column("id", sa.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("name", sa.String, nullable=False),
        sa.Column("email", sa.String, nullable=False, unique=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "group_id",
            sa.UUID(as_uuid=True),
            sa.ForeignKey("tallyup.groups.id"),
            nullable=True,
        ),
        schema="tallyup",
    )

    op.create_table(
        "expense_items",
        sa.Column("id", sa.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("name", sa.String, nullable=False),
        sa.Column("category", sa.String),
        sa.Column(
            "is_fixed", sa.Boolean, nullable=False, server_default=sa.text("false")
        ),
        sa.Column(
            "user_id",
            sa.UUID(as_uuid=True),
            sa.ForeignKey("tallyup.users.id"),
            nullable=False,
        ),
        schema="tallyup",
    )

    op.create_table(
        "expenses",
        sa.Column("id", sa.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column(
            "item_id",
            sa.UUID(as_uuid=True),
            sa.ForeignKey("tallyup.expense_items.id"),
            nullable=False,
        ),
        sa.Column("date", sa.Date, nullable=False),
        sa.Column("amount", sa.Float, nullable=False),
        sa.Column("currency", sa.String, nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        schema="tallyup",
    )


def downgrade():
    op.drop_table("expenses", schema="tallyup")
    op.drop_table("expense_items", schema="tallyup")
    op.drop_table("users", schema="tallyup")
    op.drop_table("groups", schema="tallyup")
