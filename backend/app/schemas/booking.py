from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, model_validator

from app.enums.booking import BookingStatus


class BookingCreate(BaseModel):
    car_id: UUID
    start_date: date
    end_date: date
    with_driver: bool = False
    with_insurance: bool = False

    @model_validator(mode="after")
    def start_before_end(self) -> "BookingCreate":
        if self.start_date >= self.end_date:
            raise ValueError("start_date must be strictly before end_date")
        return self


class BookingResponse(BaseModel):
    id: UUID
    customer_id: UUID
    car_id: UUID
    start_date: date
    end_date: date
    total_price: Decimal
    with_driver: bool
    with_insurance: bool
    status: BookingStatus
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)

class BookingListResponse(BaseModel):
    """Paginated booking listing with metadata."""
    items: list[BookingResponse]
    total: int
    page: int
    limit: int
    pages: int

    model_config = ConfigDict(from_attributes=True)