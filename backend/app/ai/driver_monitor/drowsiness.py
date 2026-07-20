import cv2

from app.ai.driver_monitor.face_landmarks import (
    get_face_landmarks,
    LEFT_EYE,
    RIGHT_EYE,
)

from app.ai.driver_monitor.eye_utils import eye_aspect_ratio
from app.ai.driver_monitor.mouth import calculate_mar
from app.ai.driver_monitor.yawn import update_yawn_state
from app.ai.driver_monitor.config import EAR_THRESHOLD
from app.ai.driver_monitor.head_pose import get_head_pose


def detect_drowsiness(image_data, state):

    landmarks = get_face_landmarks(image_data)

    if landmarks is None:
        return {
            "drowsy": False,
            "ear": None,
            "yawn": None,
            "reason": "No face detected"
        }

    left_eye = [
        (landmarks.part(i).x, landmarks.part(i).y)
        for i in LEFT_EYE
    ]

    right_eye = [
        (landmarks.part(i).x, landmarks.part(i).y)
        for i in RIGHT_EYE
    ]

    left_ear = eye_aspect_ratio(left_eye)
    right_ear = eye_aspect_ratio(right_eye)

    ear = (left_ear + right_ear) / 2

    mar = calculate_mar(landmarks)

    yawn = update_yawn_state(mar, state)
    
    head_pose = get_head_pose(landmarks, image_data.shape)

    return {
        "drowsy": ear < EAR_THRESHOLD,
        "ear": round(ear, 3),
        "left_ear": round(left_ear, 3),
        "right_ear": round(right_ear, 3),
        "yawn": yawn,
        "head_pose": head_pose,
        "looking_away": head_pose["looking_away"],
        "reason": (
            "Eyes appear closed"
            if ear < EAR_THRESHOLD
            else "Eyes open"
        ),
        "left_eye": left_eye,
        "right_eye": right_eye,
        "face_box": [
            min([p.x for p in landmarks.parts()]),
            min([p.y for p in landmarks.parts()]),
            max([p.x for p in landmarks.parts()]),
            max([p.y for p in landmarks.parts()])
        ]
    }