import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CarFront, Loader2 } from "lucide-react";
import type { Car, CarCreate } from "../../../types/car";
import ImageUploader from "../fleet/ImageUploader";

interface CarFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CarCreate, images: File[]) => Promise<void>;
  initialData?: Car | null;
}

const defaultFormData: CarCreate = {
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  city: "",
  daily_price: 5000,
  transmission: "AUTOMATIC",
  fuel_type: "Petrol",
  seats: 5,
  color: "",
  variant: "",
  license_plate: "",
  gps_device_id: "",
  fuel_sensor_id: "",
  ai_vehicle_score: 0,
  is_available: true,
};

export default function CarFormModal({ isOpen, onClose, onSubmit, initialData }: CarFormModalProps) {
  const [formData, setFormData] = useState<CarCreate>(defaultFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        brand: initialData.brand,
        model: initialData.model,
        year: initialData.year,
        city: initialData.city,
        daily_price: initialData.daily_price,
        transmission: initialData.transmission,
        fuel_type: initialData.fuel_type,
        seats: initialData.seats,
        color: initialData.color || "",
        variant: initialData.variant || "",
        license_plate: initialData.license_plate || "",
        gps_device_id: initialData.gps_device_id || "",
        fuel_sensor_id: initialData.fuel_sensor_id || "",
        ai_vehicle_score: initialData.ai_vehicle_score || 0,
        is_available: initialData.is_available,
      });
    } else {
      setFormData(defaultFormData);
    }
    setImages([]);
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await onSubmit(formData, images);
      onClose();
    } catch (err: any) {
      console.error(err);
      let errorMsg = "Failed to save car details.";
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (Array.isArray(detail)) {
          errorMsg = detail.map((d: any) => `${d.loc?.slice(-1)?.[0] || 'Field'}: ${d.msg}`).join(" | ");
        } else if (typeof detail === "string") {
          errorMsg = detail;
        }
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Parse numbers
    if (type === "number") {
      setFormData((prev: CarCreate) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev: CarCreate) => ({ ...prev, [name]: value }));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <CarFront className="text-blue-600" />
              {initialData ? "Edit Vehicle" : "Add New Vehicle"}
            </h2>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                {error}
              </div>
            )}
            
            <form id="car-form" onSubmit={handleSubmit} className="space-y-6">
              
              {/* Image Upload Component */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Images</label>
                <ImageUploader 
                  images={initialData?.images || (initialData?.image_url ? [initialData.image_url] : [])} 
                  onUpload={async (files) => setImages(prev => [...prev, ...files])}
                  onRemove={(_index) => {
                    // Logic to remove if needed, tricky if they are already on the server
                  }}
                  loading={loading}
                  maxFiles={5}
                />
                {images.length > 0 && (
                  <p className="text-sm text-green-600 mt-2">{images.length} new image(s) queued for upload.</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Brand</label>
                  <input required type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="e.g. Toyota" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Model</label>
                  <input required type="text" name="model" value={formData.model} onChange={handleChange} placeholder="e.g. Fortuner" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
                  <input required type="number" name="year" value={formData.year} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                  <input required type="text" name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Lahore" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Daily Price (Rs)</label>
                  <input required type="number" name="daily_price" value={formData.daily_price} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Seats</label>
                  <input required type="number" name="seats" value={formData.seats} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Transmission</label>
                  <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white">
                    <option value="AUTOMATIC">Automatic</option>
                    <option value="MANUAL">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fuel Type</label>
                  <select name="fuel_type" value={formData.fuel_type} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white">
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Color (Optional)</label>
                  <input type="text" name="color" value={formData.color} onChange={handleChange} placeholder="e.g. White" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Variant (Optional)</label>
                  <input type="text" name="variant" value={formData.variant} onChange={handleChange} placeholder="e.g. GR Sport" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">License Plate</label>
                  <input required type="text" name="license_plate" value={formData.license_plate} onChange={handleChange} placeholder="e.g. ABC-123" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">AI Score (0-100)</label>
                  <input type="number" name="ai_vehicle_score" value={formData.ai_vehicle_score} onChange={handleChange} placeholder="e.g. 95" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">GPS Device ID (Optional)</label>
                  <input type="text" name="gps_device_id" value={formData.gps_device_id} onChange={handleChange} placeholder="e.g. GPS-9999" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fuel Sensor ID (Optional)</label>
                  <input type="text" name="fuel_sensor_id" value={formData.fuel_sensor_id} onChange={handleChange} placeholder="e.g. FS-5555" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-3xl">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200 transition-colors">
              Cancel
            </button>
            <button 
              form="car-form" 
              type="submit" 
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {initialData ? "Save Changes" : "Add Vehicle"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
