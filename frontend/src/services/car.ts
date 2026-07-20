import api from "../api/api";
import type { Car, CarListResponse } from "../types/car";

export const getCars = async (params?: Record<string, any>): Promise<CarListResponse> => {
  const response = await api.get("/cars", { params });
  return response.data;
};

export const getMyCars = async (params?: Record<string, any>): Promise<CarListResponse> => {
  const response = await api.get("/cars/my", { params });
  return response.data;
};

export const getMyCarStats = async (): Promise<any> => {
  const response = await api.get("/cars/my/stats");
  return response.data;
};

export const getCar = async (id: string): Promise<Car> => {
  const response = await api.get(`/cars/${id}`);
  return response.data;
};

export const createCar = async (carData: Partial<Car>): Promise<Car> => {
  const response = await api.post("/cars", carData);
  return response.data;
};

export const updateCar = async (id: string, carData: Partial<Car>): Promise<Car> => {
  const response = await api.patch(`/cars/${id}`, carData);
  return response.data;
};

export const deleteCar = async (id: string): Promise<void> => {
  await api.delete(`/cars/${id}`);
};

export const uploadCarImages = async (id: string, files: File[]): Promise<Car> => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append("images", file);
  });
  
  const response = await api.post(`/cars/${id}/images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};