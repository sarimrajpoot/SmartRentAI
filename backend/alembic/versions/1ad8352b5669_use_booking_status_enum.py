"""Use booking status enum

Revision ID: 1ad8352b5669
Revises: 22544da0eec9
Create Date: 2026-07-07 09:46:19.997174

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1ad8352b5669'
down_revision: Union[str, Sequence[str], None] = '22544da0eec9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add the REJECTED value to the bookingstatus PostgreSQL enum type."""
    op.execute("ALTER TYPE bookingstatus ADD VALUE 'REJECTED'")


def downgrade() -> None:
    """
    PostgreSQL does not support removing individual values from an enum type
    without rebuilding the entire type and all tables that reference it.
    This migration is therefore considered irreversible via standard downgrade.
    To fully reverse, recreate the bookingstatus enum without REJECTED and
    rebuild the bookings table manually.
    """
    pass
