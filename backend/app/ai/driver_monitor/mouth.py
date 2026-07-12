import math


def distance(p1, p2):
    return math.sqrt(
        (p1.x - p2.x) ** 2 +
        (p1.y - p2.y) ** 2
    )


def calculate_mar(landmarks):
    """
    Mouth Aspect Ratio (MAR) using the standard dlib 68-point formula.
    """

    p60 = landmarks.part(60)
    p61 = landmarks.part(61)
    p62 = landmarks.part(62)
    p63 = landmarks.part(63)
    p64 = landmarks.part(64)
    p65 = landmarks.part(65)
    p66 = landmarks.part(66)
    p67 = landmarks.part(67)

    A = distance(p61, p67)
    B = distance(p62, p66)
    C = distance(p63, p65)

    D = distance(p60, p64)

    if D == 0:
        return 0.0

    mar = (A + B + C) / (3.0 * D)

    return mar