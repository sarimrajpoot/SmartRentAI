def detect_phone_usage(detections):
    """
    Determines whether a phone is being used based on YOLO detections.
    """

    person_detected = False
    phone_detected = False

    for detection in detections:

        if detection["class"] == "person":
            person_detected = True

        if detection["class"] == "cell phone":
            phone_detected = True

    return person_detected and phone_detected