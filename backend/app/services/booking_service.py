from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.enums.booking import BookingStatus
from app.models.booking import Booking
from app.models.car import Car
from app.schemas.booking import BookingCreate
from uuid import UUID
from typing import List
from datetime import date


def create_booking(
    db: Session,
    booking: BookingCreate,
    customer_id: UUID,
):

    car = db.query(Car).filter(
        Car.id == booking.car_id
    ).first()

    if car is None:
        raise HTTPException(
            status_code=404,
            detail="Car not found"
        )

    existing_booking = (
        db.query(Booking)
        .filter(
            Booking.car_id == booking.car_id,
            Booking.status.in_(
                [
                    BookingStatus.PENDING,
                    BookingStatus.CONFIRMED,
                    BookingStatus.ACTIVE,
                ]
            ),
            Booking.start_date <= booking.end_date,
            Booking.end_date >= booking.start_date,
        )
        .first()
    )

    if existing_booking:
        raise HTTPException(
            status_code=409,
            detail="Car is already booked for the selected dates."
        )

    days = (booking.end_date - booking.start_date).days

    if days <= 0:
        raise HTTPException(
            status_code=400,
            detail="Invalid booking dates"
        )

    total = days * car.daily_price

    db_booking = Booking(
        customer_id=customer_id,
        car_id=booking.car_id,
        start_date=booking.start_date,
        end_date=booking.end_date,
        total_price=total,
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)

    return db_booking

def get_customer_bookings(
    db: Session,
    customer_id,
):
    return (
        db.query(Booking)
        .filter(
            Booking.customer_id == customer_id
        )
        .order_by(
            Booking.created_at.desc()
        )
        .all()
    )

def get_owner_bookings(
    db: Session,
    owner_id,
):
    return (
        db.query(Booking)
        .join(Car, Booking.car_id == Car.id)
        .filter(Car.owner_id == owner_id)
        .order_by(Booking.created_at.desc())
        .all()
    )

def approve_booking(
    db: Session,
    booking_id: UUID,
    owner_id: UUID,
):
    booking = (
        db.query(Booking)
        .join(Car, Booking.car_id == Car.id)
        .filter(
            Booking.id == booking_id,
            Car.owner_id == owner_id
        )
        .first()
    )

    if booking is None:
        raise HTTPException(
            status_code=404,
            detail="Booking not found."
        )

    if booking.status != BookingStatus.PENDING:
        raise HTTPException(
            status_code=400,
            detail="Only pending bookings can be approved."
        )

    booking.status = BookingStatus.CONFIRMED

    db.commit()
    db.refresh(booking)

    return booking


def reject_booking(
    db: Session,
    booking_id: UUID,
    owner_id: UUID,
):
    booking = (
        db.query(Booking)
        .join(Car, Booking.car_id == Car.id)
        .filter(
            Booking.id == booking_id,
            Car.owner_id == owner_id
        )
        .first()
    )

    if booking is None:
        raise HTTPException(
            status_code=404,
            detail="Booking not found."
        )

    if booking.status != BookingStatus.PENDING:
        raise HTTPException(
            status_code=400,
            detail="Only pending bookings can be rejected."
        )

    booking.status = BookingStatus.REJECTED

    db.commit()
    db.refresh(booking)

    return booking

def start_booking(
    db: Session,
    booking_id: UUID,
    owner_id: UUID,
):
    booking = (
        db.query(Booking)
        .join(Car)
        .filter(
            Booking.id == booking_id,
            Car.owner_id == owner_id,
        )
        .first()
    )

    if booking is None:
        raise HTTPException(
            status_code=404,
            detail="Booking not found."
        )

    if booking.status != BookingStatus.CONFIRMED:
        raise HTTPException(
            status_code=400,
            detail="Only confirmed bookings can be started."
        )

    today = date.today()

    if today < booking.start_date:
        raise HTTPException(
            status_code=400,
            detail="Rental cannot start before the booking start date."
        )

    booking.status = BookingStatus.ACTIVE

    db.commit()
    db.refresh(booking)

    return booking

def complete_booking(
    db: Session,
    booking_id: UUID,
    owner_id: UUID,
):
    booking = (
        db.query(Booking)
        .join(Car)
        .filter(
            Booking.id == booking_id,
            Car.owner_id == owner_id,
        )
        .first()
    )

    if booking is None:
        raise HTTPException(
            status_code=404,
            detail="Booking not found."
        )

    if booking.status != BookingStatus.ACTIVE:
        raise HTTPException(
            status_code=400,
            detail="Only active bookings can be completed."
        )

    today = date.today()

    if today < booking.end_date:
        raise HTTPException(
            status_code=400,
            detail="Rental cannot be completed before the booking end date."
        )

    booking.status = BookingStatus.COMPLETED

    db.commit()
    db.refresh(booking)

    return booking