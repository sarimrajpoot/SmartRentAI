"""Add image_url column to cars table

Revision ID: b1c2d3e4f5a6
Revises: 3a8f91c2d5e0
Create Date: 2026-07-09 03:50:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b1c2d3e4f5a6'
down_revision: Union[str, Sequence[str], None] = '3a8f91c2d5e0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add the image_url column to the cars table."""
    op.add_column(
        'cars',
        sa.Column('image_url', sa.String(), nullable=True),
    )


def downgrade() -> None:
    """Remove the image_url column from the cars table."""
    op.drop_column('cars', 'image_url')
