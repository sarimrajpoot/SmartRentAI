def calculate_perclos(state):

    if state.total_frames == 0:

        return {
            "perclos": 0,
            "fatigue": "Unknown"
        }

    perclos = (
        state.closed_frames
        / state.total_frames
    ) * 100

    if perclos < 15:

        level = "Alert"

    elif perclos < 30:

        level = "Slightly Fatigued"

    elif perclos < 40:

        level = "Fatigued"

    else:

        level = "Severely Fatigued"

    state.perclos = round(perclos, 2)

    return {

        "perclos": state.perclos,

        "fatigue": level
    }