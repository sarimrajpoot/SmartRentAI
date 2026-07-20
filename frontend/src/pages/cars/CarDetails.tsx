import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Star, MapPin, Fuel, Settings, Users, Sparkles, Building2, ShieldCheck, Bluetooth, Map, Snowflake } from "lucide-react";


import { getCar } from "../../services/car";
import type { Car } from "../../types/car";

import BookingWizard from "../../components/cars/BookingWizard";
import FeatureItem from "../../components/cars/FeatureItem";
import ReviewCard from "../../components/cars/ReviewCard";
import CustomerEmptyState from "../../components/dashboard/customer/CustomerEmptyState";
import { getImageUrl } from "../../utils/image";

export default function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCarDetails() {
      try {
        setLoading(true);
        if (!id) return;
        const data = await getCar(id);
        setCar(data);
      } catch (err: any) {
        setError("Failed to load vehicle details. It may have been removed.");
      } finally {
        setLoading(false);
      }
    }
    fetchCarDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-zinc-800 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="max-w-3xl mx-auto mt-12">
        <CustomerEmptyState title="Vehicle Not Found" description={error || "We couldn't locate this vehicle."} />
        <div className="text-center mt-6">
          <Link to="/dashboard/customer" className="text-blue-500 hover:text-blue-400 font-medium">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <Link to="/dashboard/customer" className="inline-flex items-center text-zinc-400 hover:text-white mb-6 transition-colors font-medium">
        <ChevronLeft size={20} className="mr-1" /> Back to Dashboard
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Car Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Hero Image */}
          <div className="relative rounded-3xl overflow-hidden h-[400px] md:h-[500px] border border-zinc-800 bg-zinc-900 group">
            {car.ai_vehicle_score && car.ai_vehicle_score >= 85 && (
              <div className="absolute top-4 left-4 z-10 bg-emerald-500/90 backdrop-blur text-white text-sm font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                <Sparkles size={16} /> AI Recommended Score: {car.ai_vehicle_score}
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
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
          </div>

          {/* Overview Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">
                {car.brand} {car.model} <span className="text-zinc-500 font-light">{car.year}</span>
              </h1>
              <p className="flex items-center text-zinc-400 gap-2">
                <MapPin size={16} /> {car.city} &middot; <Star size={16} className="text-yellow-500 fill-yellow-500" /> 4.9 (128 trips)
              </p>
            </div>
          </div>

          {/* Key Specs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
              <Settings className="text-zinc-400 mb-2" size={24} />
              <span className="text-sm font-bold text-white capitalize">{car.transmission.toLowerCase()}</span>
              <span className="text-xs text-zinc-500">Transmission</span>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
              <Fuel className="text-zinc-400 mb-2" size={24} />
              <span className="text-sm font-bold text-white capitalize">{car.fuel_type.toLowerCase()}</span>
              <span className="text-xs text-zinc-500">Fuel Type</span>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
              <Users className="text-zinc-400 mb-2" size={24} />
              <span className="text-sm font-bold text-white">{car.seats}</span>
              <span className="text-xs text-zinc-500">Seats</span>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
              <Sparkles className="text-zinc-400 mb-2" size={24} />
              <span className="text-sm font-bold text-white capitalize">{car.color || "Standard"}</span>
              <span className="text-xs text-zinc-500">Color</span>
            </div>
          </div>

          <div className="h-px bg-zinc-800/60" />

          {/* Features */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Premium Features</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <FeatureItem icon={<Snowflake size={20} />} label="Climate Control" />
              <FeatureItem icon={<Bluetooth size={20} />} label="Bluetooth Audio" />
              <FeatureItem icon={<Map size={20} />} label="Built-in GPS" />
              <FeatureItem icon={<ShieldCheck size={20} />} label="AI Monitoring" />
            </div>
          </div>

          <div className="h-px bg-zinc-800/60" />

          {/* Showroom / Host Info */}
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-6 md:p-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400">
                <Building2 size={24} />
              </div>
              <div>
                <p className="text-sm text-zinc-500 mb-1">Managed by</p>
                <h4 className="font-bold text-white text-lg">Elite Motors (Showroom)</h4>
                <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                  <ShieldCheck size={14} /> AI Verified Partner
                </p>
              </div>
            </div>
            <button className="hidden sm:block px-6 py-2 rounded-full border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors font-medium text-sm">
              Contact Host
            </button>
          </div>

          <div className="h-px bg-zinc-800/60" />

          {/* Reviews */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Recent Reviews</h3>
            <div className="space-y-4">
              <ReviewCard 
                name="Ahmad K." 
                date="August 2026" 
                rating={5} 
                comment="Car was in pristine condition. The AI verification at pickup made things so much faster. Will rent from this showroom again!" 
              />
              <ReviewCard 
                name="Sara M." 
                date="July 2026" 
                rating={5} 
                comment="Very smooth drive. The chauffeur was professional and arrived exactly on time." 
              />
            </div>
            <button className="mt-6 text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors">
              Show all 128 reviews
            </button>
          </div>
        </div>

        {/* Right Column: Booking Sticky Widget */}
        <div className="lg:col-span-1 relative">
          <div className="sticky top-28">
            <BookingWizard car={car} />
          </div>
        </div>

      </div>
    </div>
  );
}
