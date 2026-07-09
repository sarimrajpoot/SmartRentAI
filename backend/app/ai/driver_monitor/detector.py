from ultralytics import YOLO

model = None


def get_model():
    global model

    if model is None:
        print("Loading YOLO model...")
        model = YOLO("yolov8n.pt")
        print("YOLO model loaded.")

    return model


def detect_objects(image_path: str):

    model = get_model()

    results = model(image_path)

    detections = []

    for result in results:
        for box in result.boxes:
            cls = int(box.cls[0])
            confidence = float(box.conf[0])

            detections.append(
                {
                    "class": result.names[cls],
                    "confidence": round(confidence, 3),
                }
            )

    return detections
# from ultralytics import YOLO

# # Load once when the server starts
# model = YOLO("yolov8n.pt")


# def detect_objects(image_path: str):

#     results = model(image_path)

#     detections = []

#     for result in results:

#         for box in result.boxes:

#             cls = int(box.cls[0])

#             confidence = float(box.conf[0])

#             detections.append(
#                 {
#                     "class": result.names[cls],
#                     "confidence": round(confidence, 3),
#                 }
#             )

#     return detections