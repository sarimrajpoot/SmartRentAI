import { motion } from "framer-motion";
import { Bell, MapPin, CarFront, ShieldCheck } from "lucide-react";

export default function PhoneMockup() {
  return (
    <div className="relative w-full max-w-[320px] mx-auto lg:mx-0">
      {/* Floating UI Card 1 - GPS */}
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-12 top-24 z-20 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-200/50 hidden sm:flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <MapPin size={20} className="text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">Live GPS Active</p>
          <p className="text-xs text-slate-500">Tracking Fortuner</p>
        </div>
      </motion.div>

      {/* Floating UI Card 2 - AI Alert */}
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -right-16 bottom-32 z-20 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-slate-700 hidden sm:flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
          <ShieldCheck size={20} className="text-cyan-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-white">Driver Verified</p>
          <p className="text-xs text-slate-400">Identity Matched</p>
        </div>
      </motion.div>

      {/* Phone Frame */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="relative z-10 rounded-[3rem] border-[8px] border-slate-900 bg-slate-900 shadow-2xl overflow-hidden aspect-[1/2]"
      >
        {/* Notch */}
        <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-30">
          <div className="w-32 h-6 bg-slate-900 rounded-b-3xl"></div>
        </div>

        {/* Screen Content - Dashboard Mockup */}
        <div className="absolute inset-0 bg-slate-50 flex flex-col pt-12">
          {/* Header */}
          <div className="px-6 flex items-center justify-between mb-8">
            <div>
              <p className="text-xs text-slate-500 font-medium">Current Rental</p>
              <h4 className="text-lg font-bold text-slate-900">Honda Civic RS</h4>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center relative">
              <Bell size={18} className="text-slate-600" />
              <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
            </div>
          </div>

          {/* Map Area Mockup */}
          <div className="mx-6 h-48 bg-blue-100 rounded-3xl overflow-hidden relative mb-6 border border-blue-200/50 flex items-center justify-center">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=400')] bg-cover bg-center opacity-50" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full animate-ping absolute inset-0" />
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-lg" />
              </div>
            </div>
          </div>

          {/* Stats/Cards Mockup */}
          <div className="px-6 grid grid-cols-2 gap-4 flex-1">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <CarFront size={20} className="text-blue-500 mb-2" />
              <p className="text-xs text-slate-500">Trip Dist.</p>
              <p className="text-lg font-bold text-slate-900">142 km</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <ShieldCheck size={20} className="text-green-500 mb-2" />
              <p className="text-xs text-slate-500">AI Score</p>
              <p className="text-lg font-bold text-slate-900">98/100</p>
            </div>
          </div>
          
          {/* Bottom Bar Mockup */}
          <div className="h-20 bg-white border-t border-slate-100 mt-auto flex items-center justify-around px-6">
            <div className="w-10 h-10 rounded-full bg-blue-50" />
            <div className="w-10 h-10 rounded-full bg-slate-100" />
            <div className="w-10 h-10 rounded-full bg-slate-100" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
