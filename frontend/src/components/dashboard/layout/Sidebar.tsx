import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  CarFront, 
  CalendarCheck, 
  Heart, 
  Bell, 
  User, 
  Settings,
  Users,
  Activity,
  MapPin,
  FileText,
  BarChart3,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const customerLinks = [
  { name: "Dashboard", path: "/dashboard/customer", icon: LayoutDashboard },
  { name: "Browse Cars", path: "/#cars", icon: CarFront },
  { name: "My Bookings", path: "/dashboard/customer/bookings", icon: CalendarCheck },
  { name: "Favorites", path: "/dashboard/customer/favorites", icon: Heart },
  { name: "Notifications", path: "/dashboard/customer/notifications", icon: Bell },
  { name: "Profile", path: "/dashboard/customer/profile", icon: User },
  { name: "Settings", path: "/dashboard/customer/settings", icon: Settings },
];

const showroomLinks = [
  { name: "Dashboard", path: "/dashboard/showroom", icon: LayoutDashboard },
  { name: "Fleet", path: "/dashboard/showroom/fleet", icon: CarFront },
  { name: "Bookings", path: "/dashboard/showroom/bookings", icon: CalendarCheck },
  { name: "Customers", path: "/dashboard/showroom/customers", icon: Users },
  { name: "Analytics", path: "/dashboard/showroom/analytics", icon: BarChart3 },
  { name: "Driver Monitoring", path: "/dashboard/showroom/monitoring", icon: Activity },
  { name: "Vehicle Tracking", path: "/dashboard/showroom/tracking", icon: MapPin },
  { name: "Settings", path: "/dashboard/showroom/settings", icon: Settings },
];

const adminLinks = [
  { name: "Dashboard", path: "/dashboard/admin", icon: LayoutDashboard },
  { name: "Users", path: "/dashboard/admin/users", icon: Users },
  { name: "Showrooms", path: "/dashboard/admin/showrooms", icon: FileText },
  { name: "Vehicles", path: "/dashboard/admin/vehicles", icon: CarFront },
  { name: "Bookings", path: "/dashboard/admin/bookings", icon: CalendarCheck },
  { name: "Reports", path: "/dashboard/admin/reports", icon: BarChart3 },
  { name: "AI Analytics", path: "/dashboard/admin/ai", icon: ShieldAlert },
  { name: "System Settings", path: "/dashboard/admin/settings", icon: Settings },
];

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export default function Sidebar({ isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();
  
  // Determine role based on URL for now
  let links = customerLinks;
  let roleLabel = "Customer";
  
  if (location.pathname.includes("/showroom")) {
    links = showroomLinks;
    roleLabel = "Showroom";
  } else if (location.pathname.includes("/admin")) {
    links = adminLinks;
    roleLabel = "Admin";
  }

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
    <div className={`h-full flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'}`}>
      
      {/* Logo Area */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-slate-900">SmartRent<span className="text-blue-600">AI</span></span>
          </Link>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-lg">S</span>
          </div>
        )}
        
        {/* Collapse Toggle (Desktop only) */}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center w-6 h-6 rounded-md bg-slate-100 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Role Indicator */}
      {!collapsed && (
        <div className="px-6 py-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Portal Access
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium">
            <ShieldAlert size={14} />
            {roleLabel}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
        {links.map((link) => {
          const isActive = location.pathname === link.path || 
                          (link.path !== `/dashboard/${roleLabel.toLowerCase()}` && location.pathname.startsWith(link.path));
                          
          return (
            <Link key={link.name} to={link.path}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`relative flex items-center px-3 py-3 rounded-xl cursor-pointer transition-colors ${
                  isActive 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                } ${collapsed ? 'justify-center' : ''}`}
                onClick={() => setIsMobileOpen(false)} // Close mobile menu on click
              >
                <link.icon size={20} className={collapsed ? "" : "mr-3"} />
                {!collapsed && <span className="font-medium text-sm">{link.name}</span>}
                
                {isActive && !collapsed && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute inset-0 bg-blue-600 rounded-xl -z-10"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-100">
        <button 
          onClick={logout}
          className={`flex items-center w-full px-3 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors ${collapsed ? 'justify-center' : ''}`}
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
              className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
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
