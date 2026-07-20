# """
# Driver Monitor endpoint — real-time driver safety analysis.

# Pipeline (called in order):
#     1. detect_objects()      → YOLO: list of {class, confidence} dicts
#     2. detect_drowsiness()   → MediaPipe face mesh: {drowsy, ear, yawn{mar,yawning,yawn_count}, reason}
#     3. update_blink_state()  → {blink_count, closed_frames, eye_closed}
#     4. calculate_perclos()   → {perclos, fatigue}
#     5. detect_phone_usage()  → bool
#     6. calculate_risk()      → {risk_score, alerts}

# Response shape (stable contract for the frontend):
#     {
#         "session_id":     str,
#         "risk_score":     int,          # 0–100
#         "alerts":         list[str],
#         "drowsy":         bool,
#         "ear":            float | null,
#         "blink_count":    int,
#         "eye_closed":     bool,
#         "perclos":        float,        # percentage 0–100
#         "fatigue_level":  str,          # "Alert" | "Slightly Fatigued" | …
#         "yawn_count":     int,
#         "mar":            float | null,
#         "phone_detected": bool,
#         "detections":     list[dict],
#     }
# """

import uuid
import cv2
import numpy as np
from pathlib import Path

from fastapi import APIRouter, Depends, File, Header, HTTPException, UploadFile, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.ai.driver_monitor.blink import update_blink_state
from app.ai.driver_monitor.detector import detect_objects
from app.ai.driver_monitor.drowsiness import detect_drowsiness
from app.ai.driver_monitor.perclos import calculate_perclos
from app.ai.driver_monitor.phone import detect_phone_usage
from app.ai.driver_monitor.risk_score import calculate_risk
from app.ai.driver_monitor.state_manager import driver_state_manager
from app.core.config import settings
from app.core.dependencies import get_current_user
from app.database.dependencies import get_db
from app.models.user import User

router = APIRouter(
    prefix="/driver-monitor",
    tags=["Driver Monitor"],
)

_FRAME_DIR = Path("uploads/frames")
_FRAME_DIR.mkdir(parents=True, exist_ok=True)


@router.post(
    "/upload-frame",
    summary="Analyse a driver webcam frame",
)
async def upload_frame(
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    x_driver_session_id: str | None = Header(
        None,
        alias="X-Driver-Session-ID",
        description=(
            "Unique session identifier tied to an active rental booking. "
            "Omit to use the authenticated user's ID as the session key."
        ),
    ),
    current_user: User = Depends(get_current_user),
):
    # ── 1. MIME validation ───────────────────────────────────────────────────
    if image.content_type not in settings.allowed_mime_types_list:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=(
                f"Unsupported file type '{image.content_type}'. "
                f"Allowed types: {', '.join(settings.allowed_mime_types_list)}"
            ),
        )

    content = await image.read()

    # ── 2. Size validation ───────────────────────────────────────────────────
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(content) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size exceeds the {settings.MAX_UPLOAD_SIZE_MB} MB limit.",
        )

    # ── 3. Read frame into memory (No Disk I/O) ────────────────────────────
    nparr = np.frombuffer(content, np.uint8)
    image_data = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if image_data is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to decode image data.",
        )

    try:
        # ── 4. Per-session state ─────────────────────────────────────────────
        session_id = x_driver_session_id or str(current_user.id)
        state = driver_state_manager.get_or_create(session_id)

        # ── 5. Full AI pipeline ──────────────────────────────────────────────
        # Returns: list[{class: str, confidence: float}]
        detections = detect_objects(image_data)

        # Returns: {drowsy, ear, yawn: {mar, yawning, yawn_count}, reason, head_pose, looking_away}
        drowsiness = detect_drowsiness(image_data, state)

        # Returns: {blink_count, closed_frames, eye_closed}
        blink = update_blink_state(drowsiness.get("ear"), state)

        # Returns: {perclos: float (0-100), fatigue: str}
        perclos = calculate_perclos(state)

        # Returns: bool  (person + cell phone both in frame)
        phone_detected = detect_phone_usage(detections)
        
        looking_away = drowsiness.get("looking_away", False)

        # Returns: {risk_score: int, alerts: list[str], attention_score: float}
        risk = calculate_risk(
            state=state, 
            perclos_data=perclos, 
            phone_usage=phone_detected, 
            looking_away=looking_away
        )

        print(f"\n[AI Calibration] Session {session_id}")
        print(f"EAR Average: {drowsiness.get('ear')} | MAR: {drowsiness.get('yawn', {}).get('mar')}")
        print(f"Blink Count: {blink.get('blink_count')} | Yawn Count: {state.yawn_count}")
        print(f"PERCLOS: {perclos.get('perclos')}% | Attention Score: {risk.get('attention_score')}")
        print("-" * 50)

    except Exception as e:
        print(f"Error in pipeline: {e}")
        raise HTTPException(status_code=500, detail=str(e))

    # ── 6. Flatten into a stable, frontend-friendly response ─────────────────
    yawn_info = drowsiness.get("yawn") or {}
    response = {
        "session_id":    session_id,
        # Top-level risk
        "risk_score":    risk["risk_score"],
        "alerts":        risk["alerts"],
        # Drowsiness
        "drowsy":        drowsiness.get("drowsy", False),
        "ear":           drowsiness.get("ear"),
        "left_ear":      drowsiness.get("left_ear"),
        "right_ear":     drowsiness.get("right_ear"),
        "face_reason":   drowsiness.get("reason", ""),
        "left_eye":      drowsiness.get("left_eye"),
        "right_eye":     drowsiness.get("right_eye"),
        "face_box":      drowsiness.get("face_box"),
        # Blink
        "blink_count":   blink.get("blink_count", 0) if isinstance(blink, dict) else blink,
        "eye_closed":    blink.get("eye_closed", False) if isinstance(blink, dict) else False,
        # PERCLOS / fatigue / attention
        "perclos":       perclos.get("perclos", 0.0) if isinstance(perclos, dict) else perclos,
        "fatigue_level": perclos.get("fatigue", "Unknown") if isinstance(perclos, dict) else "Unknown",
        "attention_score": risk.get("attention_score", 100),
        "looking_away":  drowsiness.get("looking_away", False),
        # Yawn
        "yawn_count":    yawn_info.get("yawn_count", state.yawn_count),
        "mar":           yawn_info.get("mar"),
        # Phone
        "phone_detected": phone_detected,
        # Raw detections (for debugging / future features)
        "detections":    detections,
    }
    return JSONResponse(content=response)