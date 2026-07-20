import api from "../api/api";
import type { BookingCreate, BookingResponse, BookingListResponse } from "../types/booking";

// --- Customer Endpoints ---
export async function createBooking(data: BookingCreate): Promise<BookingResponse> {
  const response = await api.post("/bookings", data);
  return response.data;
}

export async function getMyBookings(
  page: number = 1,
  limit: number = 10,
  search?: string,
  status?: string
): Promise<BookingListResponse> {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());
  if (search) params.append("search", search);
  if (status) params.append("status", status);

  const response = await api.get("/bookings/my", { params });
  return response.data;
}

export async function getBookingDetails(id: string): Promise<BookingResponse> {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
}

// --- Showroom / Owner Endpoints ---
export const getOwnerBookings = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  status?: string
): Promise<BookingListResponse> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());
  if (search) params.append("search", search);
  if (status) params.append("status_filter", status);

  const response = await api.get("/bookings/owner", { params });
  return response.data;
};

export async function approveBooking(id: string): Promise<BookingResponse> {
  const response = await api.patch(`/bookings/${id}/approve`);
  return response.data;
}

export async function rejectBooking(id: string): Promise<BookingResponse> {
  const response = await api.patch(`/bookings/${id}/reject`);
  return response.data;
}

export async function startBooking(id: string): Promise<BookingResponse> {
  const response = await api.patch(`/bookings/${id}/start`);
  return response.data;
}

export async function completeBooking(id: string): Promise<BookingResponse> {
  const response = await api.patch(`/bookings/${id}/complete`);
  return response.data;
}

export async function cancelBooking(id: string): Promise<BookingResponse> {
  const response = await api.patch(`/bookings/${id}/cancel`);
  return response.data;
}
