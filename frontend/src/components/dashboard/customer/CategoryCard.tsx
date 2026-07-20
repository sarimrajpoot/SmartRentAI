import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface CategoryCardProps {
  title: string;
  icon: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

export default function CategoryCard({ title, icon, isActive, onClick }: CategoryCardProps) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex flex-col items-center justify-center min-w-[100px] h-24 p-3 rounded-2xl border transition-all ${
        isActive 
          ? "bg-blue-600/10 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]" 
          : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 hover:bg-zinc-800/50"
      }`}
    >
      <div className="mb-2">
        {icon}
      </div>
      <span className="text-xs font-medium tracking-wide">{title}</span>
    </motion.button>
  );
}
