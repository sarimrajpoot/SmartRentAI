import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { navLinks } from "./navData";
import { useScrollSpy } from "../../../hooks/useScrollSpy";
import { scrollToSection } from "../../../utils/scrollToSection";

interface DesktopNavProps {
  scrolled: boolean;
}

export default function DesktopNav({ scrolled }: DesktopNavProps) {
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const location = useLocation();

  const activeId = useScrollSpy(
    navLinks.map((l) => l.path.replace("#", "")),
    80
  );

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (path.startsWith("#")) {
      e.preventDefault();
      if (location.pathname === "/") {
        scrollToSection(path);
      } else {
        window.location.href = "/" + path;
      }
    }
  };

  return (
    <nav className="hidden lg:flex items-center justify-center flex-1 gap-2 xl:gap-6 px-4">
      {navLinks.map((link) => {
        const active = link.path === `#${activeId}` || (link.path === "#home" && activeId === "");
        
        return (
          <Link
            key={link.name}
            to={link.path.startsWith("#") ? `/${link.path}` : link.path}
            onClick={(e) => handleNavClick(e, link.path)}
            onMouseEnter={() => setHoveredPath(link.path)}
            onMouseLeave={() => setHoveredPath(null)}
            className={`relative px-4 py-2 text-sm font-medium whitespace-nowrap flex items-center justify-center transition-colors duration-300 rounded-full ${
              active
                ? "text-white"
                : "text-slate-300 hover:text-white"
            }`}
          >
            {link.name}

            {/* Hover Background */}
            {hoveredPath === link.path && !active && (
              <motion.div
                layoutId="navbar-hover"
                className={`absolute inset-0 rounded-full -z-10 ${
                  scrolled ? "bg-white/10" : "bg-white/10"
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}

            {/* Active Underline */}
            {active && (
              <motion.div
                layoutId="navbar-active"
                className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-blue-500"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
