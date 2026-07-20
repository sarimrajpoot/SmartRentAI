import type { ReactNode } from "react";
import { FolderSearch } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export default function EmptyState({ 
  title, 
  description, 
  icon = <FolderSearch size={48} className="text-slate-300" />,
  action
}: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50"
    >
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-sm mx-auto mb-6">
        {description}
      </p>
      {action && <div>{action}</div>}
    </motion.div>
  );
}
