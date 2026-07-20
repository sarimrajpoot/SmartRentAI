import { motion } from "framer-motion";
import { ShieldCheck, MapPin, Activity, Lock, BarChart3, Users, Briefcase, Settings, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/footer/Footer";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const features = [
  { icon: ShieldCheck, title: "AI Identity Verification", desc: "Automated identity checks ensuring drivers are verified before accessing vehicles." },
  { icon: MapPin, title: "Live GPS Tracking", desc: "Real-time fleet tracking and historical route analysis for enhanced safety." },
  { icon: Activity, title: "Driver Monitoring", desc: "In-cabin computer vision detects drowsiness and distraction to prevent accidents." },
  { icon: Lock, title: "Theft Detection", desc: "Geofencing and AI behavior analysis proactively alerts owners of theft attempts." },
  { icon: BarChart3, title: "AI Analytics", desc: "Predictive maintenance and revenue analytics for rental partners." },
];

const personas = [
  { icon: Users, title: "Customers", desc: "A seamless, secure, and fully digital booking experience. Verified drivers get instant access to premium fleets without traditional paperwork." },
  { icon: Briefcase, title: "Rental Partners", desc: "Comprehensive fleet management tools. Track vehicles, manage bookings, and let our AI handle driver verification and risk assessment." },
  { icon: Settings, title: "Administrators", desc: "Full platform oversight. Monitor platform health, manage disputes, and ensure ecosystem safety through advanced AI monitoring." },
];

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            <motion.span variants={itemVariants} className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-blue-400 bg-blue-900/30 border border-blue-500/20 rounded-full">
              About Us
            </motion.span>
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8">
              Driving the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Mobility</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-xl text-slate-300 max-w-2xl mx-auto">
              SmartRent AI is Pakistan's first fully AI-integrated vehicle rental platform, built to redefine safety, transparency, and convenience.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Story, Mission, Vision */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                The vehicle rental industry in Pakistan has long been plagued by trust deficits, manual verification hurdles, and vehicle theft. We saw a landscape where rental partners risked their valuable assets, and customers faced tedious, inconsistent experiences.
              </p>
              <p className="text-slate-600 text-lg leading-relaxed">
                SmartRent AI was born out of the necessity to bridge this gap. By integrating cutting-edge artificial intelligence, computer vision, and real-time telematics, we've created a platform where trust is inherently built into the technology.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-8">
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Our Mission</h3>
                <p className="text-slate-600">To provide a secure, transparent, and intelligent vehicle rental ecosystem that protects assets and delivers exceptional user experiences.</p>
              </div>
              <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
                <h3 className="text-xl font-bold text-blue-900 mb-3">Our Vision</h3>
                <p className="text-blue-800">To become the technological standard for mobility and vehicle sharing across emerging markets globally.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Powered by Artificial Intelligence</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">We solve complex industry problems using state-of-the-art machine learning models deployed directly to the edge.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Platform */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Meet the Platform</h2>
            <p className="text-slate-600 max-w-2xl">A unified ecosystem connecting every stakeholder in the rental journey.</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {personas.map((persona, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="group relative bg-slate-950 p-8 rounded-3xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <persona.icon className="text-blue-400 mb-6" size={32} />
                  <h3 className="text-xl font-bold text-white mb-4">{persona.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{persona.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Join Pakistan's Smartest Car Rental Platform</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/#cars">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 font-bold rounded-full shadow-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
              >
                Browse Cars <ChevronRight size={20} />
              </motion.button>
            </Link>
            <Link to="/register">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 bg-blue-700/50 backdrop-blur-md text-white font-bold rounded-full border border-blue-400/50 flex items-center justify-center gap-2 hover:bg-blue-700/70 transition-colors"
              >
                Become a Partner
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
