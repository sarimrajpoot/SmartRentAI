import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Navigation, Zap, Battery, Fuel, Power, Activity } from "lucide-react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import 'leaflet/dist/leaflet.css';

import { useTelemetry } from "../../hooks/useTelemetry";

// Fix leaflet icon issues in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Car Icon
const carIcon = new L.DivIcon({
  html: `<div style="background-color: #2563eb; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); border: 2px solid white;">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
  </div>`,
  className: '',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

export default function VehicleTracking() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const telemetry = useTelemetry(id);

  if (!telemetry) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Connecting to vehicle telemetry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Live Telemetry <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-sm uppercase tracking-widest font-bold animate-pulse">Live</span>
          </h1>
          <p className="text-slate-500 mt-1 font-mono text-sm">Vehicle ID: {id?.split('-')[0].toUpperCase()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Map Area */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="text-blue-500" size={18} /> GPS Location
            </h2>
            <div className="text-xs font-mono bg-white px-3 py-1 rounded-full border border-slate-200 text-slate-500 shadow-sm">
              {telemetry.lat.toFixed(6)}, {telemetry.lng.toFixed(6)}
            </div>
          </div>
          <div className="flex-1 w-full bg-slate-100 relative">
            <MapContainer 
              center={[telemetry.lat, telemetry.lng]} 
              zoom={15} 
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              <Polyline 
                positions={telemetry.routeHistory} 
                pathOptions={{ color: '#3b82f6', weight: 4, opacity: 0.7 }} 
              />
              <Marker position={[telemetry.lat, telemetry.lng]} icon={carIcon}>
                <Popup>
                  <div className="font-bold">Current Location</div>
                  <div>Speed: {telemetry.speed} km/h</div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="space-y-4 flex flex-col h-full">
          
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-20 rounded-bl-full blur-2xl" />
            <h3 className="font-bold text-slate-400 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Zap size={16} /> Current Speed
            </h3>
            <div className="flex items-end gap-2">
              <span className="text-6xl font-bold font-mono text-white">{telemetry.speed}</span>
              <span className="text-xl text-slate-500 mb-1 font-medium">km/h</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                <Power size={20} />
              </div>
              <span className="block text-slate-500 text-xs font-bold uppercase mb-1">Engine</span>
              <span className={`text-xl font-bold ${telemetry.engineStatus === 'ON' ? 'text-emerald-600' : 'text-slate-900'}`}>
                {telemetry.engineStatus}
              </span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                <Navigation size={20} />
              </div>
              <span className="block text-slate-500 text-xs font-bold uppercase mb-1">Trip ETA</span>
              <span className="text-xl font-bold text-slate-900">{telemetry.etaMins} <span className="text-sm text-slate-500">mins</span></span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 flex-1">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Activity size={18} className="text-blue-500" /> Vehicle Status
            </h3>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-bold text-slate-700 flex items-center gap-1"><Fuel size={14} className="text-slate-400" /> Fuel Level</span>
                <span className="font-mono font-medium text-slate-600">{telemetry.fuelPercentage.toFixed(1)}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${telemetry.fuelPercentage > 20 ? 'bg-emerald-500' : 'bg-red-500'}`} 
                  style={{ width: `${telemetry.fuelPercentage}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-bold text-slate-700 flex items-center gap-1"><Battery size={14} className="text-slate-400" /> Battery Health</span>
                <span className="font-mono font-medium text-slate-600">{telemetry.batteryPercentage.toFixed(1)}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                  style={{ width: `${telemetry.batteryPercentage}%` }}
                />
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100">
              <span className="block text-slate-500 text-xs font-bold uppercase mb-1">Session Distance</span>
              <span className="text-2xl font-bold font-mono text-slate-900">{telemetry.distanceTravelled.toFixed(2)} <span className="text-sm font-sans font-medium text-slate-500">km</span></span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
