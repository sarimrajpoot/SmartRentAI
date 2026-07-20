import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, MapPin, ExternalLink, RefreshCw, XCircle, FileText, Star } from "lucide-react";
import toast from "react-hot-toast";
import type { BookingResponse } from "../../../../types/booking";
import type { Car } from "../../../../types/car";

interface BookingCardProps {
  booking: BookingResponse;
  car?: Car;
}

const statusColors = {
  PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  CONFIRMED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  ACTIVE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  COMPLETED: "bg-zinc-800 text-zinc-300 border-zinc-700",
  CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
  REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function BookingCard({ booking, car }: BookingCardProps) {
  const getDays = () => {
    const start = new Date(booking.start_date);
    const end = new Date(booking.end_date);
    const diff = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff || 1;
  };

  const handleActionClick = (e: React.MouseEvent) => {
    // Prevent navigating to booking details if they click an action button
    // In reality, this would open modals or trigger API calls
    e.preventDefault();
    toast("This action is coming soon in a future update.", {
      icon: '🚀',
    });
  };

  return (
    <Link to={`/dashboard/customer/bookings/${booking.id}`} className="block">
      <motion.div 
        whileHover={{ y: -4 }}
        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 hover:border-zinc-700 transition-all group"
      >
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Image */}
          <div className="w-full md:w-64 h-48 md:h-full rounded-2xl overflow-hidden bg-zinc-800 shrink-0 relative">
            <img 
              src={car?.image_url || "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=600"} 
              alt={car ? `${car.brand} ${car.model}` : "Vehicle"}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
            <div className="absolute bottom-3 left-3">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusColors[booking.status]}`}>
                {booking.status}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  {car ? `${car.brand} ${car.model}` : "Loading Vehicle..."}
                </h3>
                <p className="text-sm text-zinc-400 mt-1 flex items-center gap-1">
                  <MapPin size={14} /> {car?.city || "Location"} Hub
                </p>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-white">Rs {booking.total_price?.toLocaleString() || "0"}</span>
                <span className="text-xs text-zinc-500 block">Total for {getDays()} days</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-zinc-950/50 rounded-xl p-3 border border-zinc-800/50">
                <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold block mb-1">Pickup</span>
                <div className="flex items-center gap-2 text-sm text-zinc-200">
                  <Calendar size={14} className="text-blue-500" />
                  {booking.start_date}
                </div>
              </div>
              <div className="bg-zinc-950/50 rounded-xl p-3 border border-zinc-800/50">
                <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold block mb-1">Return</span>
                <div className="flex items-center gap-2 text-sm text-zinc-200">
                  <Calendar size={14} className="text-blue-500" />
                  {booking.end_date}
                </div>
              </div>
            </div>

            {/* Context Aware Actions */}
            <div className="mt-auto flex flex-wrap items-center gap-3 pt-4 border-t border-zinc-800/60">
              
              {/* Common Details Action */}
              <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-xl transition-colors">
                <ExternalLink size={16} /> Details
              </button>

              {/* Status Specific Actions */}
              {(booking.status === "PENDING" || booking.status === "CONFIRMED") && (
                <button onClick={handleActionClick} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-xl transition-colors">
                  <XCircle size={16} /> Cancel
                </button>
              )}

              {booking.status === "ACTIVE" && (
                <>
                  <button onClick={handleActionClick} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-xl transition-colors">
                    <MapPin size={16} /> Live GPS
                  </button>
                  <button onClick={handleActionClick} className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-sm font-medium rounded-xl transition-colors">
                    <RefreshCw size={16} /> Extend Trip
                  </button>
                </>
              )}

              {booking.status === "COMPLETED" && (
                <>
                  <button onClick={handleActionClick} className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 text-sm font-medium rounded-xl transition-colors">
                    <Star size={16} /> Review
                  </button>
                  <button onClick={handleActionClick} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-xl transition-colors">
                    <FileText size={16} /> Invoice
                  </button>
                </>
              )}
              
            </div>
          </div>

        </div>
      </motion.div>
    </Link>
  );
}
