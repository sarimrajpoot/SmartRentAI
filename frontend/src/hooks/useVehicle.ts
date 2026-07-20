import { useState, useCallback } from "react";
import { getCar, updateCar, deleteCar, uploadCarImages } from "../services/car";
import type { Car } from "../types/car";

export function useVehicle() {
  const [vehicle, setVehicle] = useState<Car | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicle = useCallback(async (carId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCar(carId);
      setVehicle(data);
      return data;
    } catch (err: any) {
      setError(err.message || "Failed to fetch vehicle details");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const modifyVehicle = useCallback(async (carId: string, updates: Partial<Car>) => {
    setLoading(true);
    try {
      const data = await updateCar(carId, updates);
      setVehicle(data);
      return data;
    } catch (err: any) {
      setError(err.message || "Failed to update vehicle");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeVehicle = useCallback(async (carId: string) => {
    setLoading(true);
    try {
      await deleteCar(carId);
      setVehicle(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete vehicle");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadImages = useCallback(async (carId: string, files: File[]) => {
    setLoading(true);
    try {
      const data = await uploadCarImages(carId, files);
      setVehicle(data);
      return data;
    } catch (err: any) {
      setError(err.message || "Failed to upload images");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    vehicle,
    loading,
    error,
    fetchVehicle,
    modifyVehicle,
    removeVehicle,
    uploadImages,
  };
}
