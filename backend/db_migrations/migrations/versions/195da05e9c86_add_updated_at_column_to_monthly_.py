"""Add updated_at column to monthly_expenses

Revision ID: 195da05e9c86
Revises: da63ab330d1c
Create Date: 2025-04-09 20:54:00.505812

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "195da05e9c86"
down_revision: Union[str, None] = "da63ab330d1c"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add updated_at column
    op.add_column(
        "monthly_expenses",
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
            server_onupdate=sa.func.now(),
        ),
        schema="expense_tracker",
    )


def downgrade() -> None:
    op.drop_column("monthly_expenses", "updated_at", schema="expense_tracker")
