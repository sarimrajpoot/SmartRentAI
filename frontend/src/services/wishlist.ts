import api from "../api/api";
import type { Car } from "../types/car";

export interface WishlistItem {
  id: string;
  user_id: string;
  car_id: string;
  created_at: string;
  car: Car;
}

export interface WishlistListResponse {
  items: WishlistItem[];
  total: number;
}

export const getWishlist = async (): Promise<WishlistListResponse> => {
  const response = await api.get("/wishlist");
  return response.data;
};

export const addToWishlist = async (carId: string): Promise<WishlistItem> => {
  const response = await api.post("/wishlist", { car_id: carId });
  return response.data;
};

export const removeFromWishlist = async (carId: string): Promise<void> => {
  await api.delete(`/wishlist/${carId}`);
};

export const getWishlistIds = async (): Promise<string[]> => {
  const response = await api.get("/wishlist/ids");
  return response.data.car_ids;
};
