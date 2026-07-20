import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Heart, 
  Settings, 
  Fuel, 
  Users, 
  AlertTriangle,
  Car as CarIcon,
  Trash2,
  ArrowRight
} from "lucide-react";

import { getWishlist, removeFromWishlist } from "../../services/wishlist";
import type { WishlistItem, WishlistListResponse } from "../../services/wishlist";
import { getImageUrl } from "../../utils/image";

export default function CustomerWishlist() {
  const [data, setData] = useState<WishlistListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getWishlist();
      setData(response);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleRemove = async (carId: string) => {
    try {
      await removeFromWishlist(carId);
      if (data) {
        setData({
          ...data,
          items: data.items.filter(item => item.car_id !== carId),
          total: data.total - 1
        });
      }
      setToast({ message: 'Removed from wishlist', type: 'success' });
    } catch (err: any) {
      setToast({ message: err.response?.data?.detail || 'Failed to remove from wishlist', type: 'error' });
    }
  };

  if (error) {
    return (
      <div className="max-w-[1600px] mx-auto pb-20">
        <div className="flex flex-col items-center justify-center bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center h-[50vh]">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-500 mb-6">
            <AlertTriangle size={28} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Oops! Something went wrong</h2>
          <p className="text-zinc-400 max-w-md mx-auto mb-8">{error}</p>
          <button 
            onClick={fetchWishlist}
            className="px-6 py-3 bg-white text-zinc-950 font-bold rounded-xl hover:bg-zinc-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto pb-20 relative">
      {/* Toast Notification */}
      {toast && (
        <div className={`absolute top-0 right-0 z-50 px-6 py-3 rounded-xl shadow-2xl font-medium text-sm animate-in fade-in slide-in-from-top-4 ${
          toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
            <Heart size={20} className="text-red-500 fill-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">My Wishlist</h1>
          {!loading && data && (
            <span className="bg-zinc-800 text-zinc-300 text-sm font-bold px-3 py-1 rounded-full ml-2">
              {data.total}
            </span>
          )}
        </div>
        <p className="text-zinc-400 mt-2">Vehicles you've saved for later.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-[380px] bg-zinc-900 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : data?.items && data.items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {data.items.map((item: WishlistItem) => {
            const car = item.car;
            return (
              <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden group hover:border-zinc-700 transition-colors flex flex-col h-full">
                {/* Image Header */}
                <div className="relative aspect-[4/3] overflow-hidden bg-zinc-950">
                  <img 
                    src={getImageUrl(car.images?.[0] || car.image_url)} 
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=600";
                    }}
                  />

                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    {car.is_available ? (
                      <span className="bg-emerald-500/90 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                        Available
                      </span>
                    ) : (
                      <span className="bg-zinc-800 backdrop-blur text-zinc-400 border border-zinc-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                        Booked
                      </span>
                    )}
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-zinc-950 to-transparent">
                    <p className="text-white font-bold text-xl flex items-end gap-1">
                      Rs {car.daily_price.toLocaleString()} <span className="text-xs text-zinc-400 font-medium mb-1">/ day</span>
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white leading-tight">
                      {car.brand} {car.model} {car.year}
                    </h3>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-3 gap-2 mb-6 text-center mt-auto">
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-2">
                      <Settings size={16} className="text-zinc-400 mx-auto mb-1" />
                      <p className="text-[10px] uppercase font-bold text-zinc-300">{car.transmission}</p>
                    </div>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-2">
                      <Fuel size={16} className="text-zinc-400 mx-auto mb-1" />
                      <p className="text-[10px] uppercase font-bold text-zinc-300">{car.fuel_type}</p>
                    </div>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-2">
                      <Users size={16} className="text-zinc-400 mx-auto mb-1" />
                      <p className="text-[10px] uppercase font-bold text-zinc-300">{car.seats} Seats</p>
                    </div>
                  </div>
                  
                  <div className="h-px w-full bg-zinc-800 mb-6" />

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                        <CarIcon size={14} />
                      </div>
                      <div className="text-xs">
                        <p className="text-zinc-500">Showroom</p>
                        <p className="font-medium text-zinc-300">Verified Partner</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-auto">
                    <button 
                      onClick={() => handleRemove(car.id)}
                      className="flex-1 py-2.5 bg-red-500/10 text-red-400 font-bold rounded-full hover:bg-red-500/20 transition-colors flex justify-center items-center gap-2"
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                    <Link 
                      to={`/cars/${car.id}`}
                      className="flex-1 py-2.5 bg-white text-zinc-950 font-bold rounded-full hover:bg-zinc-200 transition-colors flex justify-center items-center gap-2"
                    >
                      Book Now <ArrowRight size={16} />
                    </Link>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center h-[50vh]">
          <div className="w-16 h-16 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500 mb-6">
            <Heart size={28} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Your wishlist is empty</h2>
          <p className="text-zinc-400 max-w-md mx-auto mb-8">
            Browse vehicles to add your favorites
          </p>
          <Link 
            to="/dashboard/customer/browse"
            className="px-6 py-3 bg-white text-zinc-950 font-bold rounded-xl hover:bg-zinc-200 transition-colors"
          >
            Browse Vehicles
          </Link>
        </div>
      )}
    </div>
  );
}
