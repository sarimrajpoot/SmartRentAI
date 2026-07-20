import { useState, useCallback } from "react";
import { getMyCars, getMyCarStats } from "../services/car";
import type { CarListResponse } from "../types/car";

interface FetchParams {
  page?: number;
  limit?: number;
  brand?: string;
  model?: string;
  city?: string;
  transmission?: string;
  fuel_type?: string;
  is_available?: boolean;
  seats?: number;
  search?: string;
  sort_by?: string;
}

export function useCars() {
  const [data, setData] = useState<CarListResponse | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCars = useCallback(async (params: FetchParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getMyCars({ ...params });
      setData(result);
    } catch (err: any) {
      setError(err.message || "Failed to fetch cars");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const result = await getMyCarStats();
      setStats(result);
    } catch (err) {
      console.error("Failed to fetch car stats", err);
    }
  }, []);

  return {
    data,
    stats,
    loading,
    error,
    fetchCars,
    fetchStats,
  };
}
