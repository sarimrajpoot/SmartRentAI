import mediapipe as mp

print("Before")

face_mesh = mp.solutions.face_mesh.FaceMesh(
    static_image_mode=True,
    max_num_faces=1,
)

print("After")