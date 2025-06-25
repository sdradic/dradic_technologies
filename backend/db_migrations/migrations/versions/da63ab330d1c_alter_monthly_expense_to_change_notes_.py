"""Alter monthly_expense to change notes into group_id

Revision ID: da63ab330d1c
Revises: d5d510d301bb
Create Date: 2025-03-10 20:13:18.615174

"""

from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "da63ab330d1c"
down_revision: Union[str, None] = "d5d510d301bb"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "monthly_expenses",
        "notes",
        new_column_name="group_id",
        schema="expense_tracker",
    )


def downgrade() -> None:
    op.alter_column(
        "monthly_expenses",
        "group_id",
        new_column_name="notes",
        schema="expense_tracker",
    )
