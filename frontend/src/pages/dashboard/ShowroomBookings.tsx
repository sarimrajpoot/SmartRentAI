import { useState, useEffect, useCallback } from "react";
import { CheckCircle2, XCircle, Play, Flag, AlertCircle, Clock, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import { getOwnerBookings, approveBooking, rejectBooking, startBooking, completeBooking } from "../../services/booking";
import { getCar } from "../../services/car";
import type { BookingResponse } from "../../types/booking";
import type { Car } from "../../types/car";
import { BookingTableRowSkeleton } from "../../components/dashboard/customer/LoadingSkeletons";

export default function ShowroomBookings() {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [cars, setCars] = useState<Record<string, Car>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reset page on status filter change
  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getOwnerBookings(page, 10, debouncedSearch, statusFilter);
      setBookings(data.items || []);
      setTotalPages(data.pages || 1);

      // Hydrate car details
      const uniqueCarIds = Array.from(new Set((data.items || []).map((b: any) => b.car_id)));
      const carPromises = uniqueCarIds.map((id: string) => getCar(id));
      const carResults = await Promise.allSettled(carPromises);
      
      const carMap: Record<string, Car> = {};
      carResults.forEach((result) => {
        if (result.status === "fulfilled" && result.value) {
          carMap[result.value.id] = result.value;
        }
      });
      setCars(prev => ({ ...prev, ...carMap }));

    } catch (err: any) {
      setError("Failed to load booking requests.");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleAction = async (id: string, action: "approve" | "reject" | "start" | "complete") => {
    try {
      setProcessingId(id);
      let updatedBooking;
      
      switch (action) {
        case "approve":
          updatedBooking = await approveBooking(id);
          break;
        case "reject":
          updatedBooking = await rejectBooking(id);
          break;
        case "start":
          updatedBooking = await startBooking(id);
          break;
        case "complete":
          updatedBooking = await completeBooking(id);
          break;
      }

      setBookings(prev => prev.map(b => b.id === id ? updatedBooking : b));
      toast.success(`Booking ${action}ed successfully!`);
    } catch (err: any) {
      toast.error("Failed to process action: " + (err.response?.data?.detail || err.message));
    } finally {
      setProcessingId(null);
    }
  };

  const statusColors = {
    PENDING: "bg-yellow-50 text-yellow-600 border-yellow-200",
    CONFIRMED: "bg-blue-50 text-blue-600 border-blue-200",
    ACTIVE: "bg-emerald-50 text-emerald-600 border-emerald-200",
    COMPLETED: "bg-slate-100 text-slate-600 border-slate-200",
    CANCELLED: "bg-red-50 text-red-600 border-red-200",
    REJECTED: "bg-red-50 text-red-600 border-red-200",
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Booking Management</h1>
        <p className="text-slate-500 mt-1">Review, approve, and manage customer bookings.</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by ID or Vehicle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Filter */}
        <div className="relative w-full sm:w-48 shrink-0">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-10 pr-10 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="p-4 space-y-3">
            <BookingTableRowSkeleton />
            <BookingTableRowSkeleton />
            <BookingTableRowSkeleton />
            <BookingTableRowSkeleton />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
            <p className="text-slate-900 font-medium">{error}</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Clock className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-slate-900 font-medium">No bookings found</p>
            <p className="text-slate-500 text-sm max-w-sm mt-1">When customers book your vehicles, they will appear here for review.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                <tr>
                  <th className="px-6 py-4">Booking ID</th>
                  <th className="px-6 py-4">Vehicle</th>
                  <th className="px-6 py-4">Dates</th>
                  <th className="px-6 py-4">Total Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <AnimatePresence>
                  {bookings.map((booking) => {
                    const car = cars[booking.car_id];
                    const isProcessing = processingId === booking.id;
                    
                    return (
                      <motion.tr 
                        key={booking.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 font-mono text-xs text-slate-500">
                          {booking.id.split('-')[0].toUpperCase()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">
                            {car ? `${car.brand} ${car.model}` : "Loading..."}
                          </div>
                          <div className="text-xs text-slate-500">
                            Customer ID: {booking.customer_id.split('-')[0]}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-900">{booking.start_date}</div>
                          <div className="text-xs text-slate-500">to {booking.end_date}</div>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-900">
                          Rs {booking.total_price?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[booking.status]}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            
                            {isProcessing ? (
                              <div className="w-5 h-5 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
                            ) : (
                              <>
                                {/* Pending Actions */}
                                {booking.status === "PENDING" && (
                                  <>
                                    <button 
                                      onClick={() => handleAction(booking.id, "approve")}
                                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg font-medium transition-colors border border-emerald-200"
                                    >
                                      <CheckCircle2 size={16} /> Approve
                                    </button>
                                    <button 
                                      onClick={() => handleAction(booking.id, "reject")}
                                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors border border-red-200"
                                    >
                                      <XCircle size={16} /> Reject
                                    </button>
                                  </>
                                )}

                                {/* Confirmed Actions */}
                                {booking.status === "CONFIRMED" && (
                                  <button 
                                    onClick={() => handleAction(booking.id, "start")}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition-colors border border-blue-200"
                                  >
                                    <Play size={16} /> Handover Keys
                                  </button>
                                )}

                                {/* Active Actions */}
                                {booking.status === "ACTIVE" && (
                                  <button 
                                    onClick={() => handleAction(booking.id, "complete")}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-lg font-medium transition-colors"
                                  >
                                    <Flag size={16} /> Complete Trip
                                  </button>
                                )}

                                {/* No Actions for Completed/Cancelled/Rejected */}
                                {["COMPLETED", "CANCELLED", "REJECTED"].includes(booking.status) && (
                                  <span className="text-sm text-slate-400 font-medium">No actions</span>
                                )}
                              </>
                            )}

                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-slate-50">
            <span className="text-sm text-slate-500 font-medium">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
