import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { partnerLogos, trustFeatures } from "./partners";
import type { PartnerLogo } from "./partners";
import PartnerLogoCard from "./PartnerLogoCard";
import TrustFeatureCard from "./TrustFeatureCard";
import TrustMetrics from "./TrustMetrics";

export default function TrustedPartnersSection() {
  // Setup state to prepare for future backend integration (GET /partners)
  const [partners, setPartners] = useState<PartnerLogo[]>([]);

  useEffect(() => {
    // Simulate API fetch delay
    const loadPartners = async () => {
      // Future: const response = await fetch('/api/partners');
      // const data = await response.json();
      setPartners(partnerLogos);
    };

    loadPartners();
  }, []);

  return (
    <section id="partners" className="relative py-32 bg-slate-950 overflow-hidden border-t border-slate-900">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,6,23,1)_0%,rgba(15,23,42,1)_100%)] -z-20" />
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10" />

      {/* Blurred glowing circles matching the Hero aesthetic */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10 -translate-x-1/3 translate-y-1/3" />

      <div className="relative max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-blue-400 bg-blue-900/20 border border-blue-800/50 rounded-full">
              Trusted Network
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
              Trusted by Pakistan's<br />Leading Rental Companies
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-slate-400 leading-relaxed">
              SmartRent AI partners with verified rental businesses across Pakistan to provide secure, transparent and AI-powered vehicle rentals.
            </p>
          </motion.div>
        </div>

        {/* Logo Grid */}
        <div className="mb-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {partners.map((partner) => (
              <PartnerLogoCard key={partner.id} partner={partner} />
            ))}
          </div>
        </div>

        {/* Verification Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustFeatures.map((feature) => (
            <TrustFeatureCard key={feature.id} feature={feature} />
          ))}
        </div>

        {/* Trust Metrics Counters */}
        <TrustMetrics />

      </div>
    </section>
  );
}
