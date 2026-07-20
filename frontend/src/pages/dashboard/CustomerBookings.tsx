import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, AlertCircle, Search, ChevronLeft, ChevronRight } from "lucide-react";

import { getMyBookings } from "../../services/booking";
import { getCar } from "../../services/car";
import type { BookingResponse } from "../../types/booking";
import type { Car } from "../../types/car";

import BookingTabs from "../../components/dashboard/customer/booking/BookingTabs";
import type { BookingTab } from "../../components/dashboard/customer/booking/BookingTabs";
import BookingCard from "../../components/dashboard/customer/booking/BookingCard";
import CustomerEmptyState from "../../components/dashboard/customer/CustomerEmptyState";
import { BookingCardSkeleton } from "../../components/dashboard/customer/LoadingSkeletons";

export default function CustomerBookings() {
  const [activeTab, setActiveTab] = useState<BookingTab>("upcoming");
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [cars, setCars] = useState<Record<string, Car>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reset page on tab change
  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const fetchBookingsAndCars = useCallback(async () => {
    try {
      setLoading(true);
      // Let's pass the activeTab directly to backend as an extended status filter, or we will just implement it in backend.
      
      const data = await getMyBookings(page, 10, debouncedSearch, activeTab);
      setBookings(data.items || []);
      setTotalPages(data.pages || 1);

      // 2. Hydrate cars
      const uniqueCarIds = Array.from(new Set((data.items || []).map((b: any) => b.car_id)));
      const carPromises = uniqueCarIds.map((id: string) => getCar(id));
      const carResults = await Promise.allSettled(carPromises);
      
      const carMap: Record<string, Car> = {};
      carResults.forEach((result) => {
        if (result.status === "fulfilled" && result.value) {
          carMap[result.value.id] = result.value;
        }
      });
      setCars((prev) => ({ ...prev, ...carMap }));

    } catch (err: any) {
      console.error(err);
      setError("Failed to load your bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, activeTab]);

  useEffect(() => {
    fetchBookingsAndCars();
  }, [fetchBookingsAndCars]);

  return (
    <div className="max-w-5xl mx-auto pb-20">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">My Bookings</h1>
        <p className="text-zinc-400">Manage your upcoming trips, active rentals, and history.</p>
      </div>

      {/* Search and Tabs */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <BookingTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="space-y-4">
            <BookingCardSkeleton />
            <BookingCardSkeleton />
            <BookingCardSkeleton />
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-center justify-center gap-2 text-red-400">
            <AlertCircle size={20} /> {error}
          </div>
        ) : bookings.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <CustomerEmptyState 
              icon={<CalendarDays size={48} className="text-zinc-500 mb-4" />}
              title={`No ${activeTab} bookings`}
              description="You don't have any trips in this category right now."
            />
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {bookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <BookingCard booking={booking} car={cars[booking.car_id]} />
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-8 border-t border-zinc-800/60 mt-8">
                <span className="text-sm text-zinc-500">Page {page} of {totalPages}</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white disabled:opacity-50 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white disabled:opacity-50 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
