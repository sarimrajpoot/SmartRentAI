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

const termsSections = [
  {
    title: "1. Acceptance of Terms",
    content: "By creating an account, accessing, or using the SmartRent AI platform, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our services."
  },
  {
    title: "2. Bookings & Reservations",
    content: "All bookings are subject to vehicle availability and successful identity verification. A booking is only confirmed once you receive a formal confirmation via email or through the application. SmartRent AI reserves the right to cancel any booking if fraud is suspected."
  },
  {
    title: "3. Payments & Security Deposits",
    content: "Users must provide a valid payment method. You authorize SmartRent AI to charge the rental fees, applicable taxes, and a refundable security deposit. The security deposit will be held for up to 72 hours post-rental to cover potential damages, tolls, or fines."
  },
  {
    title: "4. Cancellation Policy",
    content: "Cancellations made 48 hours prior to the trip start time will receive a full refund. Cancellations made within 48 hours may be subject to a cancellation fee equivalent to 50% of the daily rental rate."
  },
  {
    title: "5. Rental Responsibilities",
    content: "You agree to operate the vehicle safely, in compliance with all local laws and regulations. You must not allow unauthorized drivers to operate the vehicle, use the vehicle for commercial ride-sharing, or drive off-road unless explicitly permitted."
  },
  {
    title: "6. Vehicle Damage & Insurance",
    content: "You are responsible for any damage incurred during your rental period. In the event of an accident, you must immediately notify SmartRent AI and the local authorities. Users are encouraged to select adequate insurance coverage during the booking process."
  },
  {
    title: "7. Fraud Prevention",
    content: "We enforce strict zero-tolerance policies regarding fraudulent activity. Submission of fake identity documents, stolen credit cards, or attempts to bypass our biometric verification will result in immediate permanent suspension and reporting to law enforcement."
  },
  {
    title: "8. AI Monitoring & Telematics",
    content: "By using our service, you explicitly consent to the use of AI computer vision within the cabin for drowsiness and distraction detection, as well as real-time GPS telematics for theft prevention and safety compliance."
  },
  {
    title: "9. Privacy",
    content: "Your privacy is important to us. Our collection and use of personal data in connection with your access to and use of the services is described in our Privacy Policy."
  },
  {
    title: "10. Liability Disclaimer",
    content: "SmartRent AI is a platform connecting vehicle owners and renters. To the maximum extent permitted by law, SmartRent AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the platform."
  },
  {
    title: "11. Account Suspension",
    content: "We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties."
  },
  {
    title: "12. Governing Law",
    content: "These Terms shall be governed by and construed in accordance with the laws of Pakistan, without regard to its conflict of law provisions."
  },
  {
    title: "13. Contact Information",
    content: "If you have any questions regarding these Terms, please contact our legal department at legal@smartrentai.com."
  }
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <section className="relative pt-40 pb-20 bg-slate-950 overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6"
          >
            Terms & Conditions
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
            className="space-y-6"
          >
            {termsSections.map((section, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
              >
                <h2 className="text-xl font-bold text-slate-900 mb-3">{section.title}</h2>
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
