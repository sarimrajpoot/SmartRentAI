import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  CarFront, 
  CalendarCheck, 
  Heart, 
  MapPin, 
  Sparkles,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const customerLinks = [
  { name: "Dashboard", path: "/dashboard/customer", icon: LayoutDashboard },
  { name: "Browse Cars", path: "/dashboard/customer/browse", icon: CarFront },
  { name: "My Bookings", path: "/dashboard/customer/bookings", icon: CalendarCheck },
  { name: "Wishlist", path: "/dashboard/customer/wishlist", icon: Heart },
  { name: "Live Trips", path: "/dashboard/customer/live", icon: MapPin },
  { name: "AI Recommendations", path: "/dashboard/customer/ai", icon: Sparkles },
  { name: "Settings", path: "/dashboard/customer/settings", icon: Settings },
];

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export default function CustomerSidebar({ isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();
  
  // Handle mobile resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarContent = (
    <div className={`h-full flex flex-col bg-zinc-950 border-r border-zinc-800 transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'}`}>
      
      {/* Logo Area */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-zinc-900">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
              <span className="text-zinc-950 font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-zinc-100">SmartRent<span className="text-zinc-500">AI</span></span>
          </Link>
        )}
        {collapsed && (
          <Link to="/" className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-zinc-950 font-bold text-lg">S</span>
          </Link>
        )}
        
        {/* Collapse Toggle (Desktop only) */}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center w-6 h-6 rounded-md bg-zinc-900 text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 scrollbar-hide">
        {customerLinks.map((link) => {
          const isActive = location.pathname === link.path || 
                          (link.path !== `/dashboard/customer` && location.pathname.startsWith(link.path));
                          
          return (
            <Link key={link.name} to={link.path}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`relative flex items-center px-3 py-3 rounded-xl cursor-pointer transition-colors ${
                  isActive 
                    ? "bg-zinc-800/50 text-white border border-zinc-700/50" 
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 border border-transparent"
                } ${collapsed ? 'justify-center' : ''}`}
                onClick={() => setIsMobileOpen(false)} // Close mobile menu on click
              >
                <link.icon size={20} className={collapsed ? "" : "mr-3"} />
                {!collapsed && <span className="font-medium text-sm">{link.name}</span>}
                
                {isActive && !collapsed && (
                  <motion.div 
                    layoutId="customer-active-pill"
                    className="absolute inset-0 bg-zinc-800/30 rounded-xl -z-10"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-zinc-900">
        <button 
          onClick={logout}
          className={`flex items-center w-full px-3 py-3 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 transition-colors ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={20} className={collapsed ? "" : "mr-3"} />
          {!collapsed && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block h-screen sticky top-0 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
