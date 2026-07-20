import uuid

from sqlalchemy import Column, DateTime, Enum, Float, ForeignKey, Index, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.connection import Base
from app.enums.vehicle_event import (
    VehicleEventSeverity,
    VehicleEventType,
)


class VehicleEvent(Base):
    __tablename__ = "vehicle_events"

    # ── Primary Key ──────────────────────────────────────────────
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # ── Relationships ────────────────────────────────────────────
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

    # ── Event Details ────────────────────────────────────────────
    event_type = Column(
        Enum(VehicleEventType),
        nullable=False,
    )

    severity = Column(
        Enum(VehicleEventSeverity),
        nullable=False,
    )

    title = Column(String(120), nullable=False)

    description = Column(String(500), nullable=False)

    # ── Event Location ───────────────────────────────────────────
    latitude = Column(Float, nullable=True)

    longitude = Column(Float, nullable=True)

    # ── Timestamp ────────────────────────────────────────────────
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True,
    )

    # ── ORM Relationships ───────────────────────────────────────
    booking = relationship("Booking", back_populates="events")
    car = relationship("Car", back_populates="events")

    __table_args__ = (
        Index("ix_vehicle_events_booking_created", "booking_id", "created_at"),
        Index("ix_vehicle_events_car_created", "car_id", "created_at"),
    )