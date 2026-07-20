import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Fuel, Settings, Users, Star, Heart, ShieldCheck } from "lucide-react";
import type { Car } from "./carsData";
import type { Variants } from "framer-motion";

interface CarCardProps {
  car: Car;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

export default function CarCard({ car }: CarCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8, scale: 1.01 }}
      className="group bg-white rounded-[2rem] p-4 shadow-sm border border-slate-200 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-slate-100 mb-6">
        <motion.img
          src={car.image}
          alt={car.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        
        {/* Top Badges overlay */}
        <div className="absolute top-4 inset-x-4 flex items-start justify-between z-10 pointer-events-none">
          {/* AI Verified Badge */}
          <AnimatePresence>
            {car.aiVerified && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-white/20"
              >
                <ShieldCheck size={16} className="text-blue-600" />
                <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">AI Verified</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Favorite Button */}
          <motion.button
            onClick={() => setIsFavorite(!isFavorite)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`pointer-events-auto p-2.5 rounded-full backdrop-blur-md transition-colors duration-300 shadow-sm ${
              isFavorite 
                ? "bg-red-50 border border-red-100 text-red-500" 
                : "bg-white/90 border border-white/20 text-slate-400 hover:text-red-500"
            }`}
          >
            <Heart size={18} className={isFavorite ? "fill-current" : ""} />
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-2">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-slate-900 line-clamp-1">
            {car.name}
          </h3>
          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
            <Star size={14} className="text-amber-500 fill-amber-500" />
            <span className="text-sm font-semibold text-amber-700">{car.rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-slate-500 mb-6">
          <MapPin size={16} />
          <span className="text-sm font-medium truncate">{car.location}</span>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-3 gap-2 mb-8">
          <div className="flex flex-col items-center justify-center py-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <Settings size={18} className="text-slate-400 mb-1" />
            <span className="text-xs font-semibold text-slate-600">{car.transmission}</span>
          </div>
          <div className="flex flex-col items-center justify-center py-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <Fuel size={18} className="text-slate-400 mb-1" />
            <span className="text-xs font-semibold text-slate-600">{car.fuel}</span>
          </div>
          <div className="flex flex-col items-center justify-center py-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <Users size={18} className="text-slate-400 mb-1" />
            <span className="text-xs font-semibold text-slate-600">{car.seats} Seats</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
          <div>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider block mb-0.5">Price</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-blue-600">Rs {car.price.toLocaleString()}</span>
              <span className="text-sm font-medium text-slate-500">/day</span>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors duration-300 shadow-md hover:shadow-xl"
          >
            View Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
