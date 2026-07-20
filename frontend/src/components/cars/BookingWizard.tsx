import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CalendarDays, ShieldCheck, MapPin, CreditCard, CheckCircle2, ChevronRight, AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import DatePicker from "./DatePicker";
import BookingSummary from "./BookingSummary";
import { createBooking } from "../../services/booking";
import type { Car } from "../../types/car";

interface BookingWizardProps {
  car: Car;
}

export default function BookingWizard({ car }: BookingWizardProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [withDriver, setWithDriver] = useState(false);
  const [withInsurance, setWithInsurance] = useState(false);
  
  // Validation
  const getDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!startDate || !endDate) {
        setError("Please select both dates.");
        return;
      }
      if (new Date(startDate) >= new Date(endDate)) {
        setError("End date must be after start date.");
        return;
      }
    }
    setError(null);
    setStep(s => s + 1);
  };

  const handleBooking = async () => {
    try {
      setLoading(true);
      setError(null);
      // Backend integration
      await createBooking({
        car_id: car.id,
        start_date: startDate,
        end_date: endDate,
        with_driver: withDriver,
        with_insurance: withInsurance
      });
      toast.success("Booking confirmed successfully!");
      setStep(5); // Success step
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.detail || "Failed to confirm booking. Dates might be unavailable.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden min-h-[400px] flex flex-col">
      {/* Progress Header */}
      {step < 5 && (
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                step >= i ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-500"
              }`}>
                {i}
              </div>
              {i < 4 && (
                <div className="w-full h-1 bg-zinc-800 absolute top-4 -z-10 mt-0.5">
                  <motion.div 
                    className="h-full bg-blue-600" 
                    initial={{ width: "0%" }}
                    animate={{ width: step > i ? "100%" : "0%" }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><CalendarDays className="text-blue-500"/> Dates & Location</h2>
              <div className="grid grid-cols-2 gap-4">
                <DatePicker label="Pickup Date" min={today} value={startDate} onChange={setStartDate} />
                <DatePicker label="Return Date" min={startDate || today} value={endDate} onChange={setEndDate} />
              </div>
              <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50 flex items-start gap-3">
                <MapPin className="text-zinc-400 mt-0.5 shrink-0" size={18} />
                <div>
                  <p className="text-sm font-medium text-white">Pickup Location</p>
                  <p className="text-xs text-zinc-400">SmartRent {car.city} Hub (Central)</p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><ShieldCheck className="text-blue-500"/> Trip Preferences</h2>
              
              <button 
                onClick={() => setWithDriver(false)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${!withDriver ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-800 hover:border-zinc-700'}`}
              >
                <p className="font-bold text-white">Self Drive</p>
                <p className="text-sm text-zinc-400">You will be driving the vehicle.</p>
              </button>
              
              <button 
                onClick={() => setWithDriver(true)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex justify-between items-center ${withDriver ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-800 hover:border-zinc-700'}`}
              >
                <div>
                  <p className="font-bold text-white">Chauffeur Service</p>
                  <p className="text-sm text-zinc-400">Professional driver included.</p>
                </div>
                <span className="text-sm font-bold text-blue-400">+Rs 2,000/day</span>
              </button>

              <div className="pt-4 border-t border-zinc-800">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={withInsurance} onChange={(e) => setWithInsurance(e.target.checked)} className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-blue-600 focus:ring-blue-600 focus:ring-offset-zinc-900" />
                  <div>
                    <p className="font-medium text-white">Premium Protection</p>
                    <p className="text-xs text-zinc-400">Zero deductible insurance for Rs 1,500/day.</p>
                  </div>
                </label>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 text-center">
              <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={32} />
              </div>
              <h2 className="text-xl font-bold text-white">Identity Verification</h2>
              <p className="text-sm text-zinc-400">To ensure safety on the SmartRent AI platform, we require a quick verification.</p>
              
              <div className="border border-dashed border-zinc-700 bg-zinc-900/50 rounded-xl p-6 hover:bg-zinc-800/50 transition-colors cursor-pointer">
                <p className="font-medium text-white mb-1">Upload CNIC / License</p>
                <p className="text-xs text-zinc-500">JPG, PNG up to 10MB</p>
              </div>

              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <p className="text-sm font-medium text-emerald-400">Mock Mode: Verification is simulated as passed for this demo.</p>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><CreditCard className="text-blue-500"/> Review & Book</h2>
              <BookingSummary dailyPrice={car.daily_price} days={getDays()} withDriver={withDriver} withInsurance={withInsurance} />
              <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" checked readOnly className="w-4 h-4 text-blue-600 bg-zinc-900 border-zinc-700 focus:ring-blue-600 focus:ring-offset-zinc-900" />
                  <span className="text-sm font-medium text-white">Pay at Pickup (Cash / Card)</span>
                </label>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-10 text-center space-y-4">
              <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-3xl font-bold text-white">Booking Confirmed!</h2>
              <p className="text-zinc-400 max-w-sm">
                Your reservation for the <span className="font-semibold text-white">{car.brand} {car.model}</span> has been confirmed. The owner has been notified.
              </p>
              <button 
                onClick={() => navigate("/dashboard/customer/bookings")}
                className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors"
              >
                View My Bookings
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && step < 5 && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Footer Actions */}
      {step < 5 && (
        <div className="mt-8 pt-4 border-t border-zinc-800 flex justify-between items-center">
          {step > 1 ? (
            <button onClick={() => setStep(s => s - 1)} className="text-zinc-400 hover:text-white text-sm font-medium transition-colors">
              Back
            </button>
          ) : <div></div>}
          
          <button 
            onClick={step === 4 ? handleBooking : handleNext}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {step === 4 ? (loading ? "Confirming..." : "Confirm Booking") : "Next Step"}
            {!loading && step < 4 && <ChevronRight size={18} />}
          </button>
        </div>
      )}
    </div>
  );
}
