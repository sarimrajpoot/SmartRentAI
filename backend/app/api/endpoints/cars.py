import math
from decimal import Decimal
from uuid import UUID

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.dependencies import get_current_user, require_role
from app.database.dependencies import get_db
from app.enums.car import FuelType, TransmissionType
from app.enums.user import UserRole
from app.models.user import User
from app.schemas.car import CarCreate, CarListResponse, CarResponse, CarUpdate
from app.services.car_service import (
    create_car,
    delete_car,
    get_car_by_id,
    get_cars,
    update_car,
    upload_car_image,
)

router = APIRouter(
    prefix="/cars",
    tags=["Cars"],
)


# ---------------------------------------------------------------------------
# Public endpoints — no authentication required
# ---------------------------------------------------------------------------

@router.get(
    "",
    response_model=CarListResponse,
    summary="List and search cars",
)
def list_cars(
    # --- partial-text filters ---
    brand: str | None = Query(None, description="Filter by brand (case-insensitive partial match)"),
    model: str | None = Query(None, description="Filter by model (case-insensitive partial match)"),
    city: str | None = Query(None, description="Filter by city (case-insensitive partial match)"),
    # --- enum filters ---
    transmission: TransmissionType | None = Query(None, description="Filter by transmission type"),
    fuel_type: FuelType | None = Query(None, description="Filter by fuel type"),
    # --- price range ---
    price_min: Decimal | None = Query(None, ge=0, description="Minimum daily price (inclusive)"),
    price_max: Decimal | None = Query(None, ge=0, description="Maximum daily price (inclusive)"),
    # --- boolean filter ---
    is_available: bool | None = Query(None, description="Filter by availability status"),
    seats: int | None = Query(None, description="Filter by number of seats"),
    # --- full-text search ---
    search: str | None = Query(
        None,
        description="Search across brand, model, city, and variant (case-insensitive OR match)",
    ),
    sort_by: str = Query("newest", description="Sorting field/direction"),
    # --- pagination ---
    page: int = Query(1, ge=1, description="Page number (1-indexed)"),
    limit: int = Query(20, ge=1, le=100, description="Number of results per page"),
    db: Session = Depends(get_db),
):
    """
    Return a paginated list of cars with optional filtering and full-text search.
    All filters are combinable. No authentication required.
    """
    cars, total = get_cars(
        db=db,
        brand=brand,
        model=model,
        city=city,
        transmission=transmission,
        fuel_type=fuel_type,
        price_min=price_min,
        price_max=price_max,
        is_available=is_available,
        seats=seats,
        search=search,
        sort_by=sort_by,
        page=page,
        limit=limit,
    )
    pages = math.ceil(total / limit) if total > 0 else 0
    return CarListResponse(
        items=cars,
        total=total,
        page=page,
        limit=limit,
        pages=pages,
    )


# ---------------------------------------------------------------------------
# Protected endpoints — SHOWROOM or ADMIN only
# ---------------------------------------------------------------------------

@router.get(
    "/my/stats",
    summary="Get fleet statistics",
)
def get_my_cars_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.SHOWROOM, UserRole.ADMIN)),
):
    """
    Return statistics for the authenticated user's fleet.
    Total Vehicles, Available, Booked, Avg Daily Price, Avg AI Score.
    """
    from app.models.car import Car
    from sqlalchemy.sql import func
    
    query = db.query(Car).filter(Car.owner_id == current_user.id)
    total_vehicles = query.count()
    available_vehicles = query.filter(Car.is_available == True).count()
    
    # Booked (active rentals) could be determined from bookings, but for now we'll say:
    from app.models.booking import Booking
    from app.enums.booking import BookingStatus
    booked = db.query(Booking).join(Car).filter(
        Car.owner_id == current_user.id,
        Booking.status == BookingStatus.ACTIVE
    ).count()

    avg_price = db.query(func.avg(Car.daily_price)).filter(Car.owner_id == current_user.id).scalar() or 0
    avg_score = db.query(func.avg(Car.ai_vehicle_score)).filter(Car.owner_id == current_user.id).scalar() or 0

    return {
        "total_vehicles": total_vehicles,
        "available_vehicles": available_vehicles,
        "booked": booked,
        "average_daily_price": float(avg_price),
        "average_ai_score": float(avg_score),
    }

@router.get(
    "/my",
    response_model=CarListResponse,
    summary="List my cars",
)
def list_my_cars(
    brand: str | None = Query(None),
    model: str | None = Query(None),
    city: str | None = Query(None),
    transmission: TransmissionType | None = Query(None),
    fuel_type: FuelType | None = Query(None),
    price_min: Decimal | None = Query(None, ge=0),
    price_max: Decimal | None = Query(None, ge=0),
    is_available: bool | None = Query(None),
    seats: int | None = Query(None),
    search: str | None = Query(None),
    sort_by: str = Query("newest"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.SHOWROOM, UserRole.ADMIN)),
):
    """
    Return a paginated list of cars owned by the authenticated user.
    """
    cars, total = get_cars(
        db=db,
        brand=brand,
        model=model,
        city=city,
        transmission=transmission,
        fuel_type=fuel_type,
        price_min=price_min,
        price_max=price_max,
        is_available=is_available,
        seats=seats,
        search=search,
        sort_by=sort_by,
        page=page,
        limit=limit,
        owner_id=current_user.id,
    )
    pages = math.ceil(total / limit) if total > 0 else 0
    return CarListResponse(
        items=cars,
        total=total,
        page=page,
        limit=limit,
        pages=pages,
    )

@router.get(
    "/{car_id}",
    response_model=CarResponse,
    summary="Get a single car",
)
def get_car(
    car_id: UUID,
    db: Session = Depends(get_db),
):
    """
    Retrieve full details for a single car by its ID.
    No authentication required.
    """
    return get_car_by_id(db=db, car_id=car_id)

@router.post(
    "",
    response_model=CarResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new car",
)
def register_car(
    car: CarCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.SHOWROOM, UserRole.ADMIN)),
):
    """
    Create a new car listing owned by the authenticated user.
    Requires SHOWROOM or ADMIN role.
    """
    return create_car(
        db=db,
        owner_id=current_user.id,
        car_data=car,
    )


@router.patch(
    "/{car_id}",
    response_model=CarResponse,
    summary="Update a car listing",
)
def update_car_endpoint(
    car_id: UUID,
    update_data: CarUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.SHOWROOM, UserRole.ADMIN)),
):
    """
    Partially update a car listing. Only provided fields are changed.
    SHOWROOM users may only update their own cars; ADMIN may update any car.
    """
    return update_car(
        db=db,
        car_id=car_id,
        update_data=update_data,
        current_user=current_user,
    )


@router.delete(
    "/{car_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a car listing",
)
def delete_car_endpoint(
    car_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.SHOWROOM, UserRole.ADMIN)),
):
    """
    Permanently delete a car and cascade-delete its bookings.
    SHOWROOM users may only delete their own cars; ADMIN may delete any car.
    """
    delete_car(db=db, car_id=car_id, current_user=current_user)


@router.post(
    "/{car_id}/images",
    response_model=CarResponse,
    summary="Upload multiple car images",
)
async def upload_car_images_endpoint(
    car_id: UUID,
    images: list[UploadFile] = File(..., description="List of JPEG, PNG, or WebP image files"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.SHOWROOM, UserRole.ADMIN)),
):
    """
    Upload multiple images for a car.
    """
    car = None
    for image in images:
        if image.content_type not in settings.allowed_mime_types_list:
            continue

        content = await image.read()
        max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
        if len(content) > max_bytes:
            continue

        car = upload_car_image(
            db=db,
            car_id=car_id,
            image_content=content,
            original_filename=image.filename or "upload.jpg",
            current_user=current_user,
        )
        
    # Return updated car (if no valid images, just fetch the car)
    if not car:
        car = get_car_by_id(db, car_id)
    return car