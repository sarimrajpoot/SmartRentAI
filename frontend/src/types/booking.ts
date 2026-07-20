export type BookingStatus = 
  | "PENDING"
  | "CONFIRMED"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED";

export interface BookingCreate {
  car_id: string;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  with_driver?: boolean;
  with_insurance?: boolean;
}

export interface BookingResponse {
  id: string;
  customer_id: string;
  car_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  with_driver: boolean;
  with_insurance: boolean;
  status: BookingStatus;
  created_at?: string;
  updated_at?: string;
}

export interface BookingListResponse {
  items: BookingResponse[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
