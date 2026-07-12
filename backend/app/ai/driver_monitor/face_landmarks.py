import cv2
import dlib
from pathlib import Path
# ------------------------------------------------------------------
# Dlib models
# ------------------------------------------------------------------

_detector = dlib.get_frontal_face_detector()

_model_path = (
    Path(__file__).resolve().parents[1]
    / "models"
    / "shape_predictor_68_face_landmarks.dat"
)

_predictor = dlib.shape_predictor(str(_model_path))


def get_face_landmarks(image_path):
    """
    Returns a dlib.full_object_detection object
    or None if no face is detected.
    """

    image = cv2.imread(image_path)

    if image is None:
        return None

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    faces = _detector(gray)

    if len(faces) == 0:
        return None

    return _predictor(gray, faces[0])


# ------------------------------------------------------------------
# Landmark indices (Dlib 68-point model)
# ------------------------------------------------------------------

LEFT_EYE = [36, 37, 38, 39, 40, 41]

RIGHT_EYE = [42, 43, 44, 45, 46, 47]