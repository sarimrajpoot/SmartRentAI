"""
GPS Tracking & Vehicle Telemetry endpoints.

POST  /tracking/location              — Upload one GPS ping (ACTIVE booking required)
GET   /tracking/live/{booking_id}     — Latest location for a booking
GET   /tracking/history/{booking_id}  — Full ordered history for a booking
GET   /tracking/car/{car_id}/latest   — Latest location across all bookings for a car
GET   /tracking/summary/{booking_id}  — Aggregated trip stats (distance, speed, duration)
"""

from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.dependencies import get_db
from app.models.user import User
from app.schemas.tracking import LocationResponse, LocationUpload, TripSummary
from app.services.tracking_service import (
    get_car_latest,
    get_live_location,
    get_location_history,
    get_trip_summary,
    record_location,
)

router = APIRouter(
    prefix="/tracking",
    tags=["GPS Tracking"],
)


@router.post(
    "/location",
    response_model=LocationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload a GPS location ping",
)
def upload_location(
    payload: LocationUpload,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Persist one GPS telemetry ping from the in-vehicle device or rental app.

    Rules enforced in the service:
    - The referenced booking must be ACTIVE.
    - The car_id must match the booking's car.
    - Only the booking's customer, the car's owner (SHOWROOM), or ADMIN may push pings.
    - Coordinate ranges are validated at the schema level (HTTP 422 on failure).
    - If `timestamp` is omitted, the server clock is used.
    """
    return record_location(db=db, payload=payload, current_user=current_user)


@router.get(
    "/live/{booking_id}",
    response_model=LocationResponse,
    summary="Get the live (latest) location for a booking",
)
def live_location(
    booking_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Return the most recent GPS ping for the given booking.

    Visibility:
    - CUSTOMER : own bookings only
    - SHOWROOM : their own cars' bookings only
    - ADMIN    : any booking
    """
    return get_live_location(db=db, booking_id=booking_id, current_user=current_user)


@router.get(
    "/history/{booking_id}",
    response_model=list[LocationResponse],
    summary="Get the full GPS history for a booking",
)
def location_history(
    booking_id: UUID,
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(500, ge=1, le=5000, description="Max records to return"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Return the complete GPS history for a booking, ordered oldest-first.
    Use `skip` and `limit` to paginate large trips.

    Visibility: same as live location.
    """
    return get_location_history(
        db=db,
        booking_id=booking_id,
        current_user=current_user,
        skip=skip,
        limit=limit,
    )


@router.get(
    "/car/{car_id}/latest",
    response_model=LocationResponse,
    summary="Get the latest GPS ping for a specific car",
)
def car_latest_location(
    car_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Return the most recent GPS ping for a car across all its bookings.
    Useful for fleet dashboards.

    Visibility:
    - SHOWROOM : own cars only
    - ADMIN    : any car
    - CUSTOMER : not permitted (HTTP 403)
    """
    return get_car_latest(db=db, car_id=car_id, current_user=current_user)


@router.get(
    "/summary/{booking_id}",
    response_model=TripSummary,
    summary="Get aggregated trip statistics for a booking",
)
def trip_summary(
    booking_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Compute and return aggregate trip statistics:
    - Total GPS pings recorded
    - Total distance (Haversine km)
    - Average and maximum speed (km/h)
    - Trip duration (minutes)
    - First / last timestamps
    - Latest location snapshot

    Visibility: same as live location.
    """
    return get_trip_summary(db=db, booking_id=booking_id, current_user=current_user)
