import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
} from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-400/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700"
          >
            Contact Us
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-6 text-5xl font-bold text-slate-900"
          >
            We'd Love to Hear From You
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600"
          >
            Whether you're looking to rent a vehicle, become a rental
            partner, or simply have a question, our team is here to help.
          </motion.p>
        </div>
      </section>

      {/* Main Section */}
      <section className="max-w-7xl mx-auto px-6 pb-24 grid lg:grid-cols-2 gap-12">

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-white shadow-xl border border-slate-200 p-10"
        >
          <h2 className="text-3xl font-bold text-slate-900">
            Send us a Message
          </h2>

          <p className="mt-3 text-slate-600">
            Fill out the form below and we'll get back to you as soon as
            possible.
          </p>

          <form className="mt-8 space-y-6">

            <div>
              <label className="block mb-2 font-medium">
                Full Name
              </label>

              <input
                type="text"
                placeholder="John Doe"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Email Address
              </label>

              <input
                type="email"
                placeholder="john@example.com"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Subject
              </label>

              <input
                type="text"
                placeholder="How can we help?"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Message
              </label>

              <textarea
                rows={6}
                placeholder="Write your message..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700"
            >
              <Send size={18} />
              Send Message
            </button>

          </form>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="rounded-3xl bg-white shadow-xl border border-slate-200 p-8">
            <h2 className="text-3xl font-bold text-slate-900">
              Contact Information
            </h2>

            <div className="mt-8 space-y-6">

              <div className="flex items-start gap-4">
                <Mail className="text-blue-600" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-slate-600">
                    support@smartrent.ai
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="text-blue-600" />
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-slate-600">
                    +92 300 1234567
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="text-blue-600" />
                <div>
                  <h3 className="font-semibold">Office</h3>
                  <p className="text-slate-600">
                    Islamabad, Pakistan
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="text-blue-600" />
                <div>
                  <h3 className="font-semibold">
                    Working Hours
                  </h3>
                  <p className="text-slate-600">
                    Monday - Friday
                    <br />
                    9:00 AM - 6:00 PM
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Optional Map Placeholder */}
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-100 h-72 flex items-center justify-center">
            <p className="text-slate-500">
              Google Maps will be integrated here
            </p>
          </div>

        </motion.div>

      </section>
    </div>
  );
}