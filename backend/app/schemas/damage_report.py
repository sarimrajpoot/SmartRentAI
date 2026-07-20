from pydantic import BaseModel
from typing import List, Optional, Any
from uuid import UUID
from datetime import datetime

class DamageItem(BaseModel):
    part: str
    type: str
    severity: str
    repair_cost_est: float

class DamageReportCreate(BaseModel):
    booking_id: UUID
    before_image_url: str
    after_image_url: str
    annotated_image_url: Optional[str] = None
    condition_score: int
    total_repair_cost: float
    damages: List[DamageItem]

class DamageReportResponse(BaseModel):
    id: UUID
    booking_id: UUID
    before_image_url: str
    after_image_url: str
    annotated_image_url: Optional[str] = None
    condition_score: int
    total_repair_cost: float
    damages: List[DamageItem]
    created_at: datetime

    class Config:
        from_attributes = True
