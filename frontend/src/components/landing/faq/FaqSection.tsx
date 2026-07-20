import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { faqs } from "./faqData";
import type { FAQItem } from "./faqData";
import FaqAccordion from "./FaqAccordion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function FaqSection() {
  const [faqData, setFaqData] = useState<FAQItem[]>([]);

  useEffect(() => {
    // Simulate future API fetch GET /faq
    setFaqData(faqs);
  }, []);

  return (
    <section id="faq" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative blurred background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-50 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-blue-600 bg-blue-50 border border-blue-100 rounded-full">
              Help Center
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to know about SmartRent AI. Can't find the answer you're looking for? Feel free to contact our support team.
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col gap-4"
        >
          {faqData.map((faq) => (
            <motion.div key={faq.id} variants={itemVariants}>
              <FaqAccordion faq={faq} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
