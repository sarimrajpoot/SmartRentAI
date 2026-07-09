import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure upload directories exist before the StaticFiles mount is registered
os.makedirs("uploads/cars", exist_ok=True)

# Serve uploaded car images (and any future upload subdirectories) at /uploads/*
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth_router)
app.include_router(cars_router)
app.include_router(booking_router)
app.include_router(driver_monitor_router)


@app.get("/")
def home():
    return {
        "message": "SmartRent AI Backend Running"
    }