import cv2
import numpy as np
import os
import uuid

# Configuration for simulated outputs
SIMULATED_DAMAGES = [
    {"part": "Front Bumper", "type": "Scratch", "severity": "Minor", "repair_cost_est": 150.00},
    {"part": "Left Fender", "type": "Dent", "severity": "Moderate", "repair_cost_est": 350.00}
]

def analyze_damage(before_img_bytes: bytes, after_img_bytes: bytes, output_dir: str) -> dict:
    """
    Simulates a Deep Learning model that compares 'Before' and 'After' images.
    Draws a simulated damage bounding box on the 'After' image.
    """
    # Decode images
    before_np = np.frombuffer(before_img_bytes, np.uint8)
    after_np = np.frombuffer(after_img_bytes, np.uint8)
    
    before_img = cv2.imdecode(before_np, cv2.IMREAD_COLOR)
    after_img = cv2.imdecode(after_np, cv2.IMREAD_COLOR)
    
    # Save original before/after for reference
    os.makedirs(output_dir, exist_ok=True)
    before_filename = f"{uuid.uuid4()}_before.jpg"
    after_filename = f"{uuid.uuid4()}_after.jpg"
    annotated_filename = f"{uuid.uuid4()}_annotated.jpg"
    
    cv2.imwrite(os.path.join(output_dir, before_filename), before_img)
    cv2.imwrite(os.path.join(output_dir, after_filename), after_img)
    
    # Draw simulated damage overlay on the 'After' image
    # We will randomly place a couple of bounding boxes
    h, w = after_img.shape[:2]
    
    annotated_img = after_img.copy()
    
    # Simulated Box 1
    x1, y1 = int(w * 0.1), int(h * 0.2)
    x2, y2 = int(w * 0.3), int(h * 0.4)
    cv2.rectangle(annotated_img, (x1, y1), (x2, y2), (0, 0, 255), 3)
    cv2.putText(annotated_img, "Scratch (87%)", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
    
    # Simulated Box 2
    x3, y3 = int(w * 0.6), int(h * 0.6)
    x4, y4 = int(w * 0.8), int(h * 0.8)
    cv2.rectangle(annotated_img, (x3, y3), (x4, y4), (0, 165, 255), 3) # Orange
    cv2.putText(annotated_img, "Dent (92%)", (x3, y3 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 165, 255), 2)
    
    cv2.imwrite(os.path.join(output_dir, annotated_filename), annotated_img)
    
    # Calculate simulated metrics
    total_cost = sum(d["repair_cost_est"] for d in SIMULATED_DAMAGES)
    condition_score = 100 - (len(SIMULATED_DAMAGES) * 10)
    
    return {
        "before_image_filename": before_filename,
        "after_image_filename": after_filename,
        "annotated_image_filename": annotated_filename,
        "condition_score": condition_score,
        "total_repair_cost": total_cost,
        "damages": SIMULATED_DAMAGES
    }
