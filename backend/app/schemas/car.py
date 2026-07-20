from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.enums.car import FuelType, TransmissionType


class CarCreate(BaseModel):
    """Fields required to register a new car listing."""
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
    is_available: bool = True
    images: list[str] = []
    gps_device_id: str | None = None
    fuel_sensor_id: str | None = None
    ai_vehicle_score: float | None = None


class CarUpdate(BaseModel):
    """
    All fields are optional — only the fields present in the request body
    are applied (PATCH semantics via model_dump(exclude_unset=True)).
    """
    brand: str | None = None
    model: str | None = None
    variant: str | None = None
    year: int | None = None
    color: str | None = None
    license_plate: str | None = None
    transmission: TransmissionType | None = None
    fuel_type: FuelType | None = None
    seats: int | None = None
    daily_price: Decimal | None = None
    city: str | None = None
    is_available: bool | None = None
    images: list[str] | None = None
    gps_device_id: str | None = None
    fuel_sensor_id: str | None = None
    ai_vehicle_score: float | None = None


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
    image_url: str | None = None
    images: list[str] = []
    gps_device_id: str | None = None
    fuel_sensor_id: str | None = None
    ai_vehicle_score: float | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None


class CarListResponse(BaseModel):
    """Paginated car listing with metadata."""
    items: list[CarResponse]
    total: int
    page: int
    limit: int
    pages: int