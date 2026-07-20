import api from "../api/api";

export interface Detection {
  class: string;
  confidence: number;
  box?: [number, number, number, number];
}

export interface DriverMonitorResponse {
  session_id: string;
  risk_score: number;
  alerts: string[];
  drowsy: boolean;
  ear: number | null;
  left_ear?: number | null;
  right_ear?: number | null;
  face_reason: string;
  left_eye?: [number, number][];
  right_eye?: [number, number][];
  face_box?: [number, number, number, number];
  blink_count: number;
  eye_closed: boolean;
  perclos: number;
  fatigue_level: string;
  yawn_count: number;
  mar: number | null;
  phone_detected: boolean;
  attention_score: number;
  looking_away: boolean;
  detections: Detection[];
}

export const uploadFrame = async (blob: Blob, sessionId?: string): Promise<DriverMonitorResponse> => {
  const formData = new FormData();
  formData.append("image", blob, "frame.jpg");

  const headers: Record<string, string> = {
    "Content-Type": "multipart/form-data",
  };

  if (sessionId) {
    headers["X-Driver-Session-ID"] = sessionId;
  }

  const response = await api.post("/driver-monitor/upload-frame", formData, {
    headers,
  });

  return response.data;
};
