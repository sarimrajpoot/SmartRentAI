import cv2
import mediapipe as mp

mp_face_mesh = mp.solutions.face_mesh

face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=True,
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5
)


def get_face_landmarks(image_path):

    image = cv2.imread(image_path)

    rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    results = face_mesh.process(rgb)

    if not results.multi_face_landmarks:
        return None

    return results.multi_face_landmarks[0]

# Left Eye
LEFT_EYE = [33, 160, 158, 133, 153, 144]

# Right Eye
RIGHT_EYE = [362, 385, 387, 263, 373, 380]