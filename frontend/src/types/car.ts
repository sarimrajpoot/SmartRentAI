export interface Car {
  id: string;
  owner_id: string;
  brand: string;
  model: string;
  variant?: string;
  year: number;
  color?: string;
  license_plate: string;
  transmission: "AUTOMATIC" | "MANUAL";
  fuel_type: "Petrol" | "Diesel" | "Electric" | "Hybrid";
  seats: number;
  daily_price: number;
  city: string;
  is_available: boolean;
  image_url?: string;
  images?: string[];
  gps_device_id?: string;
  fuel_sensor_id?: string;
  ai_vehicle_score?: number;
  created_at: string;
  updated_at?: string;
}

export type CarCreate = Omit<Car, "id" | "owner_id" | "created_at" | "updated_at">;

export type CarUpdate = Partial<CarCreate>;

export interface CarListResponse {
  items: Car[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}