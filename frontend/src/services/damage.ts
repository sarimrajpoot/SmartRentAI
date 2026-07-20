import api from "../api/api";

export interface DamageItem {
  part: string;
  type: string;
  severity: string;
  repair_cost_est: number;
}

export interface DamageReport {
  id: string;
  booking_id: string;
  before_image_url: string;
  after_image_url: string;
  annotated_image_url: string | null;
  condition_score: number;
  total_repair_cost: number;
  damages: DamageItem[];
  created_at: string;
}

export const analyzeDamage = async (
  bookingId: string,
  beforeImage: File,
  afterImage: File
): Promise<DamageReport> => {
  const formData = new FormData();
  formData.append("booking_id", bookingId);
  formData.append("before_image", beforeImage);
  formData.append("after_image", afterImage);

  const response = await api.post("/damage/analyze", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getDamageReports = async (bookingId: string): Promise<DamageReport[]> => {
  const response = await api.get(`/damage/${bookingId}`);
  return response.data;
};
