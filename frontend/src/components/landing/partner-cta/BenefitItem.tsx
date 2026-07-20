import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface BenefitItemProps {
  text: string;
}

export default function BenefitItem({ text }: BenefitItemProps) {
  return (
    <motion.div 
      whileHover={{ x: 5 }}
      className="flex items-center gap-3 bg-slate-800/40 border border-slate-700/50 px-4 py-3 rounded-xl backdrop-blur-sm"
    >
      <CheckCircle size={20} className="text-cyan-400 shrink-0" />
      <span className="text-slate-200 font-medium">{text}</span>
    </motion.div>
  );
}
