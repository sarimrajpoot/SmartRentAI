"""
Tracking service — all business logic for GPS & vehicle telemetry.

Public functions:
    record_location()       — validate & persist one GPS ping
    get_live_location()     — latest ping for a booking
    get_location_history()  — full ordered history with optional pagination
    get_car_latest()        — latest ping across all bookings for a car
    get_trip_summary()      — aggregated distance / speed / duration stats
"""

import math
from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.enums.booking import BookingStatus
from app.enums.user import UserRole
from app.models.booking import Booking
from app.models.car import Car
from app.models.user import User
from app.models.vehicle_location import VehicleLocation
from app.schemas.tracking import LocationUpload, TripSummary


# ── Internal helpers ──────────────────────────────────────────────────────────

def _get_booking_or_404(db: Session, booking_id: UUID) -> Booking:
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Booking '{booking_id}' not found.",
        )
    return booking


def _assert_active(booking: Booking) -> None:
    """Raise HTTP 409 if the booking is not ACTIVE."""
    if booking.status != BookingStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                f"GPS location upload is only allowed for ACTIVE bookings. "
                f"This booking is '{booking.status.value}'."
            ),
        )


def _assert_can_view(booking: Booking, car: Car, current_user: User) -> None:
    """
    Raise HTTP 403 unless the caller is authorised to view this booking's data.
    - CUSTOMER : must own the booking
    - SHOWROOM : must own the car
    - ADMIN    : full access
    """
    if current_user.role == UserRole.ADMIN:
        return
    if current_user.role == UserRole.CUSTOMER:
        if str(booking.customer_id) != str(current_user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You may only view tracking data for your own bookings.",
            )
    elif current_user.role == UserRole.SHOWROOM:
        if str(car.owner_id) != str(current_user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You may only view tracking data for cars you own.",
            )


def _haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Return the great-circle distance in kilometres between two WGS-84 points
    using the Haversine formula.  Accurate to within ~0.5 % for typical trip
    distances.
    """
    R = 6371.0  # Earth's mean radius in km
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lam = math.radians(lon2 - lon1)
    a = math.sin(d_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(d_lam / 2) ** 2
    return R * 2 * math.asin(math.sqrt(a))


def _compute_distance(points: list[VehicleLocation]) -> float:
    """Return total Haversine distance (km) along an ordered sequence of pings."""
    total = 0.0
    for i in range(1, len(points)):
        total += _haversine_km(
            points[i - 1].latitude, points[i - 1].longitude,
            points[i].latitude,     points[i].longitude,
        )
    return round(total, 4)


# ── Public service functions ───────────────────────────────────────────────────

def record_location(
    db: Session,
    payload: LocationUpload,
    current_user: User,
) -> VehicleLocation:
    """
    Validate and persist one GPS ping.

    Checks:
      1. Booking must exist.
      2. Booking must be ACTIVE.
      3. Car must belong to the booking.
      4. Caller must be: the booking's customer, the car's owner (SHOWROOM),
         or ADMIN.  (Either the driver or the showroom device can push pings.)
    """
    booking = _get_booking_or_404(db, payload.booking_id)
    _assert_active(booking)

    # Verify the car matches what's on the booking
    if str(booking.car_id) != str(payload.car_id):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="The car_id does not match the car on this booking.",
        )

    car = db.query(Car).filter(Car.id == payload.car_id).first()
    if not car:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Car not found.",
        )

    # Authorise: customer driving, showroom device, or admin
    if current_user.role == UserRole.CUSTOMER:
        if str(booking.customer_id) != str(current_user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You may only upload tracking data for your own bookings.",
            )
    elif current_user.role == UserRole.SHOWROOM:
        if str(car.owner_id) != str(current_user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You may only upload tracking data for your own cars.",
            )
    # ADMIN: no restriction

    # Use device timestamp if provided, otherwise server time
    ts = payload.timestamp or datetime.now(timezone.utc)

    location = VehicleLocation(
        booking_id=payload.booking_id,
        car_id=payload.car_id,
        latitude=payload.latitude,
        longitude=payload.longitude,
        speed_kmh=payload.speed_kmh,
        heading=payload.heading,
        ignition_on=payload.ignition_on,
        fuel_percentage=payload.fuel_percentage,
        battery_voltage=payload.battery_voltage,
        odometer_km=payload.odometer_km,
        gps_accuracy=payload.gps_accuracy,
        timestamp=ts,
    )
    db.add(location)
    db.commit()
    db.refresh(location)
    return location


def get_live_location(
    db: Session,
    booking_id: UUID,
    current_user: User,
) -> VehicleLocation:
    """Return the most recent GPS ping for a booking."""
    booking = _get_booking_or_404(db, booking_id)
    car = db.query(Car).filter(Car.id == booking.car_id).first()
    _assert_can_view(booking, car, current_user)

    location = (
        db.query(VehicleLocation)
        .filter(VehicleLocation.booking_id == booking_id)
        .order_by(VehicleLocation.timestamp.desc())
        .first()
    )
    if not location:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No GPS data found for this booking yet.",
        )
    return location


def get_location_history(
    db: Session,
    booking_id: UUID,
    current_user: User,
    skip: int = 0,
    limit: int = 500,
) -> list[VehicleLocation]:
    """Return the full ordered GPS history for a booking, oldest-first."""
    booking = _get_booking_or_404(db, booking_id)
    car = db.query(Car).filter(Car.id == booking.car_id).first()
    _assert_can_view(booking, car, current_user)

    return (
        db.query(VehicleLocation)
        .filter(VehicleLocation.booking_id == booking_id)
        .order_by(VehicleLocation.timestamp.asc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_car_latest(
    db: Session,
    car_id: UUID,
    current_user: User,
) -> VehicleLocation:
    """Return the most recent GPS ping for a car across all its bookings."""
    car = db.query(Car).filter(Car.id == car_id).first()
    if not car:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Car not found.",
        )

    # Authorisation
    if current_user.role == UserRole.SHOWROOM:
        if str(car.owner_id) != str(current_user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You may only view tracking data for your own cars.",
            )
    elif current_user.role == UserRole.CUSTOMER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Customers may not query per-car tracking data.",
        )

    location = (
        db.query(VehicleLocation)
        .filter(VehicleLocation.car_id == car_id)
        .order_by(VehicleLocation.timestamp.desc())
        .first()
    )
    if not location:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No GPS data found for this car yet.",
        )
    return location


def get_trip_summary(
    db: Session,
    booking_id: UUID,
    current_user: User,
) -> TripSummary:
    """
    Compute aggregate trip statistics from the full location history.

    Returns:
        TripSummary with:
          - total_points     : number of GPS pings
          - distance_km      : Haversine sum over consecutive pings
          - average_speed_kmh: mean of all non-null speed_kmh readings
          - max_speed_kmh    : maximum speed reading
          - duration_minutes : elapsed time from first to last ping
          - first_seen / last_seen : boundary timestamps
          - latest_location  : most recent ping (useful for the live view)
    """
    booking = _get_booking_or_404(db, booking_id)
    car = db.query(Car).filter(Car.id == booking.car_id).first()
    _assert_can_view(booking, car, current_user)

    points: list[VehicleLocation] = (
        db.query(VehicleLocation)
        .filter(VehicleLocation.booking_id == booking_id)
        .order_by(VehicleLocation.timestamp.asc())
        .all()
    )

    if not points:
        return TripSummary(
            booking_id=booking_id,
            total_points=0,
            distance_km=0.0,
            average_speed_kmh=None,
            max_speed_kmh=None,
            duration_minutes=None,
            first_seen=None,
            last_seen=None,
            latest_location=None,
        )

    # Distance
    distance_km = _compute_distance(points)

    # Speed stats (only from pings that include a speed reading)
    speeds = [p.speed_kmh for p in points if p.speed_kmh is not None]
    avg_speed = round(sum(speeds) / len(speeds), 2) if speeds else None
    max_speed = round(max(speeds), 2) if speeds else None

    # Duration
    first_ts = points[0].timestamp
    last_ts  = points[-1].timestamp
    duration_minutes: float | None = None
    if first_ts and last_ts:
        # Ensure both are tz-aware before subtracting
        def _utc(dt: datetime) -> datetime:
            if dt.tzinfo is None:
                return dt.replace(tzinfo=timezone.utc)
            return dt

        delta = _utc(last_ts) - _utc(first_ts)
        duration_minutes = round(delta.total_seconds() / 60, 2)

    return TripSummary(
        booking_id=booking_id,
        total_points=len(points),
        distance_km=distance_km,
        average_speed_kmh=avg_speed,
        max_speed_kmh=max_speed,
        duration_minutes=duration_minutes,
        first_seen=first_ts,
        last_seen=last_ts,
        latest_location=points[-1],
    )
