import { Link } from "react-router-dom";
import { CarFront, Globe, MessageCircle, Video, Mail, Send } from "lucide-react";
import { motion } from "framer-motion";
import { footerPlatformLinks, footerCompanyLinks, footerSupportLinks } from "./footerData";

export default function Footer() {
  return (
    <footer id="contact" className="bg-slate-950 pt-24 pb-12 border-t border-slate-900 relative overflow-hidden">
      {/* Premium Footer Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Brand & Description */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 group mb-6 inline-flex">
              <div className="flex items-center justify-center p-2 rounded-xl bg-blue-600/20 text-blue-400 group-hover:bg-blue-600/30 transition-colors">
                <CarFront size={28} />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                SmartRent AI
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed mb-8 max-w-sm">
              The world's first AI-powered vehicle rental platform. Making rentals safer, smarter, and more transparent across Pakistan.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {[Globe, MessageCircle, Video, Mail].map((Icon, idx) => (
                <motion.a
                  key={idx}
                  href="#"
                  whileHover={{ y: -3, scale: 1.1 }}
                  className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition-colors border border-slate-800"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Column 2: Platform */}
          <div>
            <h4 className="text-white font-bold mb-6">Platform</h4>
            <ul className="space-y-4">
              {footerPlatformLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-slate-400 hover:text-blue-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4">
              {footerCompanyLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-slate-400 hover:text-blue-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Support & Newsletter */}
          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-4 mb-8">
              {footerSupportLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-slate-400 hover:text-blue-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-white font-bold mb-4">Newsletter</h4>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-slate-900 border border-slate-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600"
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-lg flex items-center justify-center transition-colors"
              >
                <Send size={16} />
              </motion.button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} SmartRent AI. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-slate-500 text-sm">
            <span>Made with</span>
            <motion.span 
              animate={{ scale: [1, 1.2, 1] }} 
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-red-500"
            >
              ❤️
            </motion.span>
            <span>in Pakistan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
