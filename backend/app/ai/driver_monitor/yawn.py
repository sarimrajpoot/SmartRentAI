from app.ai.driver_monitor.config import YAWN_THRESHOLD

def update_yawn_state(mar, state):
    if mar is None:
        return {
            "mar": None,
            "yawning": False,
            "yawn_count": state.yawn_count
        }

    yawning = mar > YAWN_THRESHOLD

    # Only increment yawn count when mouth transitions from open to closed
    if state.last_yawn_state and not yawning:
        state.yawn_count += 1
        
    state.last_yawn_state = yawning

    return {
        "mar": round(mar, 3),
        "yawning": yawning,
        "yawn_count": state.yawn_count
    }