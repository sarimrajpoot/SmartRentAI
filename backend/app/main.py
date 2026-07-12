from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"status": "OK"}

# import os

# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.staticfiles import StaticFiles

# from app.core.config import settings
# from app.database.connection import Base, engine

# import app.models  # noqa: F401 — ensures all models are registered with SQLAlchemy

from app.api.endpoints.auth import router as auth_router
from app.api.endpoints.cars import router as cars_router
from app.api.endpoints.bookings import router as booking_router
from app.api.endpoints.driver_monitor import router as driver_monitor_router
from app.api.endpoints.tracking import router as tracking_router

# app = FastAPI(
#     title="SmartRent AI",
#     version="1.0.0",
#     description="AI-powered car rental platform",
# )

# # ── CORS middleware ────────────────────────────────────────────────────────────
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=settings.cors_origins_list,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ── API Routers ─────────────────────────────────────────────────────────────────
# # IMPORTANT: include_router MUST come before app.mount() calls.
# # Mounting a StaticFiles app calls router.include_router internally and
# # can prevent subsequent include_router calls from registering routes.
app.include_router(auth_router)
app.include_router(cars_router)
app.include_router(booking_router)
app.include_router(driver_monitor_router)
app.include_router(tracking_router)

# # ── Static file serving ─────────────────────────────────────────────────────────
# # Mounted AFTER routers — mounting before include_router silently drops all routes.
# os.makedirs("uploads/cars",   exist_ok=True)
# os.makedirs("uploads/frames", exist_ok=True)
# app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


# @app.get("/")
# def home():
#     return {"message": "SmartRent AI Backend Running"}