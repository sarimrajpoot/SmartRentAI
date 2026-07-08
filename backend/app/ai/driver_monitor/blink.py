EAR_THRESHOLD = 0.22


def update_blink_state(ear, state):

    state.total_frames += 1

    eye_closed = ear < EAR_THRESHOLD

    if eye_closed:

        state.closed_frames += 1

    if state.last_eye_closed and not eye_closed:

        state.blink_count += 1

    state.last_eye_closed = eye_closed

    return {

        "blink_count": state.blink_count,

        "closed_frames": state.closed_frames,

        "eye_closed": eye_closed
    }