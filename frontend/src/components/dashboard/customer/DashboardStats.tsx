import { motion } from "framer-motion";
import CountUp from "react-countup";
import type { ReactNode } from "react";

interface DashboardStatsProps {
  title: string;
  value: number;
  icon: ReactNode;
  color: "blue" | "emerald" | "purple" | "orange";
}

const colorStyles = {
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

export default function DashboardStats({ title, value, icon, color }: DashboardStatsProps) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className={`bg-zinc-900/50 backdrop-blur-md rounded-2xl p-5 border ${colorStyles[color]} flex items-center justify-between`}
    >
      <div>
        <h3 className="text-zinc-400 text-sm font-medium mb-1">{title}</h3>
        <div className="text-2xl font-bold text-white">
          <CountUp end={value} duration={2} separator="," />
        </div>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-zinc-950/50 shadow-inner`}>
        {icon}
      </div>
    </motion.div>
  );
}
