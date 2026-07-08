YAWN_THRESHOLD = 0.60


def update_yawn_state(mar, state):

    yawning = mar > YAWN_THRESHOLD

    if yawning:
        state.yawn_count += 1

    return {
        "mar": round(mar, 3),
        "yawning": yawning,
        "yawn_count": state.yawn_count
    }