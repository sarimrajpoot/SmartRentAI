"""
VehicleLocation — persists GPS + telemetry pings from active rental trips.

One row per GPS update. A high-frequency device may push one row per second;
this table is the source of truth for:
  - real-time position (latest row per booking)
  - trip history / replay
  - distance, average speed, duration calculations
"""

import uuid

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Numeric,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.connection import Base


class VehicleLocation(Base):
    __tablename__ = "vehicle_locations"

    # ── Primary key ───────────────────────────────────────────────────────────
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # ── Foreign keys ──────────────────────────────────────────────────────────
    booking_id = Column(
        UUID(as_uuid=True),
        ForeignKey("bookings.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    car_id = Column(
        UUID(as_uuid=True),
        ForeignKey("cars.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # ── GPS position ──────────────────────────────────────────────────────────
    latitude = Column(Float, nullable=False)   # -90.0 … +90.0
    longitude = Column(Float, nullable=False)  # -180.0 … +180.0

    # ── Motion ────────────────────────────────────────────────────────────────
    speed_kmh = Column(Float, nullable=True)        # 0 … ~250
    heading = Column(Float, nullable=True)          # 0 … 359.9 degrees

    # ── Vehicle state ─────────────────────────────────────────────────────────
    ignition_on = Column(Boolean, nullable=True)
    fuel_percentage = Column(Float, nullable=True)  # 0.0 … 100.0
    battery_voltage = Column(Float, nullable=True)  # e.g. 12.6 V
    odometer_km = Column(Float, nullable=True)      # cumulative odometer reading

    # ── Signal quality ────────────────────────────────────────────────────────
    gps_accuracy = Column(Float, nullable=True)     # metres; lower = better

    # ── Timestamp ────────────────────────────────────────────────────────────
    # The device timestamp is preferred over server ingestion time so that
    # late-arriving or batched pings are ordered correctly in history queries.
    timestamp = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True,
    )

    # ── ORM relationships ─────────────────────────────────────────────────────
    booking = relationship("Booking", back_populates="locations")
    car = relationship("Car", back_populates="locations")

    # ── Composite index for the two most common query patterns ────────────────
    __table_args__ = (
        # History for a booking, newest first
        Index("ix_vehicle_locations_booking_ts", "booking_id", "timestamp"),
        # Latest location for a car (cross-booking)
        Index("ix_vehicle_locations_car_ts", "car_id", "timestamp"),
    )
