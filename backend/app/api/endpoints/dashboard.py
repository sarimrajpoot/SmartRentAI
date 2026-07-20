from datetime import datetime, date
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends

from app.core.dependencies import require_role
from app.database.dependencies import get_db
from app.enums.user import UserRole
from app.models.user import User
from app.models.car import Car
from app.models.booking import Booking
from app.schemas.dashboard import (
    ShowroomDashboardStats,
    ShowroomCustomerListItem,
    ShowroomCustomerBookingItem,
    ShowroomCustomerSafetyEvent,
    ShowroomCustomerDetail,
    ShowroomTrackingTelemetry,
    ShowroomTrackingDriver,
    ShowroomTrackingItem
)
from sqlalchemy import func
from uuid import UUID

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)

@router.get(
    "/showroom",
    response_model=ShowroomDashboardStats,
    summary="Get showroom dashboard statistics",
)
def get_showroom_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.SHOWROOM, UserRole.ADMIN)),
):
    """
    Returns statistics for the authenticated showroom owner.
    """
    owner_id = current_user.id
    
    # Vehicles stats
    total_vehicles = db.query(Car).filter(Car.owner_id == owner_id).count()
    available_vehicles = db.query(Car).filter(
        Car.owner_id == owner_id, 
        Car.is_available == True
    ).count()

    # Bookings stats
    # Join with Car to only get bookings for cars owned by this user
    base_booking_query = db.query(Booking).join(Car).filter(Car.owner_id == owner_id)
    
    active_rentals = base_booking_query.filter(Booking.status == "ACTIVE").count()
    pending_requests = base_booking_query.filter(Booking.status == "PENDING").count()

    # Monthly revenue calculation (for current month)
    today = date.today()
    start_of_month = date(today.year, today.month, 1)
    
    revenue_query = db.query(func.sum(Booking.total_price)).join(Car).filter(
        Car.owner_id == owner_id,
        Booking.status.in_(["ACTIVE", "COMPLETED"]),
        Booking.start_date >= start_of_month
    ).scalar()
    
    monthly_revenue = float(revenue_query) if revenue_query else 0.0

    return ShowroomDashboardStats(
        total_vehicles=total_vehicles,
        available_vehicles=available_vehicles,
        active_rentals=active_rentals,
        pending_requests=pending_requests,
        monthly_revenue=monthly_revenue,
        average_rating=4.7  # Hardcoded for now per the plan
    )


@router.get(
    "/showroom/customers",
    response_model=list[ShowroomCustomerListItem],
    summary="Get all unique customers for the showroom",
)
def get_showroom_customers(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.SHOWROOM, UserRole.ADMIN)),
):
    owner_id = current_user.id
    
    # Imports
    from app.models.booking import Booking
    from app.models.car import Car
    from app.models.user import User

    # Query unique customers who booked this showroom's cars
    customers = (
        db.query(User)
        .join(Booking, Booking.customer_id == User.id)
        .join(Car, Car.id == Booking.car_id)
        .filter(Car.owner_id == owner_id)
        .distinct()
        .all()
    )
    
    result = []
    for customer in customers:
        bookings = db.query(Booking).join(Car).filter(Car.owner_id == owner_id, Booking.customer_id == customer.id).all()
        
        active_bookings = sum(1 for b in bookings if b.status == "ACTIVE")
        completed_bookings = sum(1 for b in bookings if b.status == "COMPLETED")
        cancelled_bookings = sum(1 for b in bookings if b.status == "CANCELLED")
        total_bookings = len(bookings)
        
        total_spending = sum(float(b.total_price) for b in bookings if b.status in ["ACTIVE", "COMPLETED"])
        last_booking = max(b.start_date for b in bookings) if bookings else None
        
        # Calculate favorite vehicle
        car_counts = {}
        for b in bookings:
            car_counts[b.car_id] = car_counts.get(b.car_id, 0) + 1
        
        favorite_car_str = "None"
        if car_counts:
            fav_car_id = max(car_counts, key=car_counts.get)
            fav_car = db.query(Car).filter(Car.id == fav_car_id).first()
            if fav_car:
                favorite_car_str = f"{fav_car.brand} {fav_car.model}"
                
        result.append({
            "id": customer.id,
            "full_name": customer.full_name,
            "email": customer.email,
            "phone": customer.phone,
            "profile_picture": customer.profile_picture,
            "is_verified": customer.is_verified,
            "created_at": customer.created_at,
            "cnic": customer.cnic,
            "driving_license": customer.driving_license,
            "risk_score": customer.risk_score,
            
            "total_bookings": total_bookings,
            "active_bookings": active_bookings,
            "completed_bookings": completed_bookings,
            "cancelled_bookings": cancelled_bookings,
            "total_spending": total_spending,
            "last_booking_date": last_booking,
            "favorite_car": favorite_car_str,
        })
        
    return result


@router.get(
    "/showroom/customers/{customer_id}",
    response_model=ShowroomCustomerDetail,
    summary="Get details of a specific showroom customer",
)
def get_showroom_customer_detail(
    customer_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.SHOWROOM, UserRole.ADMIN)),
):
    owner_id = current_user.id
    
    # Imports
    from app.models.booking import Booking
    from app.models.car import Car
    from app.models.user import User
    from app.models.vehicle_event import VehicleEvent
    from app.models.damage_report import DamageReport

    customer = db.query(User).filter(User.id == customer_id).first()
    if not customer:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Customer not found")
        
    bookings = db.query(Booking).join(Car).filter(Car.owner_id == owner_id, Booking.customer_id == customer_id).all()
    
    active_bookings = sum(1 for b in bookings if b.status == "ACTIVE")
    completed_bookings = sum(1 for b in bookings if b.status == "COMPLETED")
    cancelled_bookings = sum(1 for b in bookings if b.status == "CANCELLED")
    total_bookings = len(bookings)
    
    total_spending = sum(float(b.total_price) for b in bookings if b.status in ["ACTIVE", "COMPLETED"])
    
    # Calculate favorite vehicle
    car_counts = {}
    for b in bookings:
        car_counts[b.car_id] = car_counts.get(b.car_id, 0) + 1
    
    favorite_car_str = "None"
    if car_counts:
        fav_car_id = max(car_counts, key=car_counts.get)
        fav_car = db.query(Car).filter(Car.id == fav_car_id).first()
        if fav_car:
            favorite_car_str = f"{fav_car.brand} {fav_car.model}"
            
    # Booking History response mapping
    booking_items = [
        ShowroomCustomerBookingItem(
            id=b.id,
            car_brand=b.car.brand,
            car_model=b.car.model,
            start_date=b.start_date,
            end_date=b.end_date,
            total_price=float(b.total_price),
            status=b.status
        )
        for b in bookings
    ]

    # Safety events
    safety_events = (
        db.query(VehicleEvent)
        .join(Booking)
        .filter(Booking.customer_id == customer_id)
        .order_by(VehicleEvent.created_at.desc())
        .all()
    )
    
    safety_items = [
        ShowroomCustomerSafetyEvent(
            id=e.id,
            event_type=e.event_type.value if hasattr(e.event_type, 'value') else str(e.event_type),
            severity=e.severity.value if hasattr(e.severity, 'value') else str(e.severity),
            title=e.title,
            description=e.description,
            created_at=e.created_at
        )
        for e in safety_events
    ]
    
    # Damage reports count
    total_damage_reports = (
        db.query(DamageReport)
        .join(Booking)
        .filter(Booking.customer_id == customer_id)
        .count()
    )
    
    return ShowroomCustomerDetail(
        id=customer.id,
        full_name=customer.full_name,
        email=customer.email,
        phone=customer.phone,
        profile_picture=customer.profile_picture,
        is_verified=customer.is_verified,
        created_at=customer.created_at,
        cnic=customer.cnic,
        driving_license=customer.driving_license,
        risk_score=customer.risk_score,
        
        total_bookings=total_bookings,
        active_bookings=active_bookings,
        completed_bookings=completed_bookings,
        cancelled_bookings=cancelled_bookings,
        total_spending=total_spending,
        favorite_car=favorite_car_str,
        bookings=booking_items,
        safety_events=safety_items,
        total_damage_reports=total_damage_reports
    )


@router.get(
    "/showroom/tracking",
    response_model=list[ShowroomTrackingItem],
    summary="Get tracking status of all fleet vehicles",
)
def get_showroom_tracking(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.SHOWROOM, UserRole.ADMIN)),
):
    owner_id = current_user.id
    
    # Imports
    from app.models.booking import Booking
    from app.models.car import Car
    from app.models.vehicle_location import VehicleLocation
    from app.models.damage_report import DamageReport
    import datetime

    cars = db.query(Car).filter(Car.owner_id == owner_id).all()
    
    result = []
    for car in cars:
        # Find active booking (if any)
        active_booking = db.query(Booking).filter(
            Booking.car_id == car.id,
            Booking.status == "ACTIVE"
        ).first()
        
        status = "AVAILABLE"
        driver_info = None
        telemetry_info = None
        
        alertness = None
        drowsiness = None
        phone_usage = None
        smoking = None
        seatbelt_on = None
        has_damage_alerts = False
        remaining_minutes = None
        
        if active_booking:
            status = "ACTIVE"
            driver = active_booking.customer
            driver_info = ShowroomTrackingDriver(
                id=driver.id,
                full_name=driver.full_name,
                email=driver.email,
                phone=driver.phone
            )
            
            # Remaining time
            if active_booking.end_date:
                end_dt = datetime.datetime.combine(active_booking.end_date, datetime.time.min)
                now = datetime.datetime.utcnow()
                diff = end_dt - now
                remaining_minutes = max(0, int(diff.total_seconds() / 60))
            
            # AI Monitor values
            alertness = 95
            drowsiness = "None"
            phone_usage = False
            smoking = False
            seatbelt_on = True
            
            # Check for damage reports
            has_damage_alerts = db.query(DamageReport).filter(
                DamageReport.booking_id == active_booking.id
            ).count() > 0
        
        # Query latest location ping
        latest_loc = db.query(VehicleLocation).filter(
            VehicleLocation.car_id == car.id
        ).order_by(VehicleLocation.timestamp.desc()).first()
        
        if latest_loc:
            telemetry_info = ShowroomTrackingTelemetry(
                latitude=latest_loc.latitude,
                longitude=latest_loc.longitude,
                speed=latest_loc.speed_kmh or 0.0,
                fuel_level=latest_loc.fuel_percentage or 100.0,
                battery_level=latest_loc.battery_voltage or 12.6,
                ignition_on=latest_loc.ignition_on or False,
                last_updated=latest_loc.timestamp
            )
        else:
            # If no active booking and no location, let's mark it as AVAILABLE/OFFLINE
            # For the tracking dashboard map, if active booking, we want a placeholder location if db is empty
            if active_booking:
                # Sydney center simulated location
                telemetry_info = ShowroomTrackingTelemetry(
                    latitude=-33.8688,
                    longitude=151.2093,
                    speed=45.0,
                    fuel_level=85.0,
                    battery_level=12.4,
                    ignition_on=True,
                    last_updated=datetime.datetime.utcnow()
                )
            else:
                status = "OFFLINE"
        
        result.append(ShowroomTrackingItem(
            id=car.id,
            brand=car.brand,
            model=car.model,
            year=car.year,
            license_plate=car.license_plate,
            image_url=car.image_url,
            images=car.images or [],
            status=status,
            booking_id=active_booking.id if active_booking else None,
            driver=driver_info,
            telemetry=telemetry_info,
            alertness=alertness,
            drowsiness=drowsiness,
            phone_usage=phone_usage,
            smoking=smoking,
            seatbelt_on=seatbelt_on,
            has_damage_alerts=has_damage_alerts,
            remaining_minutes=remaining_minutes
        ))
        
    return result
