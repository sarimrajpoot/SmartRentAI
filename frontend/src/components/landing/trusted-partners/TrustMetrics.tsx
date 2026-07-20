import { motion } from "framer-motion";
import CountUpModule from "react-countup";
import { trustMetrics } from "./partners";

// Vite/ESM interop fix for react-countup
const CountUp = (CountUpModule as any).default || CountUpModule;

export default function TrustMetrics() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-slate-800/50">
      {trustMetrics.map((metric, index) => (
        <motion.div
          key={metric.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="text-center"
        >
          <div className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight flex items-center justify-center">
            <CountUp end={metric.number} duration={2.5} enableScrollSpy scrollSpyOnce />
            <span className="text-blue-500 ml-1">{metric.suffix}</span>
          </div>
          <p className="text-sm md:text-base font-medium text-slate-400">
            {metric.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
