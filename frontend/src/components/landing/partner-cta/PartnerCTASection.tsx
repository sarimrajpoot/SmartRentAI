import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import BenefitItem from "./BenefitItem";

const benefits = [
  "More Bookings",
  "AI Fraud Detection",
  "Fleet Management",
  "Live Tracking",
  "Analytics",
];

export default function PartnerCTASection() {
  return (
    <section id="become-partner" className="relative py-32 overflow-hidden bg-slate-950">
      {/* Deep dark gradient with massive glowing orbs */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/20 rounded-[100%] blur-[120px] pointer-events-none" />
      
      {/* Subtle floating background graphics */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-400/10 rounded-2xl backdrop-blur-3xl border border-white/5 -z-10"
      />
      <motion.div
        animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-full backdrop-blur-3xl border border-white/5 -z-10"
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-8 md:p-16 lg:p-20 shadow-2xl relative overflow-hidden">
          
          {/* Inner subtle glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center relative z-10">
            
            {/* Left Content */}
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6"
              >
                Grow Your Rental <br className="hidden md:block" />
                Business with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">SmartRent AI</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg text-slate-400 mb-10 max-w-xl leading-relaxed"
              >
                Join Pakistan's fastest-growing, AI-powered vehicle rental platform. We provide the technology, you provide the fleet. Increase your revenue while minimizing risk.
              </motion.p>
              
              {/* Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
                >
                  Become a Partner
                  <ArrowRight size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-2 bg-slate-800 text-white border border-slate-700 px-8 py-4 rounded-xl font-bold hover:bg-slate-700 transition-colors"
                >
                  <Phone size={20} className="text-slate-400" />
                  Contact Sales
                </motion.button>
              </motion.div>
            </div>

            {/* Right Content - Benefits Grid */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:pl-12"
            >
              <div className="bg-slate-950/50 rounded-3xl p-8 border border-slate-800 shadow-inner">
                <h3 className="text-2xl font-bold text-white mb-6">Partner Benefits</h3>
                <div className="flex flex-col gap-3">
                  {benefits.map((benefit, idx) => (
                    <BenefitItem key={idx} text={benefit} />
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
