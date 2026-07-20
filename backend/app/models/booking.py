import uuid

from sqlalchemy import (
    Column,
    Date,
    DateTime,
    ForeignKey,
    Enum,
    Numeric,
    Boolean,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.connection import Base
from app.enums.booking import BookingStatus


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    customer_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False
    )

    car_id = Column(
        UUID(as_uuid=True),
        ForeignKey("cars.id"),
        nullable=False
    )

    start_date = Column(Date, nullable=False)

    end_date = Column(Date, nullable=False)

    total_price = Column(
        Numeric(10, 2),
        nullable=False
    )
    
    with_driver = Column(
        Boolean,
        nullable=False,
        default=False
    )
    
    with_insurance = Column(
        Boolean,
        nullable=False,
        default=False
    )

    status = Column(
    Enum(BookingStatus),
    nullable=False,
    default=BookingStatus.PENDING
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    customer = relationship(
        "User",
        back_populates="bookings"
    )

    car = relationship(
        "Car",
        back_populates="bookings"
    )

    locations = relationship(
        "VehicleLocation",
        back_populates="booking",
        cascade="all, delete-orphan",
        order_by="VehicleLocation.timestamp",
    )
    
    events = relationship(
        "VehicleEvent",
        back_populates="booking",
        cascade="all, delete-orphan",
    )
    
    damage_reports = relationship(
        "DamageReport",
        back_populates="booking",
        cascade="all, delete-orphan",
    )