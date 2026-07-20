import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { testimonials } from "./testimonialsData";
import type { Testimonial } from "./testimonialsData";
import TestimonialCard from "./TestimonialCard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

export default function TestimonialsSection() {
  const [data, setData] = useState<Testimonial[]>([]);

  useEffect(() => {
    // Simulating future API fetch GET /testimonials
    setData(testimonials);
  }, []);

  return (
    <section id="testimonials" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-blue-600 bg-blue-100 border border-blue-200 rounded-full">
              Customer Stories
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
              Trusted by Thousands of Drivers
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed">
              See why customers and rental partners choose SmartRent AI for a secure, seamless, and intelligent rental experience.
            </p>
          </motion.div>
        </div>

        {/* Mobile Carousel / Desktop Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="flex overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-3 gap-6 pb-8 lg:pb-0 hide-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {data.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="w-[85vw] sm:w-[350px] lg:w-auto shrink-0 snap-center first:ml-6 lg:first:ml-0 last:mr-6 lg:last:mr-0"
            >
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </motion.div>
        
        {/* Helper style for hiding scrollbar in webkit */}
        <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </section>
  );
}
