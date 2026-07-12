"""
Pydantic schemas for GPS Tracking & Vehicle Telemetry.

LocationUpload  — inbound payload from the GPS device / frontend.
LocationResponse — outbound single-location row.
TripSummary     — computed aggregate: distance, avg speed, duration.
"""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class LocationUpload(BaseModel):
    """
    GPS ping pushed by the in-vehicle device or the rental frontend.
    Coordinate ranges are enforced at the schema level (HTTP 422 on failure).
    """

    booking_id: UUID
    car_id: UUID

    # ── Position ──────────────────────────────────────────────────────────────
    latitude: float = Field(..., ge=-90.0, le=90.0,
                            description="WGS-84 latitude in decimal degrees")
    longitude: float = Field(..., ge=-180.0, le=180.0,
                             description="WGS-84 longitude in decimal degrees")

    # ── Motion ────────────────────────────────────────────────────────────────
    speed_kmh: float | None = Field(None, ge=0.0, le=500.0,
                                    description="Speed in km/h (0–500)")
    heading: float | None = Field(None, ge=0.0, lt=360.0,
                                  description="Compass heading in degrees (0–359.9)")

    # ── Vehicle state ─────────────────────────────────────────────────────────
    ignition_on: bool | None = None
    fuel_percentage: float | None = Field(None, ge=0.0, le=100.0)
    battery_voltage: float | None = Field(None, ge=0.0, le=30.0,
                                          description="Vehicle battery voltage (V)")
    odometer_km: float | None = Field(None, ge=0.0)
    gps_accuracy: float | None = Field(None, ge=0.0,
                                       description="Estimated position error in metres")

    # ── Optional device timestamp ─────────────────────────────────────────────
    # If provided, use the device clock; otherwise the server sets it.
    timestamp: datetime | None = None


class LocationResponse(BaseModel):
    """Single GPS location row returned to the client."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    booking_id: UUID
    car_id: UUID
    latitude: float
    longitude: float
    speed_kmh: float | None = None
    heading: float | None = None
    ignition_on: bool | None = None
    fuel_percentage: float | None = None
    battery_voltage: float | None = None
    odometer_km: float | None = None
    gps_accuracy: float | None = None
    timestamp: datetime


class TripSummary(BaseModel):
    """Aggregated trip statistics computed from the location history."""

    booking_id: UUID
    total_points: int
    distance_km: float = Field(description="Haversine total distance in km")
    average_speed_kmh: float | None = Field(
        None, description="Mean of all non-null speed readings"
    )
    max_speed_kmh: float | None = None
    duration_minutes: float | None = Field(
        None, description="Minutes between first and last ping"
    )
    first_seen: datetime | None = None
    last_seen: datetime | None = None
    latest_location: LocationResponse | None = None
