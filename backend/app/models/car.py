import uuid

from sqlalchemy import (
    Column,
    Float,
    String,
    Enum,
    Integer,
    Boolean,
    ForeignKey,
    DateTime,
)
from sqlalchemy import Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.connection import Base
from app.enums.car import (
    FuelType,
    TransmissionType,
)

class Car(Base):
    __tablename__ = "cars"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    owner_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False
    )

    brand = Column(String, nullable=False)

    model = Column(String, nullable=False)

    variant = Column(String)

    year = Column(Integer, nullable=False)

    color = Column(String)

    license_plate = Column(String, unique=True, nullable=False)

    seats = Column(Integer, nullable=False)
    
    transmission = Column( Enum(TransmissionType), nullable=False)
    
    fuel_type = Column(Enum(FuelType), nullable=False)

    daily_price = Column(
    Numeric(10, 2),
    nullable=False
)

    city = Column(String, nullable=False)

    is_available = Column(Boolean, default=True)

    image_url = Column(String, nullable=True)

    gps_device_id = Column(String)

    fuel_sensor_id = Column(String)

    ai_vehicle_score = Column(Float, default=0)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    owner = relationship("User", back_populates="cars")

    bookings = relationship(
        "Booking",
        back_populates="car",
        cascade="all, delete-orphan",
    )

    locations = relationship(
        "VehicleLocation",
        back_populates="car",
        cascade="all, delete-orphan",
        order_by="VehicleLocation.timestamp",
    )