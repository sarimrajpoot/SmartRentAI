import { User, ChevronDown, LogOut, Settings } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";

export default function UserProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { logout, user } = useAuth();

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1 pr-3 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
          {user?.email?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-semibold text-slate-700 leading-none">
            {user?.email ? user.email.split('@')[0] : 'User'}
          </p>
        </div>
        <ChevronDown size={14} className="text-slate-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50"
          >
            <div className="px-4 py-2 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.email || 'user@example.com'}</p>
            </div>
            
            <div className="py-1">
              <button className="w-full px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2 transition-colors">
                <User size={16} /> Profile
              </button>
              <button className="w-full px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2 transition-colors">
                <Settings size={16} /> Settings
              </button>
            </div>
            
            <div className="py-1 border-t border-slate-100">
              <button 
                onClick={logout}
                className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
