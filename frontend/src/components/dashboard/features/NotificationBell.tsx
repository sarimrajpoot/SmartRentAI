import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function NotificationBell() {
  const [hasUnread] = useState(true);

  return (
    <button className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
      <Bell size={20} />
      {hasUnread && (
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"
        />
      )}
    </button>
  );
}
