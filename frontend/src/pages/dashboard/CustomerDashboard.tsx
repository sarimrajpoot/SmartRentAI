import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CarFront, Zap, Shield, Sparkles, AlertCircle } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { getCars } from "../../services/car";
import type { Car } from "../../types/car";


import SearchFilters from "../../components/dashboard/customer/SearchFilters";
import CategoryCard from "../../components/dashboard/customer/CategoryCard";
import CarCard from "../../components/dashboard/customer/CarCard";
import { CarCardSkeleton } from "../../components/dashboard/customer/LoadingSkeletons";
import CustomerEmptyState from "../../components/dashboard/customer/CustomerEmptyState";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export default function CustomerDashboard() {
  const { user } = useAuth();
  
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCars() {
      try {
        setLoading(true);
        // Note: For pagination/filtering we would pass params here
        const data = await getCars();
        setCars(data.items || []);
      } catch (err: any) {
        console.error("Failed to fetch cars:", err);
        setError("Failed to load available vehicles. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchCars();
  }, []);

  // Split cars into different categories for the UI
  // In a real app with pagination, these would be separate API calls or query params
  const featuredCars = cars.slice(0, 4);
  const recommendedCars = [...cars].sort((a, b) => (b.ai_vehicle_score || 0) - (a.ai_vehicle_score || 0)).slice(0, 4);
  const popularCars = [...cars].reverse().slice(0, 4); // Just mock sorting for now

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10 pb-12"
    >
      {/* Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&q=80&w=1600" 
            alt="Luxury Interior" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
        </div>
        
        <div className="relative z-10 p-8 md:p-12 max-w-2xl">
          <Badge className="mb-4">AI-Powered Rentals</Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Welcome back, {user?.email ? user.email.split('@')[0] : 'Explorer'}.
          </h1>
          <p className="text-zinc-400 text-lg mb-8 max-w-xl">
            Find the perfect vehicle for your next journey. Our AI has already curated a selection based on your preferences.
          </p>
          
          <SearchFilters />
        </div>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Browse by Category</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          <CategoryCard title="SUV" icon={<CarFront size={24} />} isActive />
          <CategoryCard title="Sedan" icon={<CarFront size={24} />} />
          <CategoryCard title="Luxury" icon={<Sparkles size={24} />} />
          <CategoryCard title="Electric" icon={<Zap size={24} />} />
          <CategoryCard title="Secure" icon={<Shield size={24} />} />
        </div>
      </div>

      {error ? (
        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-400">
          <AlertCircle size={24} />
          <p>{error}</p>
        </div>
      ) : (
        <>
          {/* Featured Cars */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white">Featured Cars</h2>
              <button className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">View All</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading ? (
                Array(4).fill(0).map((_, i) => <CarCardSkeleton key={i} />)
              ) : featuredCars.length > 0 ? (
                featuredCars.map(car => <CarCard key={car.id} car={car} />)
              ) : (
                <div className="col-span-full">
                  <CustomerEmptyState title="No cars found" description="We couldn't find any vehicles available right now." />
                </div>
              )}
            </div>
          </section>

          {/* Recommended for You (AI) */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles size={24} className="text-emerald-400" />
                <h2 className="text-xl md:text-2xl font-bold text-white">Recommended for You</h2>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading ? (
                Array(4).fill(0).map((_, i) => <CarCardSkeleton key={i} />)
              ) : recommendedCars.length > 0 ? (
                recommendedCars.map(car => <CarCard key={car.id} car={car} />)
              ) : (
                <div className="col-span-full">
                  <CustomerEmptyState title="No recommendations" description="Book more trips to get personalized AI recommendations." />
                </div>
              )}
            </div>
          </section>

          {/* Popular Near You */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white">Popular Near You</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading ? (
                Array(4).fill(0).map((_, i) => <CarCardSkeleton key={i} />)
              ) : popularCars.length > 0 ? (
                popularCars.map(car => <CarCard key={car.id} car={car} />)
              ) : (
                <div className="col-span-full">
                  <CustomerEmptyState title="No popular cars" description="Try changing your location settings." />
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </motion.div>
  );
}

// Inline Badge component specifically for this dark theme context
function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border bg-blue-500/10 text-blue-400 border-blue-500/20 ${className}`}>
      {children}
    </span>
  );
}
