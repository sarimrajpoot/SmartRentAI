import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface DashboardCardProps {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export default function DashboardCard({ 
  title, 
  subtitle, 
  action, 
  children, 
  className = "",
  noPadding = false
}: DashboardCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${className}`}
    >
      {(title || action) && (
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            {title && <h3 className="text-lg font-bold text-slate-900">{title}</h3>}
            {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={noPadding ? "" : "p-6"}>
        {children}
      </div>
    </motion.div>
  );
}
