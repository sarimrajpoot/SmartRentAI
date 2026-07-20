import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Edit2, Trash2, MapPin, Gauge, ShieldCheck, Cpu, Battery, Activity, Loader2, AlertCircle, Navigation } from "lucide-react";

import { useVehicle } from "../../hooks/useVehicle";
import CarFormModal from "../../components/dashboard/showroom/CarFormModal";
import type { CarCreate } from "../../types/car";
import { getImageUrl } from "../../utils/image";

export default function VehicleDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { vehicle, loading, error, fetchVehicle, modifyVehicle, removeVehicle, uploadImages } = useVehicle();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchVehicle(id);
    }
  }, [id, fetchVehicle]);

  const handleSubmit = async (formData: CarCreate, images: File[]) => {
    if (!id) return;
    await modifyVehicle(id, formData);
    if (images && images.length > 0) {
      await uploadImages(id, images);
    }
    await fetchVehicle(id);
  };

  const handleDelete = async () => {
    if (!id || !vehicle) return;
    if (!window.confirm(`Are you sure you want to delete ${vehicle.brand} ${vehicle.model}?`)) return;
    try {
      await removeVehicle(id);
      navigate("/dashboard/showroom/fleet");
    } catch (err) {
      alert("Failed to delete vehicle.");
    }
  };

  if (loading && !vehicle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <Loader2 size={32} className="text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium">Loading vehicle details...</p>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Vehicle Not Found</h2>
        <p className="text-slate-500">{error}</p>
        <button 
          onClick={() => navigate("/dashboard/showroom/fleet")}
          className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-medium"
        >
          Back to Fleet
        </button>
      </div>
    );
  }

  const allImages = vehicle.images?.length ? vehicle.images : (vehicle.image_url ? [vehicle.image_url] : []);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                {vehicle.brand} {vehicle.model}
              </h1>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                vehicle.is_available ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
              }`}>
                {vehicle.is_available ? "Available" : "Unavailable"}
              </span>
            </div>
            <p className="text-slate-500 mt-1">{vehicle.year} • {vehicle.variant || vehicle.color || "Standard"} • {vehicle.license_plate}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(`/dashboard/vehicles/${vehicle.id}/tracking`)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl font-medium hover:bg-indigo-100 transition-colors"
          >
            <Navigation size={18} /> Track Live
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-medium hover:bg-blue-100 transition-colors"
          >
            <Edit2 size={18} /> Edit
          </button>
          <button 
            onClick={handleDelete}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors"
          >
            <Trash2 size={18} /> Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Gallery & Overview */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Gallery */}
          <div className="space-y-4">
            <div className="aspect-[16/9] rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 relative group">
              {allImages.length > 0 ? (
                <img 
                  src={getImageUrl(allImages[activeImageIndex])} 
                  alt={`${vehicle.brand} ${vehicle.model}`} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=600";
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                  <Activity size={48} className="mb-2 opacity-50" />
                  <p>No images available</p>
                </div>
              )}
            </div>
            
            {allImages.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {allImages.map((img: string, idx: number) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx ? "border-blue-500 ring-2 ring-blue-500/20" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img 
                      src={getImageUrl(img)} 
                      alt={`Thumbnail ${idx}`} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=600";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Specifications */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Gauge className="text-blue-500" /> Technical Specifications
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-1">
                <span className="text-sm text-slate-500">Transmission</span>
                <p className="font-medium text-slate-900 capitalize">{vehicle.transmission.toLowerCase()}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-slate-500">Fuel Type</span>
                <p className="font-medium text-slate-900 capitalize">{vehicle.fuel_type.toLowerCase()}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-slate-500">Seats</span>
                <p className="font-medium text-slate-900">{vehicle.seats} Adults</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-slate-500">Color</span>
                <p className="font-medium text-slate-900 capitalize">{vehicle.color || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & IoT */}
        <div className="space-y-6">
          
          {/* Pricing Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-400 opacity-10 rounded-bl-full" />
            <div className="relative z-10">
              <span className="text-slate-500 font-medium">Daily Rental Rate</span>
              <div className="flex items-end gap-2 mt-2">
                <span className="text-4xl font-bold text-slate-900">Rs {vehicle.daily_price.toLocaleString()}</span>
                <span className="text-slate-500 font-medium mb-1">/ day</span>
              </div>
            </div>
          </div>

          {/* AI Score */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">AI Vehicle Score</h3>
                <p className="text-sm text-slate-500">Powered by SmartRentAI</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between items-end mb-2">
                <span className="text-3xl font-bold text-blue-600">{vehicle.ai_vehicle_score || 0}<span className="text-lg text-slate-400">/100</span></span>
                <span className="text-sm font-medium text-emerald-500">Excellent Condition</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" 
                  style={{ width: `${vehicle.ai_vehicle_score || 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* IoT Telemetry */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="text-slate-400" /> IoT Integration
            </h3>
            
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-lg ${vehicle.gps_device_id ? "bg-emerald-50 text-emerald-500" : "bg-slate-50 text-slate-400"}`}>
                <MapPin size={20} />
              </div>
              <div>
                <span className="block text-sm font-medium text-slate-900">GPS Tracker</span>
                <span className="text-sm text-slate-500">{vehicle.gps_device_id ? `Active (${vehicle.gps_device_id})` : "Not installed"}</span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-lg ${vehicle.fuel_sensor_id ? "bg-emerald-50 text-emerald-500" : "bg-slate-50 text-slate-400"}`}>
                <Battery size={20} />
              </div>
              <div>
                <span className="block text-sm font-medium text-slate-900">Fuel/Battery Sensor</span>
                <span className="text-sm text-slate-500">{vehicle.fuel_sensor_id ? `Active (${vehicle.fuel_sensor_id})` : "Not installed"}</span>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
            <div className="flex flex-col gap-2 text-xs font-medium text-slate-500">
              <div className="flex justify-between">
                <span>Vehicle ID</span>
                <span className="font-mono text-slate-900">{vehicle.id.split('-')[0]}</span>
              </div>
              <div className="flex justify-between">
                <span>Created</span>
                <span className="text-slate-900">{new Date(vehicle.created_at || "").toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated</span>
                <span className="text-slate-900">{new Date(vehicle.updated_at || "").toLocaleDateString()}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <CarFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={vehicle}
      />
    </div>
  );
}
