"""Use enums for car fields

Revision ID: f20780f1be59
Revises: db2f7db0c33c
Create Date: 2026-07-07 03:09:47.449070

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f20780f1be59'
down_revision: Union[str, Sequence[str], None] = 'db2f7db0c33c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:

    transmission_enum = sa.Enum(
        "MANUAL",
        "AUTOMATIC",
        name="transmissiontype"
    )

    fuel_enum = sa.Enum(
        "PETROL",
        "DIESEL",
        "HYBRID",
        "ELECTRIC",
        name="fueltype"
    )

    transmission_enum.create(op.get_bind(), checkfirst=True)
    fuel_enum.create(op.get_bind(), checkfirst=True)

    op.alter_column(
        "cars",
        "transmission",
        existing_type=sa.String(),
        type_=transmission_enum,
        postgresql_using="transmission::transmissiontype"
    )

    op.alter_column(
        "cars",
        "fuel_type",
        existing_type=sa.String(),
        type_=fuel_enum,
        postgresql_using="fuel_type::fueltype"
    )


def downgrade() -> None:

    transmission_enum = sa.Enum(
        "MANUAL",
        "AUTOMATIC",
        name="transmissiontype"
    )

    fuel_enum = sa.Enum(
        "PETROL",
        "DIESEL",
        "HYBRID",
        "ELECTRIC",
        name="fueltype"
    )

    op.alter_column(
        "cars",
        "fuel_type",
        existing_type=fuel_enum,
        type_=sa.String(),
        postgresql_using="fuel_type::text"
    )

    op.alter_column(
        "cars",
        "transmission",
        existing_type=transmission_enum,
        type_=sa.String(),
        postgresql_using="transmission::text"
    )

    fuel_enum.drop(op.get_bind(), checkfirst=True)
    transmission_enum.drop(op.get_bind(), checkfirst=True)
