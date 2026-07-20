import { ArrowRight, ShieldCheck, MapPinned, Brain } from "lucide-react";
import { motion } from "framer-motion";

import Button from "../../ui/Button";
import Badge from "../../ui/Badge";

export default function HeroContent() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Badge */}

      <Badge>
        🚗 Pakistan's First AI Vehicle Rental Marketplace
      </Badge>

      {/* Heading */}

      <h1 className="mt-8 text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
        Rent
        <span className="text-blue-400"> Smarter.</span>

        <br />

        Drive
        <span className="text-cyan-400"> Safer.</span>
      </h1>

      {/* Description */}

      <p className="mt-8 text-lg text-slate-300 leading-8 max-w-xl">
        SmartRent AI connects customers with trusted rental companies
        across Pakistan. Compare prices, verify drivers with AI,
        monitor live GPS, and book vehicles in minutes.
      </p>

      {/* CTA */}

      <div className="flex flex-wrap gap-4 mt-10">

        <Button className="flex items-center gap-2">

          Find a Vehicle

          <ArrowRight size={18} />

        </Button>

        <Button variant="outline">

          Become a Partner

        </Button>

      </div>

      {/* Trust Indicators */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-12">

        <div className="flex items-center gap-3 text-white">

          <ShieldCheck
            className="text-green-400"
            size={22}
          />

          <span>AI Verification</span>

        </div>

        <div className="flex items-center gap-3 text-white">

          <MapPinned
            className="text-blue-400"
            size={22}
          />

          <span>Live GPS</span>

        </div>

        <div className="flex items-center gap-3 text-white">

          <Brain
            className="text-cyan-400"
            size={22}
          />

          <span>Smart Analytics</span>

        </div>

      </div>
    </motion.div>
  );
}