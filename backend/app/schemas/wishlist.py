from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict
from app.schemas.car import CarResponse

class WishlistAdd(BaseModel):
    car_id: UUID

class WishlistItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    user_id: UUID
    car_id: UUID
    created_at: datetime | None = None
    car: CarResponse

class WishlistListResponse(BaseModel):
    items: list[WishlistItemResponse]
    total: int
