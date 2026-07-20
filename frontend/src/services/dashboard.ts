import api from "../api/api";
import type { ShowroomDashboardStats } from "../types/dashboard";

export const getShowroomStats = async (): Promise<ShowroomDashboardStats> => {
  const response = await api.get("/dashboard/showroom");
  return response.data;
};

export interface ShowroomCustomer {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  profile_picture?: string;
  is_verified: boolean;
  created_at?: string;
  cnic?: string;
  driving_license?: string;
  risk_score: number;
  total_bookings: number;
  active_bookings: number;
  completed_bookings: number;
  cancelled_bookings: number;
  total_spending: number;
  last_booking_date?: string;
  favorite_car?: string;
}

export interface ShowroomCustomerBooking {
  id: string;
  car_brand: string;
  car_model: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
}

export interface ShowroomCustomerSafetyEvent {
  id: string;
  event_type: string;
  severity: string;
  title: string;
  description: string;
  created_at: string;
}

export interface ShowroomCustomerDetail extends ShowroomCustomer {
  bookings: ShowroomCustomerBooking[];
  safety_events: ShowroomCustomerSafetyEvent[];
  total_damage_reports: number;
}

export const getShowroomCustomers = async (): Promise<ShowroomCustomer[]> => {
  const response = await api.get("/dashboard/showroom/customers");
  return response.data;
};

export const getShowroomCustomerDetail = async (customerId: string): Promise<ShowroomCustomerDetail> => {
  const response = await api.get(`/dashboard/showroom/customers/${customerId}`);
  return response.data;
};

export interface ShowroomTrackingTelemetry {
  latitude: number;
  longitude: number;
  speed: number;
  fuel_level: number;
  battery_level: number;
  ignition_on: boolean;
  last_updated: string;
}

export interface ShowroomTrackingDriver {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
}

export interface ShowroomTrackingItem {
  id: string;
  brand: string;
  model: string;
  year: number;
  license_plate: string;
  image_url?: string;
  images: string[];
  status: "ACTIVE" | "AVAILABLE" | "OFFLINE";
  booking_id?: string;
  driver?: ShowroomTrackingDriver;
  telemetry?: ShowroomTrackingTelemetry;
  alertness?: number;
  drowsiness?: string;
  phone_usage?: boolean;
  smoking?: boolean;
  seatbelt_on?: boolean;
  has_damage_alerts: boolean;
  remaining_minutes?: number;
}

export const getShowroomTracking = async (): Promise<ShowroomTrackingItem[]> => {
  const response = await api.get("/dashboard/showroom/tracking");
  return response.data;
};
