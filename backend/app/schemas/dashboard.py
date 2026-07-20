from pydantic import BaseModel
from uuid import UUID
from datetime import datetime, date

class ShowroomDashboardStats(BaseModel):
    total_vehicles: int
    available_vehicles: int
    active_rentals: int
    pending_requests: int
    monthly_revenue: float
    average_rating: float


class ShowroomCustomerListItem(BaseModel):
    id: UUID
    full_name: str
    email: str
    phone: str | None = None
    profile_picture: str | None = None
    is_verified: bool
    created_at: datetime | None = None
    cnic: str | None = None
    driving_license: str | None = None
    risk_score: float
    total_bookings: int
    active_bookings: int
    completed_bookings: int
    cancelled_bookings: int
    total_spending: float
    last_booking_date: date | None = None
    favorite_car: str | None = None


class ShowroomCustomerBookingItem(BaseModel):
    id: UUID
    car_brand: str
    car_model: str
    start_date: date
    end_date: date
    total_price: float
    status: str


class ShowroomCustomerSafetyEvent(BaseModel):
    id: UUID
    event_type: str
    severity: str
    title: str
    description: str
    created_at: datetime


class ShowroomCustomerDetail(BaseModel):
    id: UUID
    full_name: str
    email: str
    phone: str | None = None
    profile_picture: str | None = None
    is_verified: bool
    created_at: datetime | None = None
    cnic: str | None = None
    driving_license: str | None = None
    risk_score: float
    total_bookings: int
    active_bookings: int
    completed_bookings: int
    cancelled_bookings: int
    total_spending: float
    favorite_car: str | None = None
    bookings: list[ShowroomCustomerBookingItem]
    safety_events: list[ShowroomCustomerSafetyEvent]
    total_damage_reports: int


class ShowroomTrackingTelemetry(BaseModel):
    latitude: float
    longitude: float
    speed: float
    fuel_level: float
    battery_level: float
    ignition_on: bool
    last_updated: datetime


class ShowroomTrackingDriver(BaseModel):
    id: UUID
    full_name: str
    email: str
    phone: str | None = None


class ShowroomTrackingItem(BaseModel):
    id: UUID
    brand: str
    model: str
    year: int
    license_plate: str
    image_url: str | None = None
    images: list[str] = []
    status: str # ACTIVE, AVAILABLE, OFFLINE
    booking_id: UUID | None = None
    driver: ShowroomTrackingDriver | None = None
    telemetry: ShowroomTrackingTelemetry | None = None
    
    # AI Monitoring
    alertness: int | None = None
    drowsiness: str | None = None
    phone_usage: bool | None = None
    smoking: bool | None = None
    seatbelt_on: bool | None = None
    has_damage_alerts: bool = False
    remaining_minutes: int | None = None
