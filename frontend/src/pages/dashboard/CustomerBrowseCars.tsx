import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  Filter, 
  Fuel, 
  Settings, 
  Users, 
  MapPin, 
  Star, 
  Heart,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  Car as CarIcon
} from "lucide-react";

import { getCars } from "../../services/car";
import type { Car, CarListResponse } from "../../types/car";
import { getImageUrl } from "../../utils/image";
import { addToWishlist, removeFromWishlist, getWishlistIds } from "../../services/wishlist";

export default function CustomerBrowseCars() {
  const [data, setData] = useState<CarListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  const [filters, setFilters] = useState({
    price_min: "",
    price_max: "",
    fuel_type: "",
    transmission: "",
    seats: "",
    is_available: true,
  });
  
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    getWishlistIds().then(ids => setWishlistIds(new Set(ids))).catch(() => {});
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const toggleWishlist = async (carId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (wishlistIds.has(carId)) {
        await removeFromWishlist(carId);
        setWishlistIds(prev => { const next = new Set(prev); next.delete(carId); return next; });
        setToast({ message: 'Removed from wishlist', type: 'success' });
      } else {
        await addToWishlist(carId);
        setWishlistIds(prev => new Set(prev).add(carId));
        setToast({ message: 'Added to wishlist!', type: 'success' });
      }
    } catch (err: any) {
      setToast({ message: err.response?.data?.detail || 'Failed to update wishlist', type: 'error' });
    }
  };

  // Fetch Data
  useEffect(() => {
    async function fetchCars() {
      setLoading(true);
      try {
        const params: Record<string, any> = {
          page,
          limit: 12,
          sort_by: sortBy,
        };

        if (debouncedSearch) params.search = debouncedSearch;
        if (filters.price_min) params.price_min = filters.price_min;
        if (filters.price_max) params.price_max = filters.price_max;
        if (filters.fuel_type) params.fuel_type = filters.fuel_type;
        if (filters.transmission) params.transmission = filters.transmission;
        if (filters.seats) params.seats = filters.seats;
        if (filters.is_available) params.is_available = true;

        const response = await getCars(params);
        setData(response);
      } catch (error) {
        console.error("Failed to fetch cars", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, [debouncedSearch, filters, sortBy, page]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page on filter change
  };

  const clearFilters = () => {
    setFilters({
      price_min: "",
      price_max: "",
      fuel_type: "",
      transmission: "",
      seats: "",
      is_available: true,
    });
    setSearchQuery("");
    setSortBy("newest");
    setPage(1);
  };

  const FilterSidebar = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Filter size={20} /> Filters
        </h3>
        <button 
          onClick={clearFilters}
          className="text-sm text-zinc-400 hover:text-white transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-zinc-300">Daily Price Range (Rs)</h4>
        <div className="flex items-center gap-4">
          <input 
            type="number" 
            placeholder="Min"
            value={filters.price_min}
            onChange={(e) => handleFilterChange('price_min', e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <span className="text-zinc-500">-</span>
          <input 
            type="number" 
            placeholder="Max"
            value={filters.price_max}
            onChange={(e) => handleFilterChange('price_max', e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Vehicle Type (Fuel) */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-zinc-300">Fuel Type</h4>
        {['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID'].map(type => (
          <label key={type} className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.fuel_type === type ? 'bg-blue-600 border-blue-600' : 'border-zinc-700 group-hover:border-zinc-500 bg-zinc-900'}`}>
              {filters.fuel_type === type && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
            </div>
            <input 
              type="checkbox" 
              className="hidden" 
              checked={filters.fuel_type === type}
              onChange={() => handleFilterChange('fuel_type', filters.fuel_type === type ? "" : type)}
            />
            <span className="text-sm text-zinc-400 group-hover:text-zinc-200 capitalize">{type.toLowerCase()}</span>
          </label>
        ))}
      </div>

      {/* Transmission */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-zinc-300">Transmission</h4>
        {['AUTOMATIC', 'MANUAL'].map(type => (
          <label key={type} className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.transmission === type ? 'bg-blue-600 border-blue-600' : 'border-zinc-700 group-hover:border-zinc-500 bg-zinc-900'}`}>
              {filters.transmission === type && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
            </div>
            <input 
              type="checkbox" 
              className="hidden" 
              checked={filters.transmission === type}
              onChange={() => handleFilterChange('transmission', filters.transmission === type ? "" : type)}
            />
            <span className="text-sm text-zinc-400 group-hover:text-zinc-200 capitalize">{type.toLowerCase()}</span>
          </label>
        ))}
      </div>

      {/* Seats */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-zinc-300">Seats</h4>
        <div className="flex flex-wrap gap-2">
          {['2', '4', '5', '7'].map(num => (
            <button
              key={num}
              onClick={() => handleFilterChange('seats', filters.seats === num ? "" : num)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                filters.seats === num 
                  ? 'bg-blue-600 border-blue-500 text-white' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Availability Toggle */}
      <div className="pt-4 border-t border-zinc-800">
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-sm font-semibold text-zinc-300">Available Only</span>
          <div className={`w-12 h-6 rounded-full transition-colors relative ${filters.is_available ? 'bg-blue-600' : 'bg-zinc-800'}`}>
            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${filters.is_available ? 'translate-x-6' : 'translate-x-0'}`} />
          </div>
          <input 
            type="checkbox" 
            className="hidden" 
            checked={filters.is_available}
            onChange={(e) => handleFilterChange('is_available', e.target.checked)}
          />
        </label>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto pb-20">
      
      {/* Header & Top Bar */}
      <div className="mb-8 space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Marketplace</h1>
          <p className="text-zinc-400 mt-1">Discover and book premium vehicles.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
          {/* Search */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
            <input 
              type="text" 
              placeholder="Search by brand, model, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
            />
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* Mobile Filter Toggle */}
            <button 
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-300 hover:text-white flex-1"
            >
              <SlidersHorizontal size={20} /> Filters
            </button>

            {/* Sort */}
            <div className="relative w-full sm:w-auto flex-1 sm:flex-none">
              <select 
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="w-full appearance-none bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 pr-10 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest Additions</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="ai_score_desc">Highest AI Score</option>
                <option value="alphabetical">Brand: A to Z</option>
              </select>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 rotate-90 pointer-events-none" size={16} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-28 bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <FilterSidebar />
          </div>
        </div>

        {/* Mobile Filters Modal */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
            <div className="relative w-4/5 max-w-sm h-full bg-zinc-950 border-r border-zinc-800 p-6 overflow-y-auto">
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="absolute top-6 right-6 text-zinc-400 hover:text-white"
              >
                <X size={24} />
              </button>
              <div className="mt-8">
                <FilterSidebar />
              </div>
            </div>
          </div>
        )}

        {/* Grid Container */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-[400px] bg-zinc-900 rounded-3xl border border-zinc-800 animate-pulse" />
              ))}
            </div>
          ) : data?.items && data.items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.items.map((car: Car) => (
                  <div key={car.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden group hover:border-zinc-700 transition-colors flex flex-col h-full">
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
                      
                      <button 
                        onClick={(e) => toggleWishlist(car.id, e)}
                        className={`absolute top-4 right-4 w-10 h-10 rounded-full backdrop-blur border flex items-center justify-center transition-colors z-10 ${
                          wishlistIds.has(car.id)
                            ? 'bg-red-500 border-red-400 text-white'
                            : 'bg-zinc-900/50 border-white/10 text-white hover:bg-white hover:text-red-500'
                        }`}
                      >
                        <Heart size={18} fill={wishlistIds.has(car.id) ? 'currentColor' : 'none'} />
                      </button>

                      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                        {car.is_available ? (
                          <span className="bg-emerald-500/90 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                            Available Now
                          </span>
                        ) : (
                          <span className="bg-zinc-900/90 backdrop-blur text-zinc-400 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-zinc-800">
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
                          {car.brand} {car.model} {car.variant && <span className="text-zinc-400">{car.variant}</span>}
                        </h3>
                        <p className="text-sm text-zinc-500 mt-1 flex items-center gap-1">
                          <MapPin size={14} /> {car.city} &middot; <Star size={14} className="text-yellow-500 fill-yellow-500 inline -mt-0.5" /> 4.9
                        </p>
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

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                            <CarIcon size={14} />
                          </div>
                          <div className="text-xs">
                            <p className="text-zinc-500">Showroom</p>
                            <p className="font-medium text-zinc-300">Verified Partner</p>
                          </div>
                        </div>
                        
                        <Link 
                          to={`/cars/${car.id}`}
                          className="px-4 py-2 bg-white text-zinc-950 text-sm font-bold rounded-full hover:bg-zinc-200 transition-colors"
                        >
                          View Details
                        </Link>
                      </div>

                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {data.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button 
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="p-2 rounded-xl border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: data.pages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-xl font-bold text-sm transition-colors ${
                          page === p 
                            ? 'bg-blue-600 text-white border border-blue-500' 
                            : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <button 
                    disabled={page === data.pages}
                    onClick={() => setPage(p => p + 1)}
                    className="p-2 rounded-xl border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center h-[50vh]">
              <div className="w-16 h-16 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500 mb-6">
                <Search size={28} />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">No vehicles found</h2>
              <p className="text-zinc-400 max-w-md mx-auto mb-8">
                We couldn't find any vehicles matching your current filters. Try adjusting your search criteria or clearing your filters.
              </p>
              <button 
                onClick={clearFilters}
                className="px-6 py-3 bg-white text-zinc-950 font-bold rounded-xl hover:bg-zinc-200 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-2xl font-medium text-sm animate-in fade-in slide-in-from-top-4 ${
          toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
