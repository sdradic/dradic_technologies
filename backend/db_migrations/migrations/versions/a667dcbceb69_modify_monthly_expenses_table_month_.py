"""Modify monthly_expenses table month column type

Revision ID: a667dcbceb69
Revises: 3436fb7b6efd
Create Date: 2025-03-06 18:53:15.414847

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "a667dcbceb69"
down_revision: Union[str, None] = "3436fb7b6efd"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "monthly_expenses",
        "month",
        type_=sa.String(),
        nullable=False,
        schema="expense_tracker",
    )


def downgrade() -> None:
    op.alter_column(
        "monthly_expenses",
        "month",
        type_=sa.DateTime(),
        nullable=False,
        schema="expense_tracker",
    )
