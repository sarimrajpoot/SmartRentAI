import math


def distance(p1, p2):
    return math.sqrt(
        (p1.x - p2.x) ** 2 +
        (p1.y - p2.y) ** 2
    )


def calculate_mar(landmarks):
    """
    Mouth Aspect Ratio (MAR) using dlib 68-point inner lips.
    Inner lips provide a much stronger signal-to-noise ratio for yawning vs talking.
    """
    # Inner lip corners
    p60 = landmarks.part(60) # Left corner
    p64 = landmarks.part(64) # Right corner
    
    # Inner lip vertical points
    p61 = landmarks.part(61)
    p67 = landmarks.part(67)
    
    p62 = landmarks.part(62) # Top middle
    p66 = landmarks.part(66) # Bottom middle
    
    p63 = landmarks.part(63)
    p65 = landmarks.part(65)

    # Vertical distances
    A = distance(p61, p67)
    B = distance(p62, p66)
    C = distance(p63, p65)

    # Horizontal distance
    D = distance(p60, p64)

    if D == 0:
        return 0.0

    mar = (A + B + C) / (3.0 * D)
    
    print(f"[MAR DEBUG] V1: {A:.2f}, V2: {B:.2f}, V3: {C:.2f}, H: {D:.2f}, Computed MAR: {mar:.3f}")

    return mar