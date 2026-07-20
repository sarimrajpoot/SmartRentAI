import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { scrollToSection } from "../../../utils/scrollToSection";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks } from "./navData";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const location = useLocation();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    onClose();
    if (path.startsWith("#")) {
      e.preventDefault();
      if (location.pathname === "/") {
        // slight delay to allow mobile menu to close before scrolling
        setTimeout(() => scrollToSection(path), 150);
      } else {
        window.location.href = "/" + path;
      }
    }
  };

  // Handle body scroll lock and Escape key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay (click outside to close) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed top-0 left-0 right-0 bg-white shadow-2xl z-40 pt-20 pb-6 px-6 lg:hidden border-b border-slate-100"
          >
            <div className="flex flex-col gap-2 mt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path.startsWith("#") ? `/${link.path}` : link.path}
                  onClick={(e) => handleNavClick(e, link.path)}
                  className="px-4 py-3 text-lg font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  {link.name}
                </Link>
              ))}

              <div className="h-px w-full bg-slate-100 my-4" />

              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="w-full py-3 text-center font-medium border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={onClose}
                  className="w-full py-3 text-center font-medium bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Register
                </Link>

                <Link
                  to="/list-car"
                  onClick={onClose}
                  className="w-full mt-2 py-3 text-center font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
                >
                  List Your Car
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
