import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { 
  Users, 
  Search, 
  Filter, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  CalendarCheck, 
  Star, 
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  TrendingUp
} from "lucide-react";
import { getShowroomCustomers, type ShowroomCustomer } from "../../services/dashboard";
import StatCard from "../../components/dashboard/ui/StatCard";

export default function ShowroomCustomers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<ShowroomCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "repeat" | "verified" | "with_active">("all");
  const [sortBy, setSortBy] = useState("bookings_desc");

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    async function loadCustomers() {
      try {
        setLoading(true);
        const data = await getShowroomCustomers();
        setCustomers(data);
      } catch (err: any) {
        setError("Failed to load customers data.");
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, []);

  // Filtered & Sorted Customers
  const filteredCustomers = customers.filter(c => {
    // Search match
    const searchLower = search.toLowerCase();
    const matchesSearch = 
      c.full_name.toLowerCase().includes(searchLower) ||
      c.email.toLowerCase().includes(searchLower) ||
      (c.phone && c.phone.toLowerCase().includes(searchLower));

    if (!matchesSearch) return false;

    // Filter match
    if (activeFilter === "active") return c.active_bookings > 0;
    if (activeFilter === "repeat") return c.total_bookings > 1;
    if (activeFilter === "verified") return c.is_verified;
    if (activeFilter === "with_active") return c.active_bookings > 0;

    return true;
  });

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (sortBy === "bookings_desc") return b.total_bookings - a.total_bookings;
    if (sortBy === "newest") return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    if (sortBy === "rating_desc") return b.risk_score - a.risk_score; // risk_score is used as safety proxy
    if (sortBy === "alphabetical") return a.full_name.localeCompare(b.full_name);
    return 0;
  });

  // Pagination math
  const totalItems = sortedCustomers.length;
  const totalPages = Math.ceil(totalItems / limit) || 1;
  const paginatedCustomers = sortedCustomers.slice((page - 1) * limit, page * limit);

  // Statistics calculation
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.active_bookings > 0).length;
  const repeatCustomers = customers.filter(c => c.total_bookings > 1).length;
  // Safety average mapping (100 - risk_score as rating score proxy)
  const averageRating = totalCustomers > 0 
    ? (customers.reduce((acc, c) => acc + (100 - c.risk_score), 0) / totalCustomers / 20).toFixed(1) 
    : "5.0";

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-white border border-slate-200 rounded-3xl animate-pulse" />)}
        </div>
        <div className="h-[400px] bg-white border border-slate-200 rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <AlertCircle size={40} className="text-red-500" />
        <h2 className="text-xl font-bold text-slate-900">Unable to load customers</h2>
        <p className="text-slate-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Customer Management</h1>
        <p className="text-slate-500 mt-1">Monitor, review, and view booking history of your registered clients.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Customers" value={totalCustomers} icon={<Users className="text-blue-500" />} />
        <StatCard title="Active Customers" value={activeCustomers} icon={<CalendarCheck className="text-emerald-500" />} />
        <StatCard title="Repeat Customers" value={repeatCustomers} icon={<TrendingUp className="text-purple-500" />} />
        <StatCard title="Average Rating" value={parseFloat(averageRating)} suffix=" / 5.0" icon={<Star className="text-yellow-500 fill-yellow-500" />} />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 border border-slate-200 rounded-2xl">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Filters Select */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-600">
            <Filter size={16} />
            <select
              value={activeFilter}
              onChange={(e) => {
                setActiveFilter(e.target.value as any);
                setPage(1);
              }}
              className="bg-transparent focus:outline-none cursor-pointer text-slate-700 font-medium"
            >
              <option value="all">All Customers</option>
              <option value="active">Active Rentals Only</option>
              <option value="repeat">Repeat Customers</option>
              <option value="verified">Verified Only</option>
            </select>
          </div>

          {/* Sort Select */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="bookings_desc">Sort by: Most Bookings</option>
            <option value="newest">Sort by: Newest Customer</option>
            <option value="rating_desc">Sort by: Highest Safety Rating</option>
            <option value="alphabetical">Sort by: Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase font-bold">
                <th className="p-4">Customer</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Bookings Stats</th>
                <th className="p-4">Last Booking Date</th>
                <th className="p-4">Verification</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                        {c.profile_picture ? (
                          <img src={c.profile_picture} alt={c.full_name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-blue-600 bg-blue-50 uppercase">
                            {c.full_name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{c.full_name}</p>
                        <p className="text-xs text-slate-400 font-mono">ID: {c.id.split('-')[0].toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-0.5">
                      <p className="flex items-center gap-1.5 text-slate-600"><Mail size={14} className="text-slate-400" /> {c.email}</p>
                      {c.phone && <p className="flex items-center gap-1.5 text-slate-600"><Phone size={14} className="text-slate-400" /> {c.phone}</p>}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex gap-2">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-semibold text-slate-600">{c.total_bookings} Total</span>
                        {c.active_bookings > 0 && <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-xs font-semibold">{c.active_bookings} Active</span>}
                      </div>
                      <p className="text-xs text-slate-500">Spending: Rs {c.total_spending.toLocaleString()}</p>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 font-medium">
                    {c.last_booking_date ? new Date(c.last_booking_date).toLocaleDateString() : "—"}
                  </td>
                  <td className="p-4">
                    {c.is_verified ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-xs bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                        <CheckCircle2 size={12} /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-500 font-semibold text-xs bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
                        <XCircle size={12} /> Unverified
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/dashboard/showroom/customers/${c.id}`)}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        title="View Profile Details"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {paginatedCustomers.length === 0 && (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <Users size={48} className="mx-auto text-slate-300" />
            <h3 className="font-bold text-slate-900 text-lg">No customers found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">Try clearing search parameters or adjusting active list filters.</p>
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Showing page {page} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 disabled:opacity-50 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                disabled={page === totalPages}
                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 disabled:opacity-50 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
