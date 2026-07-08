from datetime import date
from uuid import UUID
from decimal import Decimal
from app.enums.booking import BookingStatus
from pydantic import BaseModel


class BookingCreate(BaseModel):
    car_id: UUID
    start_date: date
    end_date: date


class BookingResponse(BaseModel):
    id: UUID

    customer_id: UUID

    car_id: UUID

    start_date: date

    end_date: date

    total_price: Decimal

    status: BookingStatus

    class Config:
        from_attributes = True