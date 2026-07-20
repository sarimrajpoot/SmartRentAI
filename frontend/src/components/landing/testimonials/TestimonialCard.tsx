import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Quote, Star, BadgeCheck } from "lucide-react";
import type { Testimonial } from "./testimonialsData";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8 }}
      className="group relative bg-white/80 backdrop-blur-xl border border-slate-200/50 p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      <div className="absolute top-8 right-8 text-blue-100 group-hover:text-blue-600/10 transition-colors duration-500">
        <Quote size={48} className="rotate-180" />
      </div>

      <div className="flex items-center gap-1 mb-6">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
        ))}
      </div>

      <p className="text-slate-700 leading-relaxed text-lg mb-8 relative z-10 flex-grow">
        "{testimonial.review}"
      </p>

      <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-100">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-white"
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-900">{testimonial.name}</span>
            <BadgeCheck size={16} className="text-blue-500" />
          </div>
          <span className="text-sm font-medium text-slate-500">
            {testimonial.city} • {testimonial.vehicle}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
