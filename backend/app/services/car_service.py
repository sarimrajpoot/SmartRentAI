import uuid
from decimal import Decimal
from pathlib import Path
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.enums.car import FuelType, TransmissionType
from app.enums.user import UserRole
from app.models.car import Car
from app.models.user import User
from app.schemas.car import CarCreate, CarUpdate
from app.services.storage import get_storage_service


def create_car(
    db: Session,
    owner_id,
    car_data: CarCreate,
) -> Car:
    """Persist a new car listing owned by owner_id."""
    car = Car(
        owner_id=owner_id,
        **car_data.model_dump()
    )
    db.add(car)
    db.commit()
    db.refresh(car)
    return car


def get_car_by_id(db: Session, car_id: UUID) -> Car:
    """Return a single car or raise HTTP 404."""
    car = db.query(Car).filter(Car.id == car_id).first()
    if not car:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Car '{car_id}' not found.",
        )
    return car


def get_cars(
    db: Session,
    *,
    brand: str | None = None,
    model: str | None = None,
    city: str | None = None,
    transmission: TransmissionType | None = None,
    fuel_type: FuelType | None = None,
    price_min: Decimal | None = None,
    price_max: Decimal | None = None,
    seats: int | None = None,
    is_available: bool | None = None,
    search: str | None = None,
    sort_by: str = "newest",
    page: int = 1,
    limit: int = 20,
    owner_id: UUID | None = None,
) -> tuple[list[Car], int]:
    """
    Return (cars, total_count) applying optional filters and pagination.

    Filters applied:
        - brand / model / city : case-insensitive partial match
        - transmission / fuel_type : exact enum match
        - price_min / price_max : inclusive daily price range
        - seats : exact match
        - is_available : exact boolean match
        - search : case-insensitive OR match across brand, model, city, variant, license_plate
        - owner_id : exact match
    """
    query = db.query(Car)

    # --- Ownership filter ---
    if owner_id is not None:
        query = query.filter(Car.owner_id == owner_id)

    # --- Enum / boolean filters (exact match) ---
    if transmission is not None:
        query = query.filter(Car.transmission == transmission)
    if fuel_type is not None:
        query = query.filter(Car.fuel_type == fuel_type)
    if is_available is not None:
        query = query.filter(Car.is_available == is_available)

    # --- Price range & seats ---
    if price_min is not None:
        query = query.filter(Car.daily_price >= price_min)
    if price_max is not None:
        query = query.filter(Car.daily_price <= price_max)
    if seats is not None:
        query = query.filter(Car.seats == seats)

    # --- Partial-text filters ---
    if brand:
        query = query.filter(Car.brand.ilike(f"%{brand}%"))
    if model:
        query = query.filter(Car.model.ilike(f"%{model}%"))
    if city:
        query = query.filter(Car.city.ilike(f"%{city}%"))

    # --- Full-text search (OR across multiple columns) ---
    if search:
        term = f"%{search}%"
        query = query.filter(
            or_(
                Car.brand.ilike(term),
                Car.model.ilike(term),
                Car.city.ilike(term),
                Car.variant.ilike(term),
                Car.license_plate.ilike(term),
            )
        )

    # --- Sorting ---
    if sort_by == "oldest":
        query = query.order_by(Car.created_at.asc())
    elif sort_by == "price_asc":
        query = query.order_by(Car.daily_price.asc())
    elif sort_by == "price_desc":
        query = query.order_by(Car.daily_price.desc())
    elif sort_by == "ai_score_desc":
        query = query.order_by(Car.ai_vehicle_score.desc())
    elif sort_by == "alphabetical":
        query = query.order_by(Car.brand.asc(), Car.model.asc())
    else:
        # Default to newest
        query = query.order_by(Car.created_at.desc())

    total = query.count()
    offset = (page - 1) * limit
    cars = (
        query
        .offset(offset)
        .limit(limit)
        .all()
    )
    return cars, total


def update_car(
    db: Session,
    car_id: UUID,
    update_data: CarUpdate,
    current_user: User,
) -> Car:
    """
    Apply a partial update to a car listing.

    Authorization:
        - ADMIN may update any car.
        - SHOWROOM may only update cars they own.
    """
    car = get_car_by_id(db, car_id)

    if current_user.role != UserRole.ADMIN and car.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to update this car.",
        )

    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(car, field, value)

    db.commit()
    db.refresh(car)
    return car


def delete_car(
    db: Session,
    car_id: UUID,
    current_user: User,
) -> None:
    """
    Permanently delete a car listing and all its bookings (cascade).

    Authorization:
        - ADMIN may delete any car.
        - SHOWROOM may only delete cars they own.
    """
    car = get_car_by_id(db, car_id)

    if current_user.role != UserRole.ADMIN and car.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to delete this car.",
        )
        
    storage = get_storage_service()
    if car.image_url:
        storage.delete_file(car.image_url)
    if car.images:
        for url in car.images:
            storage.delete_file(url)

    db.delete(car)
    db.commit()


def upload_car_image(
    db: Session,
    car_id: UUID,
    image_content: bytes,
    original_filename: str,
    current_user: User,
) -> Car:
    """
    Save a validated image file to uploads/cars/ and update the car's
    image_url.  The endpoint is responsible for MIME/size validation
    before calling this function.

    Authorization:
        - ADMIN may upload for any car.
        - SHOWROOM may only upload for their own cars.
    """
    car = get_car_by_id(db, car_id)

    if current_user.role != UserRole.ADMIN and car.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to upload an image for this car.",
        )

    storage = get_storage_service()
    url = storage.save_file(image_content, original_filename, "cars")

    if car.images is None:
        car.images = []
        
    # We create a new list so SQLAlchemy detects the mutation of JSON
    new_images = list(car.images)
    new_images.append(url)
    car.images = new_images
    
    # Also set primary image_url if not set (for legacy support/convenience)
    if not car.image_url:
        car.image_url = url

    db.commit()
    db.refresh(car)
    return car