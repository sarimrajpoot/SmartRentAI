from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session
from uuid import UUID
from app.database.dependencies import get_db
from typing import List
from app.schemas.booking import (
    BookingCreate,
    BookingResponse,
)
from app.services.booking_service import (
    create_booking,
    get_customer_bookings,
    get_owner_bookings,
    approve_booking,
    reject_booking,
    start_booking,
    complete_booking,
)
from app.services.booking_service import create_booking

from app.core.dependencies import get_current_user

from app.models.user import User


router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"],
)


@router.post(
    "",
    response_model=BookingResponse,
    status_code=201,
)
@router.get(
    "/my",
    response_model=List[BookingResponse]
)
def my_bookings(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_customer_bookings(
        db,
        current_user.id,
    )
def book_car(
    booking: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return create_booking(
        db,
        booking,
        current_user.id,
    )
@router.get(
    "/owner",
    response_model=List[BookingResponse]
)
def owner_bookings(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_owner_bookings(
        db,
        current_user.id,
    )
@router.patch(
    "/{booking_id}/approve",
    response_model=BookingResponse
)
def approve_booking_endpoint(
    booking_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return approve_booking(
        db,
        booking_id,
        current_user.id,
    )
@router.patch(
    "/{booking_id}/reject",
    response_model=BookingResponse
)
def reject_booking_endpoint(
    booking_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return reject_booking(
        db,
        booking_id,
        current_user.id,
    )
@router.patch(
    "/{booking_id}/start",
    response_model=BookingResponse
)
def start_booking_endpoint(
    booking_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return start_booking(
        db,
        booking_id,
        current_user.id,
    )
@router.patch(
    "/{booking_id}/complete",
    response_model=BookingResponse
)
def complete_booking_endpoint(
    booking_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return complete_booking(
        db,
        booking_id,
        current_user.id,
    )