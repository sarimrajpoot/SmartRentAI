import { Menu, Search, Home, ChevronRight, Bell, User, LogOut, Settings } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";

interface TopbarProps {
  setIsMobileOpen: (open: boolean) => void;
}

export default function CustomerTopbar({ setIsMobileOpen }: TopbarProps) {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { logout, user } = useAuth();
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/60 h-20 px-4 md:px-8 flex items-center justify-between">
      
      {/* Mobile Menu & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>

        <nav className="hidden md:flex items-center text-sm font-medium text-zinc-500">
          <Link to="/dashboard/customer" className="hover:text-zinc-200 flex items-center transition-colors">
            <Home size={14} className="mr-1" />
          </Link>
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;
            const formattedValue = value.charAt(0).toUpperCase() + value.slice(1);
            
            return (
              <div key={to} className="flex items-center">
                <ChevronRight size={14} className="mx-1 text-zinc-700" />
                {isLast ? (
                  <span className="text-zinc-200">{formattedValue}</span>
                ) : (
                  <Link to={to} className="hover:text-zinc-200 transition-colors">
                    {formattedValue}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Search & Actions */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-zinc-300 transition-colors">
            <Search size={16} />
          </div>
          <input 
            type="text" 
            placeholder="Search bookings or cars..." 
            className="w-64 pl-10 pr-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full text-sm focus:bg-zinc-900 focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 outline-none transition-all placeholder:text-zinc-600 text-zinc-200"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <button className="relative p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-full transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-zinc-950" />
          </button>
          
          <div className="h-6 w-px bg-zinc-800 mx-1" />
          
          {/* User Profile */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 p-1 pr-3 rounded-full border border-zinc-800 hover:bg-zinc-900 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center font-bold text-sm">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-zinc-200 leading-none">
                  {user?.email ? user.email.split('@')[0] : 'User'}
                </p>
              </div>
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 bg-zinc-900 rounded-xl shadow-xl border border-zinc-800 py-1 z-50"
                >
                  <div className="px-4 py-2 border-b border-zinc-800/50">
                    <p className="text-sm font-semibold text-zinc-200 truncate">{user?.email || 'user@example.com'}</p>
                  </div>
                  
                  <div className="py-1">
                    <button className="w-full px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 flex items-center gap-2 transition-colors">
                      <User size={16} /> Profile
                    </button>
                    <button className="w-full px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 flex items-center gap-2 transition-colors">
                      <Settings size={16} /> Settings
                    </button>
                  </div>
                  
                  <div className="py-1 border-t border-zinc-800/50">
                    <button 
                      onClick={logout}
                      className="w-full px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 hover:text-red-400 flex items-center gap-2 transition-colors"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
