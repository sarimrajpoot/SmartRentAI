from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.enums.car import FuelType, TransmissionType


class CarCreate(BaseModel):
    brand: str
    model: str
    variant: str | None = None
    year: int
    color: str | None = None
    license_plate: str

    transmission: TransmissionType
    fuel_type: FuelType

    seats: int

    daily_price: Decimal

    city: str


class CarResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID

    owner_id: UUID

    brand: str
    model: str
    variant: str | None

    year: int

    color: str | None

    license_plate: str

    transmission: TransmissionType
    fuel_type: FuelType

    seats: int

    daily_price: Decimal

    city: str

    is_available: bool