import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { featuredCars } from "./carsData";
import CarCard from "./CarCard";
import type { Car } from "./carsData";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function FeaturedCarsSection() {
  // Setup state to prepare for future backend integration.
  // Initially load mock data, but structure allows easy switch to fetch()
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch delay
    const loadCars = async () => {
      // In the future: const response = await fetch('/api/cars/featured');
      // const data = await response.json();
      
      // Using mock data for now
      setCars(featuredCars);
      setIsLoading(false);
    };

    loadCars();
  }, []);

  return (
    <section id="cars" className="py-24 bg-slate-50 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold tracking-wider text-blue-600 bg-blue-100 border border-blue-200 rounded-full">
              Featured Fleet
            </span>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Explore Premium Vehicles
            </h2>
            <p className="text-lg text-slate-600">
              Browse AI-verified vehicles from trusted rental partners across Pakistan.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button className="group flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors">
              View All Vehicles
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>

        {/* Cars Grid */}
        {!isLoading && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </motion.div>
        )}

        {/* Loading State Placeholder */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[450px] bg-white rounded-[2rem] shadow-sm border border-slate-100 animate-pulse" />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
