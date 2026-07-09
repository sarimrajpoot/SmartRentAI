"""
Eye Aspect Ratio helper.

Previously used scipy.spatial.distance which is incompatible with NumPy >= 2.0.
Replaced with a direct numpy.linalg.norm call — identical result, no scipy dependency.
"""
import numpy as np


def eye_aspect_ratio(points):
    """
    Compute the Eye Aspect Ratio (EAR) for a set of 6 eye landmark points.

    EAR = (||p2-p6|| + ||p3-p5||) / (2 * ||p1-p4||)

    Args:
        points: list of 6 (x, y) tuples in the order:
                [outer_corner, upper1, upper2, inner_corner, lower2, lower1]

    Returns:
        float: EAR value (typically 0.2–0.4 when eyes are open)
    """
    p = [np.array(pt) for pt in points]
    A = np.linalg.norm(p[1] - p[5])
    B = np.linalg.norm(p[2] - p[4])
    C = np.linalg.norm(p[0] - p[3])
    return float((A + B) / (2.0 * C)) if C != 0 else 0.0