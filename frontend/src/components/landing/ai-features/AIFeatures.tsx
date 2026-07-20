import { motion } from "framer-motion";
import { aiFeatures } from "./aiFeaturesData";
import FeatureCard from "./FeatureCard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function AIFeatures() {
  return (
    <section 
      id="features" 
      className="relative py-24 bg-slate-950 overflow-hidden"
    >
      {/* Background ambient lighting matching the Hero section */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header section */}
        <div className="flex flex-col items-center text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-blue-400 bg-blue-900/20 border border-blue-800/50 rounded-full">
              AI Powered Platform
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
              Why SmartRent AI?
            </h2>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed">
              SmartRent AI combines artificial intelligence, real-time monitoring, and smart booking technology to provide a safer and more intelligent vehicle rental experience.
            </p>
          </motion.div>
        </div>

        {/* Feature Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {aiFeatures.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
