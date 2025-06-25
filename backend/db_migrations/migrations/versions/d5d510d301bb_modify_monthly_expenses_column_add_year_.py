"""Modify monthly_expenses column add year column

Revision ID: d5d510d301bb
Revises: a667dcbceb69
Create Date: 2025-03-06 19:09:42.889718

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "d5d510d301bb"
down_revision: Union[str, None] = "a667dcbceb69"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "monthly_expenses",
        sa.Column("year", sa.Integer(), nullable=False),
        schema="expense_tracker",
    )


def downgrade() -> None:
    op.drop_column("monthly_expenses", "year", schema="expense_tracker")
