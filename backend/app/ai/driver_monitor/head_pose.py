import cv2
import numpy as np
import math

def get_head_pose(landmarks, image_shape):
    """
    Compute head pose (yaw, pitch, roll) from dlib landmarks using solvePnP.
    """
    # 2D image points from dlib landmarks
    image_points = np.array([
        (landmarks.part(30).x, landmarks.part(30).y),     # Nose tip
        (landmarks.part(8).x, landmarks.part(8).y),       # Chin
        (landmarks.part(36).x, landmarks.part(36).y),     # Left eye left corner
        (landmarks.part(45).x, landmarks.part(45).y),     # Right eye right corner
        (landmarks.part(48).x, landmarks.part(48).y),     # Left Mouth corner
        (landmarks.part(54).x, landmarks.part(54).y)      # Right mouth corner
    ], dtype="double")

    # 3D model points
    model_points = np.array([
        (0.0, 0.0, 0.0),             # Nose tip
        (0.0, -330.0, -65.0),        # Chin
        (-225.0, 170.0, -135.0),     # Left eye left corner
        (225.0, 170.0, -135.0),      # Right eye right corner
        (-150.0, -150.0, -125.0),    # Left Mouth corner
        (150.0, -150.0, -125.0)      # Right mouth corner
    ])

    # Camera internals
    focal_length = image_shape[1]
    center = (image_shape[1]/2, image_shape[0]/2)
    camera_matrix = np.array(
        [[focal_length, 0, center[0]],
         [0, focal_length, center[1]],
         [0, 0, 1]], dtype="double"
    )

    dist_coeffs = np.zeros((4,1)) # Assuming no lens distortion
    
    (success, rotation_vector, translation_vector) = cv2.solvePnP(
        model_points, image_points, camera_matrix, dist_coeffs, flags=cv2.SOLVEPNP_ITERATIVE
    )

    # Convert rotation vector to rotation matrix
    rmat, jac = cv2.Rodrigues(rotation_vector)
    
    # Extract Euler angles from rotation matrix
    angles, mtxR, mtxQ, Qx, Qy, Qz = cv2.RQDecomp3x3(rmat)
    
    pitch, yaw, roll = angles[0], angles[1], angles[2]

    return {
        "pitch": round(pitch, 2),
        "yaw": round(yaw, 2),
        "roll": round(roll, 2),
        "looking_away": abs(yaw) > 30 or abs(pitch) > 25
    }
