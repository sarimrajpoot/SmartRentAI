import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Book, CreditCard, Users, ShieldCheck, MapPin, User, RefreshCw, Lock, MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/footer/Footer";
import { faqs } from "../../components/landing/faq/faqData";
import FaqAccordion from "../../components/landing/faq/FaqAccordion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

const topics = [
  { icon: Book, title: "Booking", desc: "How to find and reserve a car" },
  { icon: CreditCard, title: "Payments", desc: "Security deposits and billing" },
  { icon: Users, title: "Rental Partners", desc: "Managing your fleet and earnings" },
  { icon: ShieldCheck, title: "Driver Verification", desc: "Identity and AI checks" },
  { icon: MapPin, title: "GPS Tracking", desc: "Telematics and vehicle safety" },
  { icon: User, title: "Account", desc: "Managing your profile and data" },
  { icon: RefreshCw, title: "Refunds", desc: "Cancellations and deposit returns" },
  { icon: Lock, title: "Security", desc: "Data protection and privacy" },
];

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-950 to-slate-950" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-8"
          >
            How can we help you?
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative max-w-2xl mx-auto"
          >
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
              <Search size={24} />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for articles, guides, or FAQs..." 
              className="w-full bg-slate-900/50 backdrop-blur-md border border-slate-700 text-white pl-14 pr-6 py-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-xl text-lg placeholder:text-slate-500"
            />
          </motion.div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-24 relative -mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {topics.map((topic, idx) => (
              <motion.button 
                key={idx}
                variants={itemVariants}
                className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 text-left hover:-translate-y-1 hover:shadow-xl hover:border-blue-200 transition-all group"
              >
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <topic.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{topic.title}</h3>
                <p className="text-slate-500 text-sm">{topic.desc}</p>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-600">Quick answers to common questions about our platform.</p>
          </div>
          
          <div className="flex flex-col gap-4">
            {faqs.map((faq) => (
              <FaqAccordion key={faq.id} faq={faq} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support CTA */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-br from-slate-950 to-blue-950 p-10 md:p-14 rounded-3xl text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px]" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 text-white border border-white/20">
                <MessageCircle size={32} />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Still need help?</h2>
              <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
                Our support team is available 24/7 to assist you with any questions or technical issues.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/contact">
                  <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 font-bold rounded-full hover:bg-slate-100 transition-colors shadow-lg flex items-center justify-center gap-2">
                    Contact Support <ArrowRight size={20} />
                  </button>
                </Link>
                <button className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-full border border-white/20 hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                  Live Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
