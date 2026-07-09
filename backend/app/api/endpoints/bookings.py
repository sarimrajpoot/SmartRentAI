from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_role
from app.database.dependencies import get_db
from app.enums.user import UserRole
from app.models.user import User
from app.schemas.booking import BookingCreate, BookingResponse
from app.services.booking_service import (
    approve_booking,
    cancel_booking,
    complete_booking,
    create_booking,
    get_booking_by_id,
    get_customer_bookings,
    get_owner_bookings,
    reject_booking,
    start_booking,
)

router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"],
)


# ---------------------------------------------------------------------------
# Customer endpoints
# ---------------------------------------------------------------------------

@router.post(
    "",
    response_model=BookingResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a booking",
)
def book_car(
    booking: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.CUSTOMER)),
):
    """
    Create a new PENDING booking.
    - Only CUSTOMER role may book.
    - Car must exist and be available.
    - Dates must not overlap an existing active booking.
    - Customer cannot book their own vehicle.
    """
    return create_booking(db=db, booking=booking, customer_id=current_user.id)


@router.get(
    "/my",
    response_model=List[BookingResponse],
    summary="List my bookings",
)
def my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.CUSTOMER)),
):
    """Return all bookings placed by the authenticated customer, newest first."""
    return get_customer_bookings(db=db, customer_id=current_user.id)


# ---------------------------------------------------------------------------
# Owner / Admin endpoints — list
# ---------------------------------------------------------------------------

@router.get(
    "/owner",
    response_model=List[BookingResponse],
    summary="List bookings for my cars",
)
def owner_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.SHOWROOM, UserRole.ADMIN)),
):
    """Return all bookings across cars owned by the authenticated showroom, newest first."""
    return get_owner_bookings(db=db, owner_id=current_user.id)


# ---------------------------------------------------------------------------
# Single booking — accessible to owner, customer, or admin (enforced in service)
# ---------------------------------------------------------------------------

@router.get(
    "/{booking_id}",
    response_model=BookingResponse,
    summary="Get a booking by ID",
)
def get_booking(
    booking_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Retrieve a booking by ID.
    - CUSTOMER may only view their own bookings.
    - SHOWROOM may only view bookings on their cars.
    - ADMIN may view any booking.
    """
    return get_booking_by_id(db=db, booking_id=booking_id, current_user=current_user)


# ---------------------------------------------------------------------------
# State-transition endpoints — owner / admin
# ---------------------------------------------------------------------------

@router.patch(
    "/{booking_id}/approve",
    response_model=BookingResponse,
    summary="Approve a pending booking",
)
def approve_booking_endpoint(
    booking_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.SHOWROOM, UserRole.ADMIN)),
):
    """Transition PENDING → CONFIRMED. Only the car's owner or ADMIN may approve."""
    return approve_booking(db=db, booking_id=booking_id, current_user=current_user)


@router.patch(
    "/{booking_id}/reject",
    response_model=BookingResponse,
    summary="Reject a pending booking",
)
def reject_booking_endpoint(
    booking_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.SHOWROOM, UserRole.ADMIN)),
):
    """Transition PENDING → REJECTED. Only the car's owner or ADMIN may reject."""
    return reject_booking(db=db, booking_id=booking_id, current_user=current_user)


@router.patch(
    "/{booking_id}/start",
    response_model=BookingResponse,
    summary="Start a confirmed booking",
)
def start_booking_endpoint(
    booking_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.SHOWROOM, UserRole.ADMIN)),
):
    """Transition CONFIRMED → ACTIVE. Only the car's owner or ADMIN may start."""
    return start_booking(db=db, booking_id=booking_id, current_user=current_user)


@router.patch(
    "/{booking_id}/complete",
    response_model=BookingResponse,
    summary="Mark an active booking as completed",
)
def complete_booking_endpoint(
    booking_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.SHOWROOM, UserRole.ADMIN)),
):
    """Transition ACTIVE → COMPLETED. Only the car's owner or ADMIN may complete."""
    return complete_booking(db=db, booking_id=booking_id, current_user=current_user)


# ---------------------------------------------------------------------------
# Cancel — customer self-cancel OR owner/admin cancellation
# ---------------------------------------------------------------------------

@router.patch(
    "/{booking_id}/cancel",
    response_model=BookingResponse,
    summary="Cancel an active booking",
)
def cancel_booking_endpoint(
    booking_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Transition ACTIVE → CANCELLED.
    - CUSTOMER may only cancel their own bookings.
    - SHOWROOM / ADMIN may cancel bookings on their cars.
    """
    return cancel_booking(db=db, booking_id=booking_id, current_user=current_user)