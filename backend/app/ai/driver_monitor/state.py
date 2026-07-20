import collections

class DriverState:

    def __init__(self):

        self.blink_count = 0

        self.closed_frames = 0
        
        self.consecutive_closed = 0

        self.total_frames = 0

        self.last_eye_closed = False

        self.perclos = 0.0
        
        self.yawn_count = 0
        
        self.last_yawn_state = False
        
        self.looking_away_frames = 0
        self.attention_score = 100
        
        # Keep track of the last 100 frames for PERCLOS rolling window
        self.frame_history = collections.deque(maxlen=100)
        self.looking_away_history = collections.deque(maxlen=100)