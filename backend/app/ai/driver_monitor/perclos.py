def calculate_perclos(state):

    if len(state.frame_history) == 0:
        return {
            "perclos": 0,
            "fatigue": "Unknown"
        }

    closed_in_window = sum(1 for x in state.frame_history if x)
    perclos = (closed_in_window / len(state.frame_history)) * 100

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