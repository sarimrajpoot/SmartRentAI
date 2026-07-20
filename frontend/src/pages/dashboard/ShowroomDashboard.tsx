import { useState, useEffect } from "react";
import { CarFront, CalendarCheck, DollarSign, Star, Loader2, AlertCircle, CheckCircle2, XCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import StatCard from "../../components/dashboard/ui/StatCard";
import SkeletonCard from "../../components/dashboard/ui/SkeletonCard";
import { getShowroomStats } from "../../services/dashboard";
import { getOwnerBookings, approveBooking, rejectBooking } from "../../services/booking";
import { getCar } from "../../services/car";
import type { ShowroomDashboardStats } from "../../types/dashboard";
import type { BookingResponse } from "../../types/booking";
import type { Car } from "../../types/car";

export default function ShowroomDashboard() {
  const [stats, setStats] = useState<ShowroomDashboardStats | null>(null);
  const [pendingBookings, setPendingBookings] = useState<BookingResponse[]>([]);
  const [cars, setCars] = useState<Record<string, Car>>({});
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsData, bookingsRes] = await Promise.all([
        getShowroomStats(),
        getOwnerBookings(1, 10, "", "PENDING")
      ]);
      
      const bookingsData = bookingsRes.items || [];
      
      setStats(statsData);
      setPendingBookings(bookingsData);

      // Hydrate car details for the pending bookings
      const uniqueCarIds = Array.from(new Set(bookingsData.map((b: any) => b.car_id)));
      const carPromises = uniqueCarIds.map(id => getCar(id));
      const carResults = await Promise.allSettled(carPromises);
      
      const carMap: Record<string, Car> = {};
      carResults.forEach((result) => {
        if (result.status === "fulfilled" && result.value) {
          carMap[result.value.id] = result.value;
        }
      });
      
      setCars(prev => ({ ...prev, ...carMap }));

    } catch (err: any) {
      setError("Failed to load dashboard data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    try {
      setProcessingId(id);
      if (action === "approve") {
        await approveBooking(id);
      } else {
        await rejectBooking(id);
      }
      
      // Refresh both stats and bookings silently
      await fetchDashboardData();
      
    } catch (err: any) {
      alert(`Failed to ${action} booking: ` + (err.response?.data?.detail || err.message));
    } finally {
      setProcessingId(null);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
          <AlertCircle size={32} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Unable to load dashboard</h2>
          <p className="text-slate-500 max-w-sm mt-1">{error}</p>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Showroom Dashboard</h1>
        <p className="text-slate-500 mt-1">Manage your fleet, track revenue, and review bookings.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading || !stats ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <StatCard 
              title="Total Vehicles" 
              value={stats.total_vehicles} 
              icon={<CarFront size={20} />} 
              color="blue" 
              trend={0} 
              trendLabel="active"
            />
            <StatCard 
              title="Active Rentals" 
              value={stats.active_rentals} 
              icon={<CalendarCheck size={20} />} 
              color="green" 
              trend={0} 
              trendLabel="active"
            />
            <StatCard 
              title="Monthly Revenue" 
              value={stats.monthly_revenue} 
              prefix="Rs "
              icon={<DollarSign size={20} />} 
              color="purple" 
              trend={0} 
              trendLabel="this month"
            />
            <StatCard 
              title="Average Rating" 
              value={stats.average_rating} 
              icon={<Star size={20} className="fill-current" />} 
              color="orange" 
              trend={0} 
              trendLabel="stable"
            />
          </>
        )}
      </div>

      {/* Recent Bookings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Pending Requests</h2>
          {stats && stats.pending_requests > 0 && (
            <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
              {stats.pending_requests} New
            </span>
          )}
        </div>
        
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm min-h-[300px]">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-full h-16 bg-slate-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : pendingBookings.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-[300px] text-center">
               <Clock className="w-12 h-12 text-slate-300 mb-3" />
               <p className="text-slate-900 font-medium">No pending requests</p>
               <p className="text-slate-500 text-sm max-w-sm mt-1">You're all caught up! New rental requests will appear here.</p>
             </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-700 font-medium border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Booking ID</th>
                    <th className="px-6 py-4">Vehicle</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Dates</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <AnimatePresence>
                    {pendingBookings.map((booking) => {
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
                          <td className="px-6 py-4 font-medium text-slate-900">
                            {car ? `${car.brand} ${car.model}` : "Loading..."}
                          </td>
                          <td className="px-6 py-4">
                            {booking.customer_id.split('-')[0]}
                          </td>
                          <td className="px-6 py-4">
                            {booking.start_date} <span className="text-slate-400">to</span> {booking.end_date}
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-900">
                            Rs {booking.total_price?.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              {isProcessing ? (
                                <Loader2 className="w-5 h-5 text-blue-500 animate-spin mr-2" />
                              ) : (
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
        </div>
      </div>
    </div>
  );
}
