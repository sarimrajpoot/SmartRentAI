from app.ai.driver_monitor.config import EAR_THRESHOLD

MIN_FRAMES = 1

def update_blink_state(ear, state):

    state.total_frames += 1

    if ear is None:
        state.frame_history.append(False)
        return {
            "blink_count": state.blink_count,
            "closed_frames": state.closed_frames,
            "eye_closed": False
        }

    eye_closed = ear < EAR_THRESHOLD
    state.frame_history.append(eye_closed)

    if eye_closed:
        state.closed_frames += 1
        state.consecutive_closed += 1
    else:
        # Check transition from closed to open
        if state.last_eye_closed and state.consecutive_closed >= MIN_FRAMES:
            state.blink_count += 1
        
        # Reset consecutive closed count when eyes open
        state.consecutive_closed = 0

    state.last_eye_closed = eye_closed

    return {
        "blink_count": state.blink_count,
        "closed_frames": state.closed_frames,
        "eye_closed": eye_closed
    }