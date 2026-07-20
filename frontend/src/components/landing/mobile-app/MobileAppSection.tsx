import { motion } from "framer-motion";
import { CheckCircle2, Apple, Play } from "lucide-react";
import PhoneMockup from "./PhoneMockup";

const features = [
  "Instant bookings with AI price comparison",
  "Live 24/7 GPS vehicle tracking",
  "Real-time driver fatigue & risk alerts",
  "Secure payments and instant refunds",
];

export default function MobileAppSection() {
  return (
    <section id="mobile-app" className="py-24 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* Left Side Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-blue-600 bg-blue-50 border border-blue-100 rounded-full">
              Mobile App
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
              Manage Rentals <br className="hidden lg:block" />
              Anywhere
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-xl">
              Take full control of your rental experience. Whether you're a driver booking a ride or a partner monitoring your fleet, our mobile app puts the power of AI in your pocket.
            </p>

            {/* Feature Checklist */}
            <div className="space-y-4 mb-10">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 size={24} className="text-blue-500 shrink-0" />
                  <span className="text-slate-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* App Store Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-3 bg-slate-900 text-white px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Apple size={24} />
                <div className="text-left">
                  <div className="text-[10px] leading-none text-slate-300">Download on the</div>
                  <div className="text-sm font-bold leading-tight">App Store</div>
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-900 px-6 py-3.5 rounded-xl shadow-sm hover:shadow-md hover:bg-slate-50 transition-all"
              >
                <Play size={24} className="fill-blue-600 text-blue-600" />
                <div className="text-left">
                  <div className="text-[10px] leading-none text-slate-500">GET IT ON</div>
                  <div className="text-sm font-bold leading-tight">Google Play</div>
                </div>
              </motion.button>
            </div>
          </motion.div>

          {/* Right Side Phone Mockup */}
          <div className="relative flex justify-center lg:justify-end items-center h-full min-h-[600px]">
            {/* Background glowing circle for contrast */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-square bg-gradient-to-tr from-blue-100 to-cyan-50 rounded-full blur-3xl -z-10" />
            <PhoneMockup />
          </div>

        </div>
      </div>
    </section>
  );
}
