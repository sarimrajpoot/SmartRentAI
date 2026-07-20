import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/layout/Sidebar";
import Topbar from "../components/dashboard/layout/Topbar";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar setIsMobileOpen={setIsMobileOpen} />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden focus:outline-none">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full p-4 md:p-6 lg:p-8"
            >
              <div className="max-w-7xl mx-auto">
                <Outlet />
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
