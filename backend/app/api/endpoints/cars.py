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
    # --- full-text search ---
    search: str | None = Query(
        None,
        description="Search across brand, model, city, and variant (case-insensitive OR match)",
    ),
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
        search=search,
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


# ---------------------------------------------------------------------------
# Protected endpoints — SHOWROOM or ADMIN only
# ---------------------------------------------------------------------------

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
    "/{car_id}/image",
    response_model=CarResponse,
    summary="Upload a car image",
)
async def upload_car_image_endpoint(
    car_id: UUID,
    image: UploadFile = File(..., description="JPEG, PNG, or WebP image file"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.SHOWROOM, UserRole.ADMIN)),
):
    """
    Upload or replace the primary image for a car.
    Accepted formats: JPEG, PNG, WebP — up to MAX_UPLOAD_SIZE_MB in size.
    SHOWROOM users may only upload images for their own cars; ADMIN may upload for any car.
    The stored image is served at the URL returned in image_url.
    """
    # --- MIME type validation ---
    if image.content_type not in settings.allowed_mime_types_list:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=(
                f"Unsupported file type '{image.content_type}'. "
                f"Allowed types: {', '.join(settings.allowed_mime_types_list)}"
            ),
        )

    # --- File size validation ---
    content = await image.read()
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(content) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size exceeds the {settings.MAX_UPLOAD_SIZE_MB} MB limit.",
        )

    return upload_car_image(
        db=db,
        car_id=car_id,
        image_content=content,
        original_filename=image.filename or "upload.jpg",
        current_user=current_user,
    )