import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/footer/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col overflow-hidden relative">
      <Navbar />

      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 pt-24 pb-20">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative mb-12"
        >
          {/* Animated 404 Text */}
          <h1 className="text-[12rem] md:text-[18rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 leading-none select-none tracking-tighter">
            404
          </h1>
          
          {/* Orbiting elements for premium feel */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-dashed border-white/20"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            className="absolute -inset-12 rounded-full border border-dashed border-blue-500/30"
          />
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center max-w-lg"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Page Not Found</h2>
          <p className="text-slate-400 text-lg mb-10 leading-relaxed">
            The route you're looking for seems to have taken a wrong turn. Let's get you back on track to finding the perfect vehicle.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
              >
                <Home size={20} /> Return Home
              </motion.button>
            </Link>
            <Link to="/#cars">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-full border border-white/20 hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
              >
                <Search size={20} /> Browse Cars
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
