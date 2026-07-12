"""Create vehicle_locations table

Revision ID: c3d4e5f6a7b8
Revises: b1c2d3e4f5a6
Create Date: 2026-07-10 05:22:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'c3d4e5f6a7b8'
down_revision: Union[str, Sequence[str], None] = 'b1c2d3e4f5a6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create the vehicle_locations table and supporting indexes."""
    op.create_table(
        'vehicle_locations',
        # ── Primary key ───────────────────────────────────────────────────────
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),

        # ── Foreign keys ──────────────────────────────────────────────────────
        sa.Column('booking_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('car_id',     postgresql.UUID(as_uuid=True), nullable=False),

        # ── Position ──────────────────────────────────────────────────────────
        sa.Column('latitude',   sa.Float(), nullable=False),
        sa.Column('longitude',  sa.Float(), nullable=False),

        # ── Motion ────────────────────────────────────────────────────────────
        sa.Column('speed_kmh',  sa.Float(), nullable=True),
        sa.Column('heading',    sa.Float(), nullable=True),

        # ── Vehicle state ─────────────────────────────────────────────────────
        sa.Column('ignition_on',      sa.Boolean(), nullable=True),
        sa.Column('fuel_percentage',  sa.Float(),   nullable=True),
        sa.Column('battery_voltage',  sa.Float(),   nullable=True),
        sa.Column('odometer_km',      sa.Float(),   nullable=True),

        # ── Signal quality ────────────────────────────────────────────────────
        sa.Column('gps_accuracy', sa.Float(), nullable=True),

        # ── Timestamp ────────────────────────────────────────────────────────
        sa.Column(
            'timestamp',
            sa.DateTime(timezone=True),
            server_default=sa.text('now()'),
            nullable=False,
        ),

        # ── Constraints ───────────────────────────────────────────────────────
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(
            ['booking_id'], ['bookings.id'],
            ondelete='CASCADE',
        ),
        sa.ForeignKeyConstraint(
            ['car_id'], ['cars.id'],
            ondelete='CASCADE',
        ),
    )

    # ── Indexes ───────────────────────────────────────────────────────────────
    # Single-column indexes (declared on model) ─ Alembic creates these
    op.create_index(
        'ix_vehicle_locations_booking_id',
        'vehicle_locations', ['booking_id'],
    )
    op.create_index(
        'ix_vehicle_locations_car_id',
        'vehicle_locations', ['car_id'],
    )
    op.create_index(
        'ix_vehicle_locations_timestamp',
        'vehicle_locations', ['timestamp'],
    )
    # Composite indexes for the two most common query patterns
    op.create_index(
        'ix_vehicle_locations_booking_ts',
        'vehicle_locations', ['booking_id', 'timestamp'],
    )
    op.create_index(
        'ix_vehicle_locations_car_ts',
        'vehicle_locations', ['car_id', 'timestamp'],
    )


def downgrade() -> None:
    """Drop the vehicle_locations table and all associated indexes."""
    op.drop_index('ix_vehicle_locations_car_ts',     table_name='vehicle_locations')
    op.drop_index('ix_vehicle_locations_booking_ts', table_name='vehicle_locations')
    op.drop_index('ix_vehicle_locations_timestamp',  table_name='vehicle_locations')
    op.drop_index('ix_vehicle_locations_car_id',     table_name='vehicle_locations')
    op.drop_index('ix_vehicle_locations_booking_id', table_name='vehicle_locations')
    op.drop_table('vehicle_locations')
