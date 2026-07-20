import { Menu, Search, Home, ChevronRight } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import NotificationBell from "../features/NotificationBell";
import UserProfileMenu from "../features/UserProfileMenu";

interface TopbarProps {
  setIsMobileOpen: (open: boolean) => void;
}

export default function Topbar({ setIsMobileOpen }: TopbarProps) {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-20 px-4 md:px-6 flex items-center justify-between">
      
      {/* Mobile Menu & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>

        <nav className="hidden md:flex items-center text-sm font-medium text-slate-500">
          <Link to="/dashboard" className="hover:text-blue-600 flex items-center">
            <Home size={14} className="mr-1" />
          </Link>
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;
            const formattedValue = value.charAt(0).toUpperCase() + value.slice(1);
            
            return (
              <div key={to} className="flex items-center">
                <ChevronRight size={14} className="mx-1" />
                {isLast ? (
                  <span className="text-slate-900">{formattedValue}</span>
                ) : (
                  <Link to={to} className="hover:text-blue-600 transition-colors">
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
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
            <Search size={16} />
          </div>
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-64 pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <NotificationBell />
          <div className="h-6 w-px bg-slate-200 mx-1" />
          <UserProfileMenu />
        </div>
      </div>
    </header>
  );
}
