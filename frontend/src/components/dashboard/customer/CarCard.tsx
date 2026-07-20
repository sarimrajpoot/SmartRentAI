import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, Settings, Fuel, MapPin, Sparkles } from "lucide-react";
import type { Car } from "../../../types/car";
import { getImageUrl } from "../../../utils/image";

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-zinc-800/60 overflow-hidden hover:border-zinc-700 hover:shadow-xl hover:shadow-black/20 transition-all flex flex-col h-full"
    >
      <Link to={`/cars/${car.id}`} className="block relative h-48 sm:h-56 overflow-hidden">
        {car.ai_vehicle_score && car.ai_vehicle_score >= 85 && (
          <div className="absolute top-3 left-3 z-10 bg-emerald-500/90 backdrop-blur text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <Sparkles size={12} /> AI Recommended
          </div>
        )}
        <img
          src={getImageUrl(car.images?.[0] || car.image_url)}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=600";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/20 to-transparent opacity-80" />
      </Link>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
              {car.brand} {car.model}
            </h3>
            <p className="text-sm text-zinc-400 flex items-center gap-1 mt-0.5">
              <MapPin size={12} /> {car.city}
            </p>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-white">Rs {car.daily_price.toLocaleString()}</span>
            <span className="text-xs text-zinc-500 block">/ day</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-auto pt-4 border-t border-zinc-800/50">
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-zinc-950/50 text-zinc-400 text-xs gap-1.5">
            <Settings size={14} />
            <span className="capitalize">{car.transmission.toLowerCase()}</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-zinc-950/50 text-zinc-400 text-xs gap-1.5">
            <Fuel size={14} />
            <span className="capitalize">{car.fuel_type.toLowerCase()}</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-zinc-950/50 text-zinc-400 text-xs gap-1.5">
            <Users size={14} />
            <span>{car.seats} Seats</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
