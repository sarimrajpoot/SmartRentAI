import { motion } from "framer-motion";
import {
  Search,
  ShieldCheck,
  CalendarCheck,
  BrainCircuit,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Search & Compare Vehicles",
    description:
      "Browse hundreds of AI-verified vehicles from trusted rental partners across Pakistan. Compare prices, locations, ratings and vehicle features before booking.",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "AI Identity Verification",
    description:
      "Our AI-powered verification system securely validates customer identity, helping rental partners reduce fraud while keeping the booking process quick and reliable.",
  },
  {
    number: "03",
    icon: CalendarCheck,
    title: "Instant Booking & Live Tracking",
    description:
      "Confirm your booking in seconds, receive instant confirmation and track your vehicle in real time using integrated GPS technology.",
  },
  {
    number: "04",
    icon: BrainCircuit,
    title: "Enjoy Your AI-Protected Journey",
    description:
      "Drive confidently with AI-powered safety features including driver monitoring, theft detection, trip analytics and live notifications.",
  },
];

const features = [
  {
    icon: ShieldCheck,
    title: "AI Identity Verification",
  },
  {
    icon: CalendarCheck,
    title: "Live GPS Tracking",
  },
  {
    icon: BrainCircuit,
    title: "Driver Monitoring",
  },
  {
    icon: Search,
    title: "AI Recommendations",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white py-28"
    >
      {/* Background Glow */}

      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            How It Works
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900 md:text-5xl">
            Rent Smarter in{" "}
            <span className="text-blue-600">4 Simple Steps</span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            SmartRent AI simplifies the entire rental process using artificial
            intelligence, secure verification and real-time tracking for a safer
            and smarter experience.
          </p>
        </motion.div>

        {/* Timeline */}

        <div className="relative grid gap-8 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.15,
                  duration: 0.6,
                }}
                whileHover={{
                  y: -10,
                }}
                className="relative rounded-3xl border border-slate-200 bg-white p-8 shadow-xl transition-all"
              >
                {/* Step Number */}

                <div className="absolute right-6 top-5 text-5xl font-black text-slate-100">
                  {step.number}
                </div>

                {/* Connector */}

                {index !== steps.length - 1 && (
                  <div className="absolute left-full top-16 hidden h-1 w-8 bg-gradient-to-r from-blue-500 to-cyan-400 lg:block" />
                )}

                {/* Icon */}

                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg">
                  <Icon className="h-8 w-8 text-white" />
                </div>

                <h3 className="mb-4 text-2xl font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="leading-7 text-slate-600">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Divider */}

        <div className="my-24 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

        {/* Why SmartRent AI */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="mb-12 text-center text-3xl font-bold text-slate-900">
            Why Choose SmartRent AI?
          </h3>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  whileHover={{
                    y: -8,
                    scale: 1.03,
                  }}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500">
                    <Icon className="h-7 w-7 text-white" />
                  </div>

                  <h4 className="text-lg font-semibold text-slate-900">
                    {feature.title}
                  </h4>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-24 rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-12 text-center text-white shadow-2xl"
        >
          <h2 className="text-4xl font-bold">
            Ready to Experience Smarter Car Rentals?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
            Join thousands of customers and rental partners using Pakistan's
            first AI-powered vehicle rental platform.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <button className="rounded-xl bg-white px-8 py-4 font-semibold text-blue-700 transition hover:scale-105">
              Browse Vehicles
            </button>

            <button className="flex items-center justify-center gap-2 rounded-xl border border-white/30 px-8 py-4 font-semibold text-white backdrop-blur transition hover:bg-white/10">
              Become a Partner
              <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}