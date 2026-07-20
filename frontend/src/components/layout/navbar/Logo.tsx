import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CarFront } from "lucide-react";

interface LogoProps {
  scrolled: boolean;
}

export default function Logo({ scrolled }: LogoProps) {
  return (
    <Link to="/" className="flex items-center gap-2 group z-50">
      <motion.div
        whileHover={{ scale: 1.05, rotate: -5 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center justify-center p-2 rounded-xl transition-colors duration-300 ${
          scrolled
            ? "bg-blue-600/20 text-blue-400"
            : "bg-white/10 text-white backdrop-blur-sm"
        }`}
      >
        <CarFront size={28} className="relative z-10" />
      </motion.div>
      <div className="flex flex-col">
        <span
          className="text-xl font-bold tracking-tight text-white transition-colors duration-300"
        >
          SmartRent AI
        </span>
      </div>
    </Link>
  );
}
