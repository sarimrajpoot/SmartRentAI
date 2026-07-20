import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import type { FAQItem } from "./faqData";

interface FaqAccordionProps {
  faq: FAQItem;
}

export default function FaqAccordion({ faq }: FaqAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
      initial={false}
      animate={{ backgroundColor: isOpen ? "rgb(248 250 252)" : "rgb(255 255 255)" }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left focus:outline-none"
      >
        <span className="text-lg font-bold text-slate-900">{faq.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            isOpen ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
          }`}
        >
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 text-slate-600 leading-relaxed">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
