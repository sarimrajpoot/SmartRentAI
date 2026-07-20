import { motion } from "framer-motion";
import type { TrustFeature } from "./partners";
import type { Variants } from "framer-motion";

interface TrustFeatureCardProps {
  feature: TrustFeature;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

export default function TrustFeatureCard({ feature }: TrustFeatureCardProps) {
  const Icon = feature.icon;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group p-6 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800 hover:border-slate-700 hover:bg-slate-800/60 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-900/20"
    >
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-inner group-hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-500 mb-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <Icon size={24} className="text-blue-400 group-hover:text-cyan-400 relative z-10 transition-colors duration-500" />
      </div>
      
      <h4 className="text-lg font-bold text-white mb-2 tracking-tight">
        {feature.title}
      </h4>
      <p className="text-sm text-slate-400 leading-relaxed font-medium">
        {feature.description}
      </p>
    </motion.div>
  );
}
