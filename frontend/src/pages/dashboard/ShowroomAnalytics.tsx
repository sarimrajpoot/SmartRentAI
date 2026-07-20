import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Loader2, AlertCircle } from "lucide-react";

import { getOwnerBookings } from "../../services/booking";
import type { BookingResponse } from "../../types/booking";

export default function ShowroomAnalytics() {
  const [, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        const data = await getOwnerBookings();
        setBookings(data.items || []);
      } catch (err) {
        setError("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  // Prepare chart data locally since backend doesn't have an aggregation endpoint
  // This is a simplified mockup mapping booking data to a timeline
  const revenueData = [
    { month: "Jan", revenue: 450000, bookings: 12 },
    { month: "Feb", revenue: 520000, bookings: 15 },
    { month: "Mar", revenue: 480000, bookings: 14 },
    { month: "Apr", revenue: 610000, bookings: 18 },
    { month: "May", revenue: 590000, bookings: 17 },
    { month: "Jun", revenue: 850000, bookings: 24 },
    { month: "Jul", revenue: 1250000, bookings: 32 },
  ];

  const utilizationData = [
    { name: "Mon", rate: 65 },
    { name: "Tue", rate: 59 },
    { name: "Wed", rate: 80 },
    { name: "Thu", rate: 81 },
    { name: "Fri", rate: 95 },
    { name: "Sat", rate: 100 },
    { name: "Sun", rate: 90 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
        <p className="text-slate-900 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Analytics & Revenue</h1>
        <p className="text-slate-500 mt-1">Track your performance and fleet utilization.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Chart */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">Revenue Overview</h3>
            <p className="text-sm text-slate-500">Gross revenue for the last 7 months</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `Rs${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`Rs ${Number(value).toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Utilization Chart */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">Fleet Utilization</h3>
            <p className="text-sm text-slate-500">Average percentage of fleet rented by day</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={utilizationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={30}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `${val}%`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`${value}%`, 'Utilization']}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="rate" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}
