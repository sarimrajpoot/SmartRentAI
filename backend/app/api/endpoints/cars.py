from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.car import CarCreate, CarResponse
from app.services.car_service import create_car
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/cars",
    tags=["Cars"]
)


@router.post(
    "",
    response_model=CarResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_car(
    car: CarCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_car(
        db=db,
        owner_id=current_user.id,
        car_data=car,
    )