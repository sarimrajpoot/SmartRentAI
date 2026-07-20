"""
Booking service — all business logic for the booking lifecycle.

Lifecycle:
    PENDING → CONFIRMED → ACTIVE → COMPLETED
    PENDING → REJECTED
    ACTIVE  → CANCELLED   (customer self-cancel)

Valid transitions table:
    (current_status, action)    → new_status
    (PENDING,   approve)        → CONFIRMED
    (PENDING,   reject)         → REJECTED
    (CONFIRMED, start)          → ACTIVE
    (ACTIVE,    complete)       → COMPLETED
    (ACTIVE,    cancel)         → CANCELLED

Any other transition raises HTTP 409 Conflict.
"""

from datetime import date
from uuid import UUID

from fastapi import HTTPException, status
from fastapi import HTTPException, status
from sqlalchemy import and_, or_, cast, String
from sqlalchemy.orm import Session

from app.enums.booking import BookingStatus
from app.enums.user import UserRole
from app.models.booking import Booking
from app.models.car import Car
from app.models.user import User
from app.schemas.booking import BookingCreate


# ---------------------------------------------------------------------------
# Valid state transitions: maps (current_status, action_name) → next_status
# ---------------------------------------------------------------------------
_TRANSITIONS: dict[tuple[BookingStatus, str], BookingStatus] = {
    (BookingStatus.PENDING,    "approve"):  BookingStatus.CONFIRMED,
    (BookingStatus.PENDING,    "reject"):   BookingStatus.REJECTED,
    (BookingStatus.CONFIRMED,  "start"):    BookingStatus.ACTIVE,
    (BookingStatus.ACTIVE,     "complete"): BookingStatus.COMPLETED,
    (BookingStatus.ACTIVE,     "cancel"):   BookingStatus.CANCELLED,
}


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _get_booking_or_404(db: Session, booking_id: UUID) -> Booking:
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Booking '{booking_id}' not found.",
        )
    return booking


def _assert_can_manage_car(car: Car, current_user: User) -> None:
    """Raise 403 unless the user is the car's owner or an admin."""
    if current_user.role != UserRole.ADMIN and car.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to manage bookings for this car.",
        )


def _assert_transition(booking: Booking, action: str) -> BookingStatus:
    """Return the next status or raise HTTP 409 if the transition is invalid."""
    next_status = _TRANSITIONS.get((booking.status, action))
    if next_status is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                f"Cannot perform '{action}' on a booking with status "
                f"'{booking.status.value}'. "
                f"Valid actions for this status: "
                f"{[a for (s, a), _ in _TRANSITIONS.items() if s == booking.status] or 'none'}."
            ),
        )
    return next_status


def _has_overlap(db: Session, car_id: UUID, start_date: date, end_date: date,
                 exclude_booking_id: UUID | None = None) -> bool:
    """
    Return True if any non-terminal booking on this car overlaps [start_date, end_date).

    A booking [A, B) overlaps [C, D) when A < D and C < B.
    Terminal statuses (COMPLETED, CANCELLED, REJECTED) are excluded from conflict checks.
    """
    active_statuses = [
        BookingStatus.PENDING,
        BookingStatus.CONFIRMED,
        BookingStatus.ACTIVE,
    ]
    query = (
        db.query(Booking)
        .filter(
            Booking.car_id == car_id,
            Booking.status.in_(active_statuses),
            Booking.start_date < end_date,
            Booking.end_date > start_date,
        )
    )
    if exclude_booking_id:
        query = query.filter(Booking.id != exclude_booking_id)

    return query.first() is not None


# ---------------------------------------------------------------------------
# Public service functions
# ---------------------------------------------------------------------------

def create_booking(
    db: Session,
    booking: BookingCreate,
    customer_id: UUID,
) -> Booking:
    """
    Create a PENDING booking after full validation:
        1. Car must exist.
        2. Car must be marked is_available.
        3. Customer cannot book their own car.
        4. Dates must not overlap any active booking on that car.
        (Date-range order is already validated by BookingCreate schema.)
    """
    car = db.query(Car).filter(Car.id == booking.car_id).first()
    if not car:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Car not found.",
        )

    if not car.is_available:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This car is currently not available for booking.",
        )

    if str(car.owner_id) == str(customer_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot book your own vehicle.",
        )

    if _has_overlap(db, booking.car_id, booking.start_date, booking.end_date):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "The requested dates overlap with an existing booking for this car. "
                "Please choose different dates."
            ),
        )

    days = (booking.end_date - booking.start_date).days
    if days == 0:
        days = 1 # Minimum 1 day rental

    # Base price
    total_price = days * car.daily_price

    # Extras
    if booking.with_driver:
        total_price += days * 2000
        
    if booking.with_insurance:
        total_price += days * 1500

    new_booking = Booking(
        customer_id=customer_id,
        car_id=booking.car_id,
        start_date=booking.start_date,
        end_date=booking.end_date,
        total_price=total_price,
        with_driver=booking.with_driver,
        with_insurance=booking.with_insurance,
        status=BookingStatus.PENDING,
    )
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return new_booking


def get_booking_by_id(db: Session, booking_id: UUID, current_user: User) -> Booking:
    """
    Return a booking by ID.
    - CUSTOMER may only view their own bookings.
    - SHOWROOM may only view bookings for their cars.
    - ADMIN may view any booking.
    """
    booking = _get_booking_or_404(db, booking_id)

    if current_user.role == UserRole.CUSTOMER:
        if str(booking.customer_id) != str(current_user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You may only view your own bookings.",
            )

    elif current_user.role == UserRole.SHOWROOM:
        car = db.query(Car).filter(Car.id == booking.car_id).first()
        if not car or str(car.owner_id) != str(current_user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You may only view bookings for your own cars.",
            )

    return booking


def get_customer_bookings(
    db: Session, 
    customer_id: UUID, 
    skip: int = 0, 
    limit: int = 10,
    search: str | None = None
) -> tuple[list[Booking], int]:
    """Return all bookings for a customer, newest first, with pagination."""
    query = db.query(Booking).filter(Booking.customer_id == customer_id)
    
    if search:
        query = query.join(Car, Booking.car_id == Car.id).filter(
            or_(
                Car.brand.ilike(f"%{search}%"),
                Car.model.ilike(f"%{search}%"),
                cast(Booking.id, String).ilike(f"%{search}%")
            )
        )
        
    total_count = query.count()
    items = query.order_by(Booking.created_at.desc()).offset(skip).limit(limit).all()
    
    return items, total_count


def get_owner_bookings(
    db: Session, 
    owner_id: UUID, 
    skip: int = 0, 
    limit: int = 10,
    status: str | None = None,
    search: str | None = None
) -> tuple[list[Booking], int]:
    """Return all bookings on cars owned by owner_id, newest first, with pagination."""
    query = (
        db.query(Booking)
        .join(Car, Booking.car_id == Car.id)
        .filter(Car.owner_id == owner_id)
    )
    
    if status:
        query = query.filter(Booking.status == status)
        
    if search:
        query = query.filter(
            or_(
                Car.brand.ilike(f"%{search}%"),
                Car.model.ilike(f"%{search}%"),
                cast(Booking.id, String).ilike(f"%{search}%")
            )
        )
        
    total_count = query.count()
    items = query.order_by(Booking.created_at.desc()).offset(skip).limit(limit).all()
    
    return items, total_count


def approve_booking(db: Session, booking_id: UUID, current_user: User) -> Booking:
    """
    PENDING → CONFIRMED.
    Only the car's owner or an admin may approve.
    Re-checks for date overlap before confirming (another booking may have been
    approved in the meantime for the same car + date range).
    """
    booking = _get_booking_or_404(db, booking_id)
    car = db.query(Car).filter(Car.id == booking.car_id).first()
    _assert_can_manage_car(car, current_user)

    next_status = _assert_transition(booking, "approve")

    # Re-validate overlap excluding this booking itself
    if _has_overlap(db, booking.car_id, booking.start_date, booking.end_date,
                    exclude_booking_id=booking_id):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "Cannot approve: another booking for the same car and overlapping "
                "dates has already been confirmed."
            ),
        )

    booking.status = next_status
    db.commit()
    db.refresh(booking)
    return booking


def reject_booking(db: Session, booking_id: UUID, current_user: User) -> Booking:
    """PENDING → REJECTED. Only the car's owner or an admin may reject."""
    booking = _get_booking_or_404(db, booking_id)
    car = db.query(Car).filter(Car.id == booking.car_id).first()
    _assert_can_manage_car(car, current_user)

    booking.status = _assert_transition(booking, "reject")
    db.commit()
    db.refresh(booking)
    return booking


def start_booking(db: Session, booking_id: UUID, current_user: User) -> Booking:
    """CONFIRMED → ACTIVE. Only the car's owner or an admin may start."""
    booking = _get_booking_or_404(db, booking_id)
    car = db.query(Car).filter(Car.id == booking.car_id).first()
    _assert_can_manage_car(car, current_user)

    booking.status = _assert_transition(booking, "start")
    db.commit()
    db.refresh(booking)
    return booking


def complete_booking(db: Session, booking_id: UUID, current_user: User) -> Booking:
    """ACTIVE → COMPLETED. Only the car's owner or an admin may complete."""
    booking = _get_booking_or_404(db, booking_id)
    car = db.query(Car).filter(Car.id == booking.car_id).first()
    _assert_can_manage_car(car, current_user)

    booking.status = _assert_transition(booking, "complete")
    db.commit()
    db.refresh(booking)
    return booking


def cancel_booking(db: Session, booking_id: UUID, current_user: User) -> Booking:
    """
    ACTIVE → CANCELLED.
    - CUSTOMER may only cancel their own bookings.
    - SHOWROOM/ADMIN may cancel any booking on their cars.
    """
    booking = _get_booking_or_404(db, booking_id)

    if current_user.role == UserRole.CUSTOMER:
        if str(booking.customer_id) != str(current_user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You may only cancel your own bookings.",
            )
    else:
        car = db.query(Car).filter(Car.id == booking.car_id).first()
        _assert_can_manage_car(car, current_user)

    booking.status = _assert_transition(booking, "cancel")
    db.commit()
    db.refresh(booking)
    return booking