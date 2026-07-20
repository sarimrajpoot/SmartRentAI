import { useState, useEffect } from "react";
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  useMap 
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { 
  Car, 
  MapPin, 
  Search, 
  Battery, 
  Fuel, 
  Gauge, 
  Activity, 
  User, 
  AlertTriangle, 
  PlayCircle, 
  Power, 
  Clock, 
  AlertCircle
} from "lucide-react";
import { getShowroomTracking, type ShowroomTrackingItem } from "../../services/dashboard";
import { getImageUrl } from "../../utils/image";
import StatCard from "../../components/dashboard/ui/StatCard";

// Fix Leaflet marker icons in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom map center controller helper
function ChangeMapCenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14);
  }, [center, map]);
  return null;
}

export default function ShowroomTracking() {
  const [vehicles, setVehicles] = useState<ShowroomTrackingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "available" | "offline" | "attention">("all");
  const [selectedVehicle, setSelectedVehicle] = useState<ShowroomTrackingItem | null>(null);

  useEffect(() => {
    async function loadTrackingData() {
      try {
        setLoading(true);
        const data = await getShowroomTracking();
        setVehicles(data);
        
        // Default select the first active/online vehicle
        const activeVeh = data.find(v => v.status === "ACTIVE" && v.telemetry);
        if (activeVeh) {
          setSelectedVehicle(activeVeh);
        } else if (data.length > 0) {
          setSelectedVehicle(data[0]);
        }
      } catch (err: any) {
        setError("Failed to fetch fleet tracking details.");
      } finally {
        setLoading(false);
      }
    }
    loadTrackingData();
  }, []);

  // Filter vehicles
  const filteredVehicles = vehicles.filter(v => {
    const searchLower = search.toLowerCase();
    const matchesSearch = 
      `${v.brand} ${v.model}`.toLowerCase().includes(searchLower) ||
      v.license_plate.toLowerCase().includes(searchLower);

    if (!matchesSearch) return false;

    if (activeFilter === "active") return v.status === "ACTIVE";
    if (activeFilter === "available") return v.status === "AVAILABLE";
    if (activeFilter === "offline") return v.status === "OFFLINE";
    if (activeFilter === "attention") {
      return (
        v.has_damage_alerts || 
        (v.telemetry && (v.telemetry.fuel_level < 20 || v.telemetry.battery_level < 11.5)) ||
        (v.alertness && v.alertness < 80)
      );
    }

    return true;
  });

  // Calculate statistics
  const totalVehicles = vehicles.length;
  const activeTrips = vehicles.filter(v => v.status === "ACTIVE").length;
  const availableVehicles = vehicles.filter(v => v.status === "AVAILABLE").length;
  const alertVehicles = vehicles.filter(v => {
    return (
      v.has_damage_alerts || 
      (v.telemetry && (v.telemetry.fuel_level < 20 || v.telemetry.battery_level < 11.5)) ||
      (v.alertness && v.alertness < 80)
    );
  }).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-24 bg-white border border-slate-200 rounded-3xl animate-pulse" />)}
        </div>
        <div className="h-[600px] bg-white border border-slate-200 rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <AlertCircle size={40} className="text-red-500" />
        <h2 className="text-xl font-bold text-slate-900">Telemetry connection error</h2>
        <p className="text-slate-500">{error}</p>
      </div>
    );
  }

  // Create custom Leaflet markers based on status
  const getMarkerIcon = (status: string, selected: boolean) => {
    const color = selected ? "#3b82f6" : status === "ACTIVE" ? "#10b981" : status === "AVAILABLE" ? "#6366f1" : "#94a3b8";
    return new L.DivIcon({
      html: `<div style="background-color: ${color}; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.25); border: 3px solid white;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
      </div>`,
      className: "",
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });
  };

  const selectedCenter: [number, number] = selectedVehicle?.telemetry 
    ? [selectedVehicle.telemetry.latitude, selectedVehicle.telemetry.longitude] 
    : [-33.8688, 151.2093];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          Fleet Telemetry Dashboard
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-xs uppercase tracking-wider font-bold animate-pulse">Live</span>
        </h1>
        <p className="text-slate-500 mt-1">Real-time GPS mapping, fuel diagnostics, battery status, and AI driver alertness monitoring.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Vehicles" value={totalVehicles} icon={<Car className="text-blue-500" />} />
        <StatCard title="Active Trips" value={activeTrips} icon={<MapPin className="text-emerald-500" />} />
        <StatCard title="Available Vehicles" value={availableVehicles} icon={<PlayCircle className="text-indigo-500" />} />
        <StatCard title="Vehicles with Alerts" value={alertVehicles} icon={<AlertTriangle className="text-red-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[650px]">
        {/* Left column: Vehicles listing panel */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-4 flex flex-col h-full overflow-hidden shadow-sm">
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by brand, model, plate..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-3 border-b border-slate-100 mb-3 scrollbar-hide shrink-0">
            <FilterPill active={activeFilter === "all"} onClick={() => setActiveFilter("all")} label="All" />
            <FilterPill active={activeFilter === "active"} onClick={() => setActiveFilter("active")} label="Active" />
            <FilterPill active={activeFilter === "available"} onClick={() => setActiveFilter("available")} label="Available" />
            <FilterPill active={activeFilter === "offline"} onClick={() => setActiveFilter("offline")} label="Offline" />
            <FilterPill active={activeFilter === "attention"} onClick={() => setActiveFilter("attention")} label="Alerts" />
          </div>

          {/* Vehicle items list */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {filteredVehicles.map(v => (
              <div 
                key={v.id}
                onClick={() => setSelectedVehicle(v)}
                className={`p-3 border rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                  selectedVehicle?.id === v.id 
                    ? "bg-slate-50 border-blue-500 shadow-sm" 
                    : "border-slate-150 hover:bg-slate-50/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-9 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                    <img 
                      src={getImageUrl(v.images?.[0] || v.image_url)} 
                      alt={`${v.brand} ${v.model}`} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=600";
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-950 text-xs">{v.brand} {v.model}</h4>
                    <p className="text-[10px] text-slate-400 font-mono font-medium">{v.license_plate} &middot; {v.year}</p>
                  </div>
                </div>
                
                <div className="text-right space-y-1">
                  <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    v.status === "ACTIVE" 
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                      : v.status === "AVAILABLE"
                        ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
                        : "bg-slate-100 text-slate-500"
                  }`}>{v.status}</span>
                  {v.telemetry && <p className="text-[10px] text-slate-500 font-mono">{v.telemetry.speed.toFixed(0)} km/h</p>}
                </div>
              </div>
            ))}
            {filteredVehicles.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-xs">No matching fleet vehicles tracked.</div>
            )}
          </div>
        </div>

        {/* Right column: Live telemetry map & drawer details panel */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col h-full relative shadow-sm">
          
          {/* Telemetry Map */}
          <div className="flex-1 w-full bg-slate-100 z-10">
            <MapContainer
              center={selectedCenter}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              {selectedVehicle?.telemetry && (
                <ChangeMapCenter center={[selectedVehicle.telemetry.latitude, selectedVehicle.telemetry.longitude]} />
              )}
              {vehicles.map(v => {
                if (!v.telemetry) return null;
                return (
                  <Marker 
                    key={v.id} 
                    position={[v.telemetry.latitude, v.telemetry.longitude]}
                    icon={getMarkerIcon(v.status, selectedVehicle?.id === v.id)}
                    eventHandlers={{
                      click: () => setSelectedVehicle(v)
                    }}
                  >
                    <Popup>
                      <div className="space-y-1">
                        <p className="font-bold text-slate-900">{v.brand} {v.model}</p>
                        <p className="text-xs text-slate-500">Speed: {v.telemetry.speed.toFixed(0)} km/h &bull; Status: {v.status}</p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>

          {/* Floating Details Drawer Panel (bottom sliding overlay) */}
          {selectedVehicle && (
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-5 z-20 shadow-2xl flex flex-col md:flex-row justify-between items-stretch gap-6 transition-all duration-300">
              
              {/* Telemetry diagnostics */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-slate-900 text-lg">{selectedVehicle.brand} {selectedVehicle.model}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedVehicle.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                  }`}>{selectedVehicle.status}</span>
                </div>
                
                {selectedVehicle.telemetry ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-slate-700">
                    <div className="flex items-center gap-2">
                      <Gauge size={16} className="text-blue-500 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Speed</span>
                        <span className="font-bold text-slate-900">{selectedVehicle.telemetry.speed.toFixed(0)} km/h</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Fuel size={16} className="text-emerald-500 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Fuel Level</span>
                        <span className="font-bold text-slate-900">{selectedVehicle.telemetry.fuel_level.toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Battery size={16} className="text-orange-500 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Battery</span>
                        <span className="font-bold text-slate-900">{selectedVehicle.telemetry.battery_level.toFixed(1)} V</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Power size={16} className="text-indigo-500 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Ignition</span>
                        <span className="font-bold text-slate-900">{selectedVehicle.telemetry.ignition_on ? "ON" : "OFF"}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Offline. No diagnostic telemetry signal detected.</p>
                )}
              </div>

              {/* Driver & AI Status info */}
              <div className="flex-1 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 flex flex-col justify-between gap-4">
                {selectedVehicle.status === "ACTIVE" && selectedVehicle.driver ? (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-slate-400" />
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Current Driver</span>
                            <span className="font-bold text-slate-900 text-xs">{selectedVehicle.driver.full_name}</span>
                          </div>
                        </div>
                        {typeof selectedVehicle.remaining_minutes === "number" && (
                          <span className="text-xs text-slate-500 flex items-center gap-1"><Clock size={12} /> {Math.ceil(selectedVehicle.remaining_minutes / 60)} hrs left</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                      <div className={`p-2 border rounded-xl font-bold ${selectedVehicle.alertness && selectedVehicle.alertness >= 90 ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-amber-50 border-amber-100 text-amber-600"}`}>
                        Alertness: {selectedVehicle.alertness}%
                      </div>
                      <div className={`p-2 border rounded-xl font-bold ${selectedVehicle.phone_usage ? "bg-red-50 border-red-100 text-red-600" : "bg-emerald-50 border-emerald-100 text-emerald-700"}`}>
                        Phone: {selectedVehicle.phone_usage ? "Alert" : "Clear"}
                      </div>
                      <div className={`p-2 border rounded-xl font-bold ${selectedVehicle.has_damage_alerts ? "bg-red-50 border-red-100 text-red-600" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                        Damage: {selectedVehicle.has_damage_alerts ? "Alert" : "Clean"}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center text-xs">
                    <Activity size={24} className="mb-1 text-slate-350" />
                    No active rental trip currently registered.
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// Mini filter pill button
function FilterPill({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border shrink-0 ${
        active 
          ? "bg-slate-900 border-slate-900 text-white shadow-sm" 
          : "bg-white border-slate-200 text-slate-500 hover:text-slate-950 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );
}
