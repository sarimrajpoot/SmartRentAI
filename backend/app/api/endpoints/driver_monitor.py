from pathlib import Path
import uuid

from fastapi import APIRouter, File, Header, HTTPException, UploadFile, status

from app.ai.driver_monitor.detector import detect_objects
from app.ai.driver_monitor.phone import detect_phone_usage
from app.ai.driver_monitor.risk_score import calculate_risk
from app.ai.driver_monitor.drowsiness import detect_drowsiness
from app.ai.driver_monitor.state_manager import driver_state_manager
from app.ai.driver_monitor.blink import update_blink_state
from app.ai.driver_monitor.perclos import calculate_perclos
from app.core.config import settings

router = APIRouter(
    prefix="/driver-monitor",
    tags=["Driver Monitor"]
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/upload-frame")
async def upload_frame(
    image: UploadFile = File(...),
    x_driver_session_id: str = Header(
        default="default",
        description=(
            "Unique identifier for the driver monitoring session. "
            "Pass a UUID tied to the active rental booking to isolate "
            "state per driver. Omit to use the shared default session."
        ),
    ),
):
    # -----------------------------
    # File Validation
    # -----------------------------
    if image.content_type not in settings.allowed_mime_types_list:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=(
                f"Unsupported file type '{image.content_type}'. "
                f"Allowed types: {', '.join(settings.allowed_mime_types_list)}"
            ),
        )

    content = await image.read()
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024

    if len(content) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=(
                f"File size exceeds the {settings.MAX_UPLOAD_SIZE_MB} MB limit."
            ),
        )

    # -----------------------------
    # Save Validated File
    # -----------------------------
    extension = Path(image.filename).suffix
    filename = f"{uuid.uuid4()}{extension}"
    destination = UPLOAD_DIR / filename
    destination.write_bytes(content)

    # -----------------------------
    # Per-Session Driver State
    # -----------------------------
    state = driver_state_manager.get_or_create(x_driver_session_id)

    # -----------------------------
    # YOLO Detection
    # -----------------------------
    detections = detect_objects(str(destination))
    drowsiness = detect_drowsiness(str(destination), state)
    blink = update_blink_state(

    drowsiness["ear"],
    state
    )

    perclos = calculate_perclos(state)
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