from pathlib import Path
import shutil
import uuid

from fastapi import APIRouter, UploadFile, File

from app.ai.driver_monitor.detector import detect_objects
from app.ai.driver_monitor.phone import detect_phone_usage
from app.ai.driver_monitor.risk_score import calculate_risk
from app.ai.driver_monitor.drowsiness import detect_drowsiness
from app.ai.driver_monitor.state import driver_state
from app.ai.driver_monitor.blink import update_blink_state
from app.ai.driver_monitor.perclos import calculate_perclos

router = APIRouter(
    prefix="/driver-monitor",
    tags=["Driver Monitor"]
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/upload-frame")
async def upload_frame(image: UploadFile = File(...)):

    extension = Path(image.filename).suffix

    filename = f"{uuid.uuid4()}{extension}"

    destination = UPLOAD_DIR / filename

    with destination.open("wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    # -----------------------------
    # YOLO Detection
    # -----------------------------
    detections = detect_objects(str(destination))
    drowsiness = detect_drowsiness(str(destination))
    blink = update_blink_state(

    drowsiness["ear"],
    driver_state
    )

    perclos = calculate_perclos(driver_state)
    # -----------------------------
    # Phone Detection
    # -----------------------------
    phone_usage = detect_phone_usage(detections)

    # -----------------------------
    # Risk Score
    # -----------------------------
    risk = calculate_risk(
        phone_usage=phone_usage
    )

    # -----------------------------
    # API Response
    # -----------------------------
    return {
    "message": "Frame uploaded successfully.",
    "filename": filename,
    "detections": detections,
    "phone_usage": phone_usage,
    "risk_score": risk["risk_score"],
    "alerts": risk["alerts"],
    "drowsiness": drowsiness,
    "blink": blink,
    "perclos": perclos,
}