import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Calendar, MapPin, CreditCard, ShieldCheck, Download, Camera } from "lucide-react";

import { getBookingDetails } from "../../services/booking";
import { getCar } from "../../services/car";
import type { BookingResponse } from "../../types/booking";
import type { Car } from "../../types/car";

import BookingTimeline from "../../components/dashboard/customer/booking/BookingTimeline";
import CustomerEmptyState from "../../components/dashboard/customer/CustomerEmptyState";

export default function BookingDetails() {
  const { id } = useParams();
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetails() {
      try {
        setLoading(true);
        if (!id) return;
        
        const bookingData = await getBookingDetails(id);
        setBooking(bookingData);

        const carData = await getCar(bookingData.car_id);
        setCar(carData);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load booking details.");
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-zinc-800 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !booking || !car) {
    return (
      <div className="max-w-3xl mx-auto mt-12">
        <CustomerEmptyState title="Booking Not Found" description={error || "We couldn't locate this booking."} />
        <div className="text-center mt-6">
          <Link to="/dashboard/customer/bookings" className="text-blue-500 hover:text-blue-400 font-medium">
            Return to Bookings
          </Link>
        </div>
      </div>
    );
  }

  const getDays = () => {
    const start = new Date(booking.start_date);
    const end = new Date(booking.end_date);
    return Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1;
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <Link to="/dashboard/customer/bookings" className="inline-flex items-center text-zinc-400 hover:text-white mb-6 transition-colors font-medium">
        <ChevronLeft size={20} className="mr-1" /> Back to Bookings
      </Link>

      {/* Header & QR Placeholder */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Trip Itinerary</h1>
          <p className="text-zinc-400">Booking ID: <span className="text-white font-mono">{booking.id.split('-')[0].toUpperCase()}</span></p>
        </div>
        
        {/* Mock QR Code / Pass */}
        {(booking.status === "CONFIRMED" || booking.status === "ACTIVE" || booking.status === "COMPLETED") && (
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to={`/dashboard/customer/bookings/${booking.id}/inspection`}
              className="bg-blue-600/20 border border-blue-500/50 text-blue-400 hover:bg-blue-600/30 transition-colors rounded-xl p-3 flex items-center justify-center gap-2 font-medium"
            >
              <Camera size={20} /> AI Damage Inspection
            </Link>
            
            {(booking.status === "CONFIRMED" || booking.status === "ACTIVE") && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded flex items-center justify-center p-1">
                  {/* This would be an actual QR code in production */}
                  <div className="w-full h-full border-[2px] border-dashed border-black grid grid-cols-2 gap-1 p-1">
                    <div className="bg-black rounded-sm" />
                    <div className="bg-black rounded-sm" />
                    <div className="bg-black rounded-sm" />
                    <div className="bg-white" />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Pickup Pass</p>
                  <button className="text-sm font-medium text-blue-400 hover:text-blue-300">Show to Host</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-6">
        
        {/* Timeline */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8">
          <BookingTimeline status={booking.status} />
        </div>

        {/* Car Details Summary */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 h-48 md:h-auto bg-zinc-800 relative">
            <img 
              src={car.image_url || "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=600"} 
              alt={car.brand} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 md:p-8 flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">{car.brand} {car.model} {car.year}</h2>
            <p className="text-zinc-400 mb-6 flex items-center gap-1"><MapPin size={16} /> {car.city} Hub</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-950/50 rounded-xl p-4 border border-zinc-800/50">
                <span className="text-xs text-zinc-500 uppercase font-semibold mb-1 block">Pickup</span>
                <p className="text-white font-medium flex items-center gap-2">
                  <Calendar size={16} className="text-blue-500" /> {booking.start_date}
                </p>
              </div>
              <div className="bg-zinc-950/50 rounded-xl p-4 border border-zinc-800/50">
                <span className="text-xs text-zinc-500 uppercase font-semibold mb-1 block">Return</span>
                <p className="text-white font-medium flex items-center gap-2">
                  <Calendar size={16} className="text-blue-500" /> {booking.end_date}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scaffolded AI Features (Placeholders) */}
        {booking.status === "ACTIVE" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-3xl p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2"><MapPin className="text-emerald-400"/> Live Tracking</h3>
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-sm text-zinc-400 mb-4">AI real-time GPS monitoring is active. Vehicle is currently on route.</p>
              <button className="w-full py-2 bg-emerald-500/20 text-emerald-400 rounded-xl font-medium text-sm hover:bg-emerald-500/30 transition-colors">
                Open Map View
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-3xl p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2"><ShieldCheck className="text-blue-400"/> Driver Score</h3>
                <span className="text-2xl font-bold text-blue-400">98</span>
              </div>
              <p className="text-sm text-zinc-400 mb-4">AI monitoring indicates excellent driving behavior with zero rapid accelerations.</p>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="w-[98%] h-full bg-blue-500" />
              </div>
            </div>
          </div>
        )}

        {/* Payment Summary */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2"><CreditCard className="text-blue-500"/> Payment Summary</h3>
            <button className="text-sm font-medium text-zinc-400 hover:text-white flex items-center gap-1 transition-colors">
              <Download size={16} /> Invoice
            </button>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-zinc-300">
              <span>Rental Rate ({getDays()} days)</span>
              <span>Rs {(getDays() * (car?.daily_price || 0)).toLocaleString()}</span>
            </div>
            {booking.with_insurance && (
              <div className="flex justify-between text-zinc-300">
                <span>Premium Insurance</span>
                <span>Rs {(getDays() * 1500).toLocaleString()}</span>
              </div>
            )}
            {booking.with_driver && (
              <div className="flex justify-between text-zinc-300">
                <span>Chauffeur Service</span>
                <span>Rs {(getDays() * 2000).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-zinc-300 font-medium">
              <span>Taxes & Fees</span>
              <span>Included</span>
            </div>
            <div className="pt-4 border-t border-zinc-800 flex justify-between items-end mt-4">
              <span className="text-zinc-400 font-medium">Total Paid</span>
              <span className="text-2xl font-bold text-white">Rs {booking.total_price?.toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
