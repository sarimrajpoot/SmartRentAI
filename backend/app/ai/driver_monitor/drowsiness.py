import cv2

from app.ai.driver_monitor.face_mesh import (
    get_face_landmarks,
    LEFT_EYE,
    RIGHT_EYE,
)

from app.ai.driver_monitor.eye_utils import eye_aspect_ratio
from app.ai.driver_monitor.mouth import calculate_mar
from app.ai.driver_monitor.yawn import update_yawn_state
from app.ai.driver_monitor.config import EAR_THRESHOLD


def detect_drowsiness(image_path, state):

    image = cv2.imread(image_path)

    landmarks = get_face_landmarks(image_path)

    if landmarks is None:
        return {
            "drowsy": False,
            "ear": None,
            "yawn": None,
            "reason": "No face detected"
        }

    h, w, _ = image.shape

    points = []

    for landmark in landmarks.landmark:
        points.append(
            (
                landmark.x * w,
                landmark.y * h
            )
        )

    left_eye = [points[i] for i in LEFT_EYE]

    right_eye = [points[i] for i in RIGHT_EYE]

    left_ear = eye_aspect_ratio(left_eye)

    right_ear = eye_aspect_ratio(right_eye)

    ear = (left_ear + right_ear) / 2

    mar = calculate_mar(landmarks)
    
    yawn = update_yawn_state(mar, state)

    return {
        "drowsy": ear < EAR_THRESHOLD,
        "ear": round(ear, 3),
        "yawn": yawn,
        "reason": (
            "Eyes appear closed"
            if ear < EAR_THRESHOLD
            else "Eyes open"
        )
    }