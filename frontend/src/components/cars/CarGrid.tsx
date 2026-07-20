import { useEffect, useState } from "react";
import CarCard from "./CarCard";
import { getCars } from "../../services/car";
import type { Car } from "../../types/car";

interface CarGridProps {
  limit?: number;
  city?: string;
  search?: string;
}

export default function CarGrid({
  limit = 6,
  city,
  search,
}: CarGridProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCars() {
      try {
        setLoading(true);

        const response = await getCars({
          page: 1,
          limit,
          ...(city ? { city } : {}),
          ...(search ? { search } : {}),
          is_available: true,
        });

        setCars(response.items);
      } catch (err) {
        console.error(err);
        setError("Failed to load cars.");
      } finally {
        setLoading(false);
      }
    }

    loadCars();
  }, [limit, city, search]);

  if (loading) {
    return (
      <div className="text-center py-16 text-slate-500">
        Loading available cars...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-red-500">
        {error}
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500">
        No cars available.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {cars.map((car) => (
        <CarCard
          key={car.id}
          car={car}
          onView={(id) => console.log("View", id)}
          onBook={(id) => console.log("Book", id)}
        />
      ))}
    </div>
  );
}