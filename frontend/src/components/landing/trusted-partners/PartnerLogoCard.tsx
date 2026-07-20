import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import type { PartnerLogo } from "./partners";

interface PartnerLogoCardProps {
  partner: PartnerLogo;
}

const logoVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export default function PartnerLogoCard({ partner }: PartnerLogoCardProps) {
  return (
    <motion.div
      variants={logoVariants}
      whileHover={{ y: -5, scale: 1.05 }}
      className="flex items-center justify-center p-6 h-24 bg-slate-900/30 backdrop-blur-sm border border-slate-800 rounded-2xl shadow-sm hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:bg-slate-800/50 hover:border-slate-700 transition-all duration-300 group cursor-default"
    >
      <span className="text-xl font-black tracking-widest uppercase text-slate-500 group-hover:text-white transition-colors duration-300 select-none">
        {partner.name}
      </span>
    </motion.div>
  );
}
