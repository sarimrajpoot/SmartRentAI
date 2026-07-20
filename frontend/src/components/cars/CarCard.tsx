import { MapPin, Users, Fuel, Settings, Star } from "lucide-react";
import type { Car } from "../../types/car";

interface CarCardProps {
  car: Car;
  onView?: (id: string) => void;
  onBook?: (id: string) => void;
}

export default function CarCard({
  car,
  onView,
  onBook,
}: CarCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

      <div className="relative h-52 bg-slate-100">
        <img
          src={
            car.image_url ||
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"
          }
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover"
        />

        <span
          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
            car.is_available
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {car.is_available ? "Available" : "Booked"}
        </span>
      </div>

      <div className="p-5">

        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {car.brand} {car.model}
            </h3>

            <p className="text-slate-500">
              {car.variant}
            </p>
          </div>

          <div className="flex items-center gap-1 text-yellow-500">
            <Star size={16} fill="currentColor" />
            <span className="font-semibold">
              {car.ai_vehicle_score ?? 4.8}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5 text-sm text-slate-600">

          <div className="flex items-center gap-2">
            <MapPin size={16} />
            {car.city}
          </div>

          <div className="flex items-center gap-2">
            <Users size={16} />
            {car.seats} Seats
          </div>

          <div className="flex items-center gap-2">
            <Fuel size={16} />
            {car.fuel_type}
          </div>

          <div className="flex items-center gap-2">
            <Settings size={16} />
            {car.transmission}
          </div>

        </div>

        <div className="mt-6 flex justify-between items-center">

          <div>
            <span className="text-2xl font-bold text-blue-600">
              Rs {Number(car.daily_price).toLocaleString()}
            </span>

            <span className="text-slate-500">
              {" "} / day
            </span>
          </div>

          <div className="flex gap-2">

            <button
              onClick={() => onView?.(car.id)}
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 transition"
            >
              Details
            </button>

            <button
              disabled={!car.is_available}
              onClick={() => onBook?.(car.id)}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              Book
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}