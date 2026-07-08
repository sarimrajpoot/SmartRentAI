from sqlalchemy import Column, String, Float, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
from app.database.connection import Base
import uuid
from datetime import datetime
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    full_name = Column(String, nullable=False)

    email = Column(String, unique=True, nullable=False)

    phone = Column(String)

    password_hash = Column(String, nullable=False)

    role = Column(String, nullable=False)

    cnic = Column(String)

    driving_license = Column(String)

    risk_score = Column(Float, default=0)

    is_verified = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    
    cars = relationship(
    "Car",
    back_populates="owner",
    cascade="all, delete-orphan"
)
    bookings = relationship(
    "Booking",
    back_populates="customer",
    cascade="all, delete-orphan"
)


