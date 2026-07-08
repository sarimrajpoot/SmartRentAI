"""Add userrole enum and migrate users.role column

Revision ID: 3a8f91c2d5e0
Revises: 1ad8352b5669
Create Date: 2026-07-09 03:20:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3a8f91c2d5e0'
down_revision: Union[str, Sequence[str], None] = '1ad8352b5669'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """
    Create the userrole PostgreSQL enum type and convert the users.role
    column from VARCHAR to userrole.

    The USING clause uppercases the existing string values before casting so
    that data stored as 'customer', 'showroom', or 'admin' (any case) is
    correctly coerced to the enum labels CUSTOMER, SHOWROOM, ADMIN.
    """
    userrole_enum = sa.Enum('CUSTOMER', 'SHOWROOM', 'ADMIN', name='userrole')
    userrole_enum.create(op.get_bind())

    op.alter_column(
        'users',
        'role',
        existing_type=sa.String(),
        type_=userrole_enum,
        postgresql_using='upper(role)::userrole',
    )


def downgrade() -> None:
    """Revert users.role from the userrole enum back to VARCHAR."""
    userrole_enum = sa.Enum('CUSTOMER', 'SHOWROOM', 'ADMIN', name='userrole')

    op.alter_column(
        'users',
        'role',
        existing_type=userrole_enum,
        type_=sa.String(),
        postgresql_using='role::text',
    )

    userrole_enum.drop(op.get_bind())
