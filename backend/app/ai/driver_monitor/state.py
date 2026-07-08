class DriverState:

    def __init__(self):

        self.blink_count = 0

        self.closed_frames = 0

        self.total_frames = 0

        self.last_eye_closed = False

        self.perclos = 0.0
        
        self.yawn_count = 0


driver_state = DriverState()