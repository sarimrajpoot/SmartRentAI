import math


def distance(p1, p2):
    return math.sqrt(
        (p1.x - p2.x) ** 2 +
        (p1.y - p2.y) ** 2
    )


def calculate_mar(face_landmarks):
    """
    MAR = Mouth Aspect Ratio
    """

    upper = face_landmarks.landmark[13]
    lower = face_landmarks.landmark[14]

    left = face_landmarks.landmark[78]
    right = face_landmarks.landmark[308]

    vertical = distance(upper, lower)
    horizontal = distance(left, right)

    if horizontal == 0:
        return 0

    return vertical / horizontal