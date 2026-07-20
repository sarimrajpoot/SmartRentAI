import { motion } from "framer-motion";
import { FolderSearch } from "lucide-react";
import type { ReactNode } from "react";

interface CustomerEmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

export default function CustomerEmptyState({ 
  title, 
  description, 
  icon = <FolderSearch size={48} className="text-zinc-600" />
}: CustomerEmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/30 backdrop-blur-sm"
    >
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-zinc-400 max-w-sm mx-auto">
        {description}
      </p>
    </motion.div>
  );
}
