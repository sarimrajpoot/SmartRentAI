import { motion } from "framer-motion";
import {
  MapPin,
  ShieldCheck,
  Star,
  Navigation,
} from "lucide-react";

import heroCar from "../../../assets/images/hero-car.png";

export default function HeroImage() {
  return (
    <div className="relative flex justify-center items-center">

      {/* Glow */}

      <div className="absolute w-[650px] h-[650px] rounded-full bg-blue-500/20 blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] -translate-x-1/2 -translate-y-1/2 bg-cyan-500/10 rounded-full blur-[140px]" />


      {/* Floating Card - AI Verified */}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="absolute top-10 left-4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 text-white shadow-xl"
      >
        <div className="flex items-center gap-3">

          <div className="bg-green-500 rounded-full p-2">

            <ShieldCheck size={20} />

          </div>

          <div>

            <p className="text-sm text-gray-300">
              AI Status
            </p>

            <h3 className="font-semibold">
              Verified Driver
            </h3>

          </div>

        </div>
      </motion.div>

      {/* Floating Card - GPS */}

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9 }}
        className="absolute top-10 right-6 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 text-white shadow-xl"
      >
        <div className="flex items-center gap-3">

          <Navigation className="text-cyan-400" />

          <div>

            <p className="text-sm text-gray-300">
              Live Tracking
            </p>

            <h3 className="font-semibold">
              GPS Active
            </h3>

          </div>

        </div>
      </motion.div>

      {/* Main Car */}

      <motion.img
        src={heroCar}
        alt="SmartRent AI Hero Car"
        className="relative w-full max-w-2xl drop-shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
        animate={{
          y: [0, -12, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Bottom Glass Card */}

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[320px] backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-5 shadow-2xl"
      >

        <div className="flex justify-between">

          <div>

            <p className="text-gray-300 text-sm">
              Starting From
            </p>

            <h2 className="text-white text-3xl font-bold">
              Rs 4,999
            </h2>

            <p className="text-gray-300 text-sm">
              per day
            </p>

          </div>

          <div className="text-right">

            <div className="flex items-center justify-end gap-1 text-yellow-400">

              <Star
                className="fill-yellow-400"
                size={18}
              />

              <span className="text-white font-semibold">
                4.9
              </span>

            </div>

            <div className="flex items-center gap-1 text-gray-300 mt-3">

              <MapPin size={16} />

              Islamabad

            </div>

          </div>

        </div>

      </motion.div>

    </div>
  );
}