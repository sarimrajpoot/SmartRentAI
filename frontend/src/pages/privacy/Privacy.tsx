import { motion } from "framer-motion";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/footer/Footer";

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

const privacySections = [
  {
    title: "Introduction",
    content: "Welcome to SmartRent AI. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our mobile applications."
  },
  {
    title: "Information We Collect",
    content: "We collect personal information that you voluntarily provide to us when you register on the platform. This includes names, phone numbers, email addresses, mailing addresses, driver's licenses, and identity documents required for verification."
  },
  {
    title: "How We Use Data",
    content: "We use personal information collected via our platform for a variety of business purposes, including to facilitate account creation, process your bookings, enforce our terms, manage user accounts, and deliver targeted advertising."
  },
  {
    title: "Cookies",
    content: "We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy."
  },
  {
    title: "Identity Verification",
    content: "To ensure a secure rental ecosystem, we use AI-powered computer vision to verify your government-issued ID against real-time facial scans. This biometric data is processed securely and is never sold to third parties."
  },
  {
    title: "GPS Data",
    content: "While renting a vehicle, real-time GPS location data is collected for fleet management, theft prevention, and safety monitoring. This data is only accessible to authorized rental partners and platform administrators during active booking periods."
  },
  {
    title: "Payment Information",
    content: "We process payments via secure, PCI-compliant third-party payment gateways. We do not store your complete credit card numbers on our servers."
  },
  {
    title: "Data Security",
    content: "We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process, including end-to-end encryption for sensitive data."
  },
  {
    title: "Third Party Services",
    content: "We may share your data with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf and require access to such information to do that work."
  },
  {
    title: "Your Rights",
    content: "Depending on your location, you may have the right to request access to the personal information we collect from you, change that information, or delete it in some circumstances."
  },
  {
    title: "Contact Information",
    content: "If you have questions or comments about this notice, you may email us at privacy@smartrentai.com or by post to our registered office in Pakistan."
  }
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <section className="relative pt-40 pb-20 bg-slate-950 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6"
          >
            Privacy Policy
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400"
          >
            Last updated: October 12, 2026
          </motion.p>
        </div>
      </section>

      <section className="py-24 relative flex-1">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {privacySections.map((section, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-4">{section.title}</h2>
                <div className="w-12 h-1 bg-blue-500 rounded-full mb-6" />
                <p className="text-slate-600 leading-relaxed">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
