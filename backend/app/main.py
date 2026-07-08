from fastapi import FastAPI

from app.database.connection import Base, engine

import app.models

from app.api.endpoints.auth import router as auth_router
from app.api.endpoints.cars import router as cars_router
from app.api.endpoints.bookings import router as booking_router
from app.api.endpoints.driver_monitor import router as driver_monitor_router

app = FastAPI(
    title="SmartRent AI",
    version="1.0.0"
)

app.include_router(auth_router)
app.include_router(cars_router)
app.include_router(booking_router)
app.include_router(driver_monitor_router)

@app.get("/")
def home():
    return {
        "message": "SmartRent AI Backend Running"
    }