import uuid
from sqlalchemy import Column, DateTime, ForeignKey, Numeric, String, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.connection import Base


class DamageReport(Base):
    __tablename__ = "damage_reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_id = Column(
        UUID(as_uuid=True),
        ForeignKey("bookings.id", ondelete="CASCADE"),
        nullable=False,
    )

    before_image_url = Column(String, nullable=False)
    after_image_url = Column(String, nullable=False)
    annotated_image_url = Column(String, nullable=True)

    condition_score = Column(Integer, nullable=False, default=100)
    total_repair_cost = Column(Numeric(10, 2), nullable=False, default=0.00)
    
    # Stores detailed list of damages: [{"part": "Bumper", "type": "Scratch", "severity": "Minor", "repair_cost_est": 150.00}]
    damages = Column(JSONB, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    booking = relationship("Booking", back_populates="damage_reports")
