"""
Theft Detection Service

Analyses every GPS update and generates security events.
"""

from app.enums.vehicle_event import (
    VehicleEventSeverity,
    VehicleEventType,
)
from app.models.vehicle_location import VehicleLocation

MOVEMENT_THRESHOLD_KMH = 5.0


def analyze_location(location: VehicleLocation):
    """
    Analyse a newly received GPS location.

    Returns:
        list[dict]
    """

    events = []

    speed = location.speed_kmh or 0.0

    if (
        location.ignition_on is False
        and speed > MOVEMENT_THRESHOLD_KMH
    ):
        events.append(
            {
                "event_type": VehicleEventType.UNEXPECTED_MOVEMENT,
                "severity": VehicleEventSeverity.CRITICAL,
                "title": "Unexpected Vehicle Movement",
                "description": (
                    f"Vehicle is moving at {speed:.1f} km/h "
                    "while ignition is OFF."
                ),
            }
        )

    return events