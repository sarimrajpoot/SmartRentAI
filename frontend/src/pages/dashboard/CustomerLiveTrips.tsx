import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapPin,
  Calendar,
  Clock,
  Shield,
  Phone,
  AlertTriangle,
  Eye,
  Brain,
  SmartphoneNfc,
  Cigarette,
  Gauge,
  Activity,
  Fuel,
  Battery,
  Power,
  Navigation,
  Zap,
  ChevronRight,
  Car as CarIcon,
} from "lucide-react";

import { getMyBookings } from "../../services/booking";
import { getCar } from "../../services/car";
import type { BookingResponse } from "../../types/booking";
import type { Car } from "../../types/car";
import { getImageUrl } from "../../utils/image";
import { useTelemetry } from "../../hooks/useTelemetry";

// Fix leaflet icon issues in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const carIcon = new L.DivIcon({
  html: `<div style="background-color: #3b82f6; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(59,130,246,0.5); border: 3px solid white;">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
  </div>`,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// --- Simulated AI safety data ---
function useSimulatedAI() {
  const [ai, setAi] = useState({
    alertness: 94,
    drowsiness: "None",
    seatbelt: true,
    phoneUsage: false,
    smoking: false,
    fatigueScore: 8,
  });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setAi({
        alertness: Math.floor(Math.random() * 15) + 85,
        drowsiness: Math.random() > 0.9 ? "Low" : "None",
        seatbelt: Math.random() > 0.05,
        phoneUsage: Math.random() > 0.92,
        smoking: Math.random() > 0.97,
        fatigueScore: Math.floor(Math.random() * 3) + 7,
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  return ai;
}

export default function CustomerLiveTrips() {
  const [loading, setLoading] = useState(true);
  const [activeBooking, setActiveBooking] = useState<BookingResponse | null>(null);
  const [car, setCar] = useState<Car | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const telemetry = useTelemetry(car?.id);
  const ai = useSimulatedAI();

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  useEffect(() => {
    async function fetchActiveTrip() {
      try {
        setLoading(true);
        const bookings = await getMyBookings(1, 50);
        const active = bookings.items.find((b) => b.status === "ACTIVE");
        if (active) {
          setActiveBooking(active);
          const carData = await getCar(active.car_id);
          setCar(carData);
        }
      } catch (err: any) {
        setError("Failed to load trip information.");
      } finally {
        setLoading(false);
      }
    }
    fetchActiveTrip();
  }, []);

  // Compute remaining time
  const getRemainingTime = () => {
    if (!activeBooking) return null;
    const end = new Date(activeBooking.end_date);
    const now = new Date();
    const diffMs = end.getTime() - now.getTime();
    if (diffMs <= 0) return "Trip ended";
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  const tripProgress = () => {
    if (!activeBooking) return 0;
    const start = new Date(activeBooking.start_date).getTime();
    const end = new Date(activeBooking.end_date).getTime();
    const now = Date.now();
    if (now >= end) return 100;
    if (now <= start) return 0;
    return Math.round(((now - start) / (end - start)) * 100);
  };

  if (loading) {
    return (
      <div className="space-y-6 pb-12">
        <div className="h-8 w-48 bg-zinc-800 rounded-xl animate-pulse" />
        <div className="h-4 w-64 bg-zinc-800 rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[500px] bg-zinc-900 rounded-3xl animate-pulse" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-zinc-900 rounded-3xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center">
        <AlertTriangle size={40} className="text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Connection Error</h2>
        <p className="text-zinc-400 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-white text-zinc-950 rounded-xl font-bold"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!activeBooking || !car) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center">
        <div className="w-20 h-20 bg-zinc-950 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-500 mb-6">
          <CarIcon size={36} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">No Active Trip</h2>
        <p className="text-zinc-400 max-w-md mx-auto mb-8">
          You don't have an active trip at the moment. Once a showroom starts your booking, your live trip data will appear here.
        </p>
        <Link
          to="/dashboard/customer/bookings"
          className="px-6 py-3 bg-white text-zinc-950 rounded-xl font-bold hover:bg-zinc-200 transition-colors"
        >
          View My Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            Live Trip
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-bold uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> Active
            </span>
          </h1>
          <p className="text-zinc-400 mt-1">
            {car.brand} {car.model} {car.year} &middot; Booking {activeBooking.id.split("-")[0].toUpperCase()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowReportModal(true)}
            className="px-4 py-2.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-xl font-medium text-sm hover:bg-amber-500/20 transition-colors flex items-center gap-2"
          >
            <AlertTriangle size={16} /> Report Issue
          </button>
          <a
            href="tel:1166"
            className="px-4 py-2.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl font-medium text-sm hover:bg-red-500/20 transition-colors flex items-center gap-2"
          >
            <Phone size={16} /> Emergency
          </a>
        </div>
      </div>

      {/* Trip Info Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 grid grid-cols-2 md:grid-cols-5 gap-4">
        <div>
          <span className="text-xs text-zinc-500 uppercase font-bold block mb-1">Pickup</span>
          <p className="text-white font-medium flex items-center gap-1.5">
            <Calendar size={14} className="text-blue-400" /> {activeBooking.start_date}
          </p>
        </div>
        <div>
          <span className="text-xs text-zinc-500 uppercase font-bold block mb-1">Return</span>
          <p className="text-white font-medium flex items-center gap-1.5">
            <Calendar size={14} className="text-blue-400" /> {activeBooking.end_date}
          </p>
        </div>
        <div>
          <span className="text-xs text-zinc-500 uppercase font-bold block mb-1">Remaining</span>
          <p className="text-white font-medium flex items-center gap-1.5">
            <Clock size={14} className="text-amber-400" /> {getRemainingTime()}
          </p>
        </div>
        <div>
          <span className="text-xs text-zinc-500 uppercase font-bold block mb-1">Total Cost</span>
          <p className="text-white font-bold">Rs {activeBooking.total_price.toLocaleString()}</p>
        </div>
        <div>
          <span className="text-xs text-zinc-500 uppercase font-bold block mb-1">Trip Progress</span>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                style={{ width: `${tripProgress()}%` }}
              />
            </div>
            <span className="text-xs text-zinc-400 font-mono">{tripProgress()}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col h-[520px]">
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
            <h2 className="font-bold text-white flex items-center gap-2">
              <MapPin className="text-blue-400" size={18} /> Live GPS
              <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded uppercase font-bold tracking-wider ml-1">
                Simulated
              </span>
            </h2>
            {telemetry && (
              <div className="text-xs font-mono bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800 text-zinc-400">
                {telemetry.lat.toFixed(6)}, {telemetry.lng.toFixed(6)}
              </div>
            )}
          </div>
          <div className="flex-1 w-full bg-zinc-950 relative">
            {telemetry ? (
              <MapContainer
                center={[telemetry.lat, telemetry.lng]}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
                zoomControl={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                <Polyline
                  positions={telemetry.routeHistory}
                  pathOptions={{ color: "#3b82f6", weight: 4, opacity: 0.7 }}
                />
                <Marker position={[telemetry.lat, telemetry.lng]} icon={carIcon}>
                  <Popup>
                    <div className="font-bold">{car.brand} {car.model}</div>
                    <div>Speed: {telemetry.speed} km/h</div>
                  </Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-500">
                <div className="w-10 h-10 border-4 border-zinc-800 border-t-blue-500 rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Vehicle Status */}
        <div className="space-y-4">
          {/* Speed Card */}
          <div className="bg-zinc-900 text-white rounded-3xl p-6 border border-zinc-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500 opacity-10 rounded-bl-full blur-2xl" />
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider flex items-center gap-1">
                <Zap size={14} /> Speed
                <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded ml-1">SIM</span>
              </span>
              <span className={`w-2 h-2 rounded-full ${telemetry && telemetry.speed > 0 ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"}`} />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold font-mono">{telemetry?.speed ?? 0}</span>
              <span className="text-xl text-zinc-500 mb-1">km/h</span>
            </div>
          </div>

          {/* Engine & ETA */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
              <Power size={18} className="text-emerald-400 mb-2" />
              <span className="block text-zinc-500 text-[10px] uppercase font-bold mb-0.5">Engine</span>
              <span className={`text-lg font-bold ${telemetry?.engineStatus === "ON" ? "text-emerald-400" : "text-zinc-400"}`}>
                {telemetry?.engineStatus ?? "—"}
              </span>
            </div>
            <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
              <Navigation size={18} className="text-blue-400 mb-2" />
              <span className="block text-zinc-500 text-[10px] uppercase font-bold mb-0.5">ETA</span>
              <span className="text-lg font-bold text-white">
                {telemetry?.etaMins ?? "—"} <span className="text-xs text-zinc-500">min</span>
              </span>
            </div>
          </div>

          {/* Fuel & Battery */}
          <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-bold text-zinc-300 flex items-center gap-1"><Fuel size={14} className="text-zinc-500" /> Fuel</span>
                <span className="font-mono text-zinc-400">{telemetry?.fuelPercentage.toFixed(1) ?? "—"}%</span>
              </div>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${(telemetry?.fuelPercentage ?? 0) > 20 ? "bg-emerald-500" : "bg-red-500"}`}
                  style={{ width: `${telemetry?.fuelPercentage ?? 0}%` }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-bold text-zinc-300 flex items-center gap-1"><Battery size={14} className="text-zinc-500" /> Battery</span>
                <span className="font-mono text-zinc-400">{telemetry?.batteryPercentage.toFixed(1) ?? "—"}%</span>
              </div>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                  style={{ width: `${telemetry?.batteryPercentage ?? 0}%` }}
                />
              </div>
            </div>
            <div className="pt-3 border-t border-zinc-800">
              <span className="block text-zinc-500 text-[10px] uppercase font-bold mb-0.5">Distance</span>
              <span className="text-xl font-bold font-mono text-white">
                {telemetry?.distanceTravelled.toFixed(2) ?? "—"} <span className="text-xs text-zinc-500 font-sans">km</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Safety Monitoring */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Brain className="text-purple-400" size={22} /> AI Safety Monitoring
          <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
            Simulated
          </span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <AICard
            icon={<Eye size={20} />}
            label="Alertness"
            value={`${ai.alertness}%`}
            color={ai.alertness >= 90 ? "emerald" : ai.alertness >= 75 ? "amber" : "red"}
          />
          <AICard
            icon={<Activity size={20} />}
            label="Drowsiness"
            value={ai.drowsiness}
            color={ai.drowsiness === "None" ? "emerald" : "amber"}
          />
          <AICard
            icon={<Shield size={20} />}
            label="Seatbelt"
            value={ai.seatbelt ? "On" : "Off"}
            color={ai.seatbelt ? "emerald" : "red"}
          />
          <AICard
            icon={<SmartphoneNfc size={20} />}
            label="Phone Usage"
            value={ai.phoneUsage ? "Detected" : "Clear"}
            color={ai.phoneUsage ? "red" : "emerald"}
          />
          <AICard
            icon={<Cigarette size={20} />}
            label="Smoking"
            value={ai.smoking ? "Detected" : "Clear"}
            color={ai.smoking ? "red" : "emerald"}
          />
          <AICard
            icon={<Gauge size={20} />}
            label="Fatigue Score"
            value={`${ai.fatigueScore}/10`}
            color={ai.fatigueScore >= 7 ? "emerald" : ai.fatigueScore >= 4 ? "amber" : "red"}
          />
        </div>
      </div>

      {/* Vehicle Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-64 h-48 md:h-auto bg-zinc-950 shrink-0">
          <img
            src={getImageUrl(car.images?.[0] || car.image_url)}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=600";
            }}
          />
        </div>
        <div className="p-6 flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white">
              {car.brand} {car.model} <span className="text-zinc-500">{car.year}</span>
            </h3>
            <p className="text-sm text-zinc-400 mt-1 flex items-center gap-1.5">
              <MapPin size={14} /> {car.city} &middot; {car.transmission} &middot; {car.fuel_type} &middot; {car.seats} seats
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to={`/cars/${car.id}`}
              className="px-4 py-2.5 bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-xl font-medium text-sm hover:bg-zinc-700 transition-colors flex items-center gap-2"
            >
              Vehicle Details <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Report Issue Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowReportModal(false)} />
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Report an Issue</h3>
            <p className="text-zinc-400 text-sm mb-6">Describe the issue you're experiencing during your trip.</p>
            <textarea
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none h-32 mb-4"
              placeholder="Describe the issue..."
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 px-4 py-3 bg-zinc-800 text-zinc-300 rounded-xl font-medium hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setToast({ message: "Issue reported successfully. Our team will review it.", type: "success" });
                }}
                className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-2xl font-medium text-sm ${
          toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

// --- AI Monitoring Card Component ---
function AICard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "emerald" | "amber" | "red";
}) {
  const colorMap = {
    emerald: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      icon: "text-emerald-400",
      value: "text-emerald-400",
    },
    amber: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      icon: "text-amber-400",
      value: "text-amber-400",
    },
    red: {
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      icon: "text-red-400",
      value: "text-red-400",
    },
  };
  const c = colorMap[color];

  return (
    <div className={`${c.bg} border ${c.border} rounded-2xl p-4`}>
      <div className={`${c.icon} mb-2`}>{icon}</div>
      <span className="block text-zinc-500 text-[10px] uppercase font-bold mb-1">{label}</span>
      <span className={`text-lg font-bold ${c.value}`}>{value}</span>
    </div>
  );
}
