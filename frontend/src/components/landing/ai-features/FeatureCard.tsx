import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { AIFeature } from "./aiFeaturesData";

interface FeatureCardProps {
  feature: AIFeature;
}

// Framer motion variants for stagger animation
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

export default function FeatureCard({ feature }: FeatureCardProps) {
  const Icon = feature.icon;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ 
        y: -10, 
        rotate: 1,
        transition: { duration: 0.3 }
      }}
      className="group relative flex flex-col justify-between p-8 rounded-3xl bg-slate-900/40 backdrop-blur-sm border border-slate-800 hover:border-slate-700 hover:bg-slate-800/60 transition-colors duration-500 overflow-hidden"
    >
      {/* Animated shadow effect that appears on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-transparent to-transparent group-hover:from-blue-600/10 group-hover:to-cyan-500/5 transition-all duration-500 rounded-3xl" />
      <div className="absolute -inset-1 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 transition-opacity duration-500 -z-10" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          {/* Gradient Icon Background */}
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-inner group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <motion.div 
              className="relative z-10"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Icon size={32} className="text-blue-400 group-hover:text-cyan-400 transition-colors duration-500" />
            </motion.div>
          </div>

          {/* Badge */}
          <span className="px-3 py-1 text-xs font-medium text-blue-300 bg-blue-900/30 border border-blue-800/50 rounded-full">
            {feature.badge}
          </span>
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
          {feature.title}
        </h3>
        <p className="text-slate-400 leading-relaxed font-medium">
          {feature.description}
        </p>
      </div>

      {/* Bottom Right Arrow */}
      <div className="relative z-10 mt-8 flex justify-end">
        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-500">
          <ArrowRight 
            size={20} 
            className="text-slate-500 group-hover:text-white group-hover:-rotate-45 transition-all duration-500" 
          />
        </div>
      </div>
    </motion.div>
  );
}
