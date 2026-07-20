import CountUpModule from "react-countup";
import { motion } from "framer-motion";

// Vite/ESM interop fix for react-countup
const CountUp = (CountUpModule as any).default || CountUpModule;

const stats = [
  { number: 500, suffix: "+", label: "Verified Cars" },
  { number: 120, suffix: "+", label: "Rental Partners" },
  { number: 15, suffix: "+", label: "Cities" },
  { number: 25000, suffix: "+", label: "Bookings" },
];

export default function HeroStats() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -8 }}
              className="text-center rounded-2xl bg-white shadow-lg p-8 border border-slate-100"
            >
              <h2 className="text-5xl font-bold text-blue-600">
                <CountUp end={stat.number} duration={2} />
                {stat.suffix}
              </h2>

              <p className="mt-3 text-slate-600">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
