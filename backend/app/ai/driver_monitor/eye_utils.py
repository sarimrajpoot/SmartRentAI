from scipy.spatial import distance


def eye_aspect_ratio(points):

    A = distance.euclidean(points[1], points[5])

    B = distance.euclidean(points[2], points[4])

    C = distance.euclidean(points[0], points[3])

    ear = (A + B) / (2.0 * C)

    return ear