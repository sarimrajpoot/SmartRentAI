import { useState, useEffect } from "react";
import { Plus, Search, Filter, AlertCircle, Edit2, Trash2, ChevronLeft, ChevronRight, Eye, CarFront, CalendarCheck, DollarSign, Star, Navigation } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";

import { useCars } from "../../hooks/useCars";
import { createCar, updateCar, deleteCar, uploadCarImages } from "../../services/car";
import type { Car, CarCreate } from "../../types/car";
import CarFormModal from "../../components/dashboard/showroom/CarFormModal";
import StatCard from "../../components/dashboard/ui/StatCard";
import SkeletonCard from "../../components/dashboard/ui/SkeletonCard";
import { getImageUrl } from "../../utils/image";

export default function ShowroomFleet() {
  const navigate = useNavigate();
  const { data, stats, loading, error, fetchCars, fetchStats } = useCars();
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const limit = 12;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on search
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch logic
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchCars({
      search: debouncedSearch || undefined,
      sort_by: sortBy,
      page,
      limit,
    });
  }, [fetchCars, debouncedSearch, sortBy, page]);

  const handleOpenAdd = () => {
    setEditingCar(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (car: Car) => {
    setEditingCar(car);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: CarCreate, images: File[]) => {
    let savedCar;
    if (editingCar) {
      savedCar = await updateCar(editingCar.id, formData);
    } else {
      savedCar = await createCar(formData);
    }

    if (images && images.length > 0) {
      await uploadCarImages(savedCar.id, images);
    }

    await fetchCars({ search: debouncedSearch || undefined, sort_by: sortBy, page, limit });
    await fetchStats();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await deleteCar(id);
      await fetchCars({ search: debouncedSearch || undefined, sort_by: sortBy, page, limit });
      await fetchStats();
    } catch (err: any) {
      alert("Failed to delete vehicle: " + (err.response?.data?.detail || err.message));
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Unable to load fleet</h2>
        <p className="text-slate-500">{error}</p>
        <button 
          onClick={() => { fetchCars({ page, limit }); fetchStats(); }}
          className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-medium"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Fleet Management</h1>
          <p className="text-slate-500 mt-1">Manage your vehicles, pricing, and availability.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} /> Add Vehicle
        </button>
      </div>

      {/* Statistics Banner */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard title="Total Vehicles" value={stats.total_vehicles} trend={0} icon={<CarFront size={20} />} />
          <StatCard title="Available" value={stats.available_vehicles} trend={0} color="green" icon={<CarFront size={20} />} />
          <StatCard title="Booked" value={stats.booked} trend={0} color="purple" icon={<CalendarCheck size={20} />} />
          <StatCard title="Avg Daily Price" value={stats.average_daily_price} prefix="Rs " trend={0} color="blue" icon={<DollarSign size={20} />} />
          <StatCard title="Avg AI Score" value={stats.average_ai_score} suffix="/100" trend={0} color="orange" icon={<Star size={20} />} />
        </div>
      )}

      {/* Controls: Search, Filter, Sort */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by brand, model, variant, or license plate..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[160px]"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="ai_score_desc">Highest AI Score</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
          <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center text-slate-600">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Fleet Grid */}
      {loading && !data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : data?.items.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-slate-200 border-dashed">
          <img src="https://illustrations.popsy.co/blue/crashed-error.svg" alt="Empty" className="w-48 h-48 mb-6 opacity-80" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Start building your fleet</h3>
          <p className="text-slate-500 max-w-sm mb-6">You don't have any vehicles listed yet. Add your first vehicle to start receiving bookings.</p>
          <button onClick={handleOpenAdd} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-lg">
            Add Vehicle
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {data?.items.map((car: Car) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  key={car.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col"
                >
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <img 
                      src={getImageUrl(car.images?.[0] || car.image_url)} 
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=600";
                      }}
                    />
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${
                        car.is_available 
                          ? "bg-emerald-500/90 text-white" 
                          : "bg-slate-900/70 text-white"
                      }`}>
                        {car.is_available ? "Available" : "Unavailable"}
                      </span>
                      {car.ai_vehicle_score && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md bg-blue-600/90 text-white text-center">
                          AI: {car.ai_vehicle_score}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg leading-tight line-clamp-1">{car.brand} {car.model}</h3>
                        <p className="text-slate-500 text-sm">{car.year} • {car.variant || car.color || "Standard"}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600 text-lg leading-tight">Rs {car.daily_price}</div>
                        <div className="text-xs text-slate-400">/day</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4 flex-1">
                      <div className="bg-slate-50 py-1.5 px-2 rounded-lg truncate capitalize">{car.transmission.toLowerCase()}</div>
                      <div className="bg-slate-50 py-1.5 px-2 rounded-lg truncate capitalize">{car.fuel_type.toLowerCase()}</div>
                      <div className="bg-slate-50 py-1.5 px-2 rounded-lg truncate">{car.seats} Seats</div>
                      <div className="bg-slate-50 py-1.5 px-2 rounded-lg truncate font-mono">{car.license_plate}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-slate-100">
                      <button 
                        onClick={() => navigate(`/dashboard/vehicles/${car.id}`)}
                        className="flex items-center justify-center gap-1.5 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                      >
                        <Eye size={16} /> View
                      </button>
                      <button 
                        onClick={() => navigate(`/dashboard/vehicles/${car.id}/tracking`)}
                        className="flex items-center justify-center gap-1.5 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium text-sm"
                      >
                        <Navigation size={16} /> Track
                      </button>
                      <button 
                        onClick={() => handleOpenEdit(car)}
                        className="flex items-center justify-center gap-1.5 py-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors font-medium text-sm"
                      >
                        <Edit2 size={16} /> Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(car.id, `${car.brand} ${car.model}`)}
                        className="flex items-center justify-center gap-1.5 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                      >
                        <Trash2 size={16} /> Del
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {data && data.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex items-center gap-1">
                {[...Array(data.pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      page === i + 1 ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setPage(p => Math.min(data.pages, p + 1))}
                disabled={page === data.pages}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Add / Edit Modal */}
      <CarFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingCar}
      />
    </div>
  );
}
