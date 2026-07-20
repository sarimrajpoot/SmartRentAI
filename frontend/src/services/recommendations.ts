import api from "../api/api";
import type { Car } from "../types/car";

export interface RecommendationItem {
  car: Car;
  match_score: number;
  explanation: string;
}

export interface RecommendationResponse {
  items: RecommendationItem[];
  total: number;
}

export interface RecommendationPreferences {
  budget_min?: number;
  budget_max?: number;
  seats?: number;
  fuel_type?: string;
  transmission?: string;
  city?: string;
}

export const getRecommendations = async (
  prefs: RecommendationPreferences
): Promise<RecommendationResponse> => {
  const params: Record<string, any> = {};
  if (prefs.budget_min) params.budget_min = prefs.budget_min;
  if (prefs.budget_max) params.budget_max = prefs.budget_max;
  if (prefs.seats) params.seats = prefs.seats;
  if (prefs.fuel_type) params.fuel_type = prefs.fuel_type;
  if (prefs.transmission) params.transmission = prefs.transmission;
  if (prefs.city) params.city = prefs.city;
  const response = await api.get("/recommendations", { params });
  return response.data;
};
