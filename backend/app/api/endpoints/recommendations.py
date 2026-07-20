from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel, ConfigDict
from uuid import UUID

from app.core.dependencies import require_role
from app.database.dependencies import get_db
from app.enums.user import UserRole
from app.models.user import User
from app.schemas.car import CarResponse
from app.ai.recommendations.engine import get_recommendations

router = APIRouter(
    prefix="/recommendations",
    tags=["AI Recommendations"],
)


class RecommendationItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    car: CarResponse
    match_score: int
    explanation: str


class RecommendationResponse(BaseModel):
    items: list[RecommendationItem]
    total: int


@router.get("", response_model=RecommendationResponse, summary="Get AI vehicle recommendations")
def recommend_vehicles(
    budget_min: float | None = Query(None, ge=0),
    budget_max: float | None = Query(None, ge=0),
    seats: int | None = Query(None, ge=1),
    fuel_type: str | None = Query(None),
    transmission: str | None = Query(None),
    city: str | None = Query(None),
    limit: int = Query(12, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.CUSTOMER)),
):
    results = get_recommendations(
        db=db,
        user_id=current_user.id,
        budget_min=budget_min,
        budget_max=budget_max,
        seats=seats,
        fuel_type=fuel_type,
        transmission=transmission,
        city=city,
        limit=limit,
    )
    items = [
        RecommendationItem(
            car=CarResponse.model_validate(r["car"]),
            match_score=r["match_score"],
            explanation=r["explanation"],
        )
        for r in results
    ]
    return RecommendationResponse(items=items, total=len(items))
