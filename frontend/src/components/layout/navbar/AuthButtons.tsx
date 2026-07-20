import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// No props needed since theme is consistent

export default function AuthButtons() {
  return (
    <div className="hidden lg:flex items-center gap-3 z-50 lg:ml-6 xl:ml-8">
      <Link to="/login">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-5 py-2 text-sm font-medium rounded-full border transition-colors duration-300 border-white/20 text-white hover:bg-white/10 hover:border-white/30`}
        >
          Login
        </motion.button>
      </Link>

      <Link to="/register">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-5 py-2 text-sm font-medium rounded-full transition-colors duration-300 bg-white text-slate-900 hover:bg-slate-100`}
        >
          Register
        </motion.button>
      </Link>

      <div className="w-px h-6 mx-1 bg-slate-300/30" />

      <Link to="/list-car">
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="relative group px-6 py-2 text-sm font-semibold rounded-full text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all overflow-hidden"
        >
          {/* Subtle gradient sweep animation on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
          <span>List Your Car</span>
        </motion.button>
      </Link>
    </div>
  );
}
