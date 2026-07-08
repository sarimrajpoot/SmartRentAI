from sqlalchemy.orm import Session

from app.models.car import Car
from app.schemas.car import CarCreate


def create_car(
    db: Session,
    owner_id,
    car_data: CarCreate,
):
    car = Car(
        owner_id=owner_id,
        **car_data.model_dump()
    )

    db.add(car)

    db.commit()

    db.refresh(car)

    return car