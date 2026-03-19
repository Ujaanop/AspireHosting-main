'use client'

import { motion } from "framer-motion";
import { Shield, Lock, Fingerprint } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0b0f] transition-colors duration-300">
      <Navbar />

      <div className="relative overflow-hidden">
        {/* Background Image and Gradients */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: `url('/vps/vps-hero-3.webp')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-gray-50/40 to-transparent dark:from-[#0a0b0f] dark:via-[#0a0b0f]/60 dark:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/80 to-gray-50/40 dark:from-[#0a0b0f] dark:via-[#0a0b0f]/95 dark:to-[#0a0b0f]/60" />
        </div>

        {/* Content */}
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center justify-center gap-2 card-primary px-6 py-3 rounded-full mb-6 border border-secondary">
                <Shield className="w-5 h-5 icon-text-primary" />
                <span className="icon-text-primary text-sm font-medium">Privacy Policy</span>
              </div>

              <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 orbitron-font">
                Your Privacy is Our <span className="icon-text-primary">Priority</span>
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4">
                We are committed to protecting your personal information and being transparent about how we use it.
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: June 2024
              </p>
            </motion.div>

            {/* Key Points Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4"
            >
              {[
                {
                  icon: Lock,
                  title: "Data Security",
                  description: "Your data is encrypted and stored securely on our protected servers."
                },
                {
                  icon: Shield,
                  title: "No Data Selling",
                  description: "We never sell your personal information to third parties."
                },
                {
                  icon: Fingerprint,
                  title: "Your Control",
                  description: "Access, update, or delete your data at any time."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="bg-white dark:bg-gray-950/20 backdrop-blur-xl rounded-md p-6 border border-secondary hover:border-secondary dark:border-secondary dark:hover:border-secondary hover:hover-gradient dark:hover:hover-gradient transition-all duration-300"
                >
                  <div className="w-12 h-12 card-primary rounded-xl flex items-center justify-center mb-4 border border-secondary">
                    <item.icon className="w-6 h-6 icon-text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-gray-950/20 backdrop-blur-xl border border-secondary hover:border-secondary dark:border-secondary rounded-md overflow-hidden dark:hover:border-secondary hover:hover-gradient dark:hover:hover-gradient transition-all duration-300"
            >
              <div className="p-8 border-b border-secondary last:border-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  1. Information We Collect
                </h2>
                <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  <p className="mb-2 font-semibold">Personal Information:</p>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>Name, email, address, payment details.</li>
                  </ul>

                  <p className="mb-2 font-semibold">How We Use Your Information:</p>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>Providing and maintaining services.</li>
                    <li>Personalizing user experience.</li>
                    <li>Processing payments.</li>
                    <li>Communicating with users.</li>
                    <li>Analyzing usage trends.</li>
                  </ul>

                  <p className="mb-2 font-semibold">Disclosure of Your Information:</p>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>With service providers.</li>
                    <li>When required by law.</li>
                    <li>To protect rights and safety.</li>
                    <li>With user consent.</li>
                  </ul>
                </div>
              </div>
              <div className="p-8 border-b border-secondary last:border-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  2. Data Security
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  We take reasonable security measures but cannot guarantee absolute security.
                </p>
              </div>
              <div className="p-8 border-b border-secondary last:border-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  3. Your Choices
                </h2>
                <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>Update or correct account information.</li>
                    <li>Opt-out of promotional communications.</li>
                    <li>Request account deletion.</li>
                  </ul>
                </div>
              </div>
              <div className="p-8 border-b border-secondary last:border-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  4. Children's Privacy
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Our services are not intended for children under 13.
                </p>
              </div>
              <div className="p-8 border-b border-secondary last:border-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  5. Changes to This Privacy Policy
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  We may update this policy; check for changes.
                </p>
              </div>
              <div className="p-8 border-b border-secondary last:border-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  6. Contact Us
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  For questions or concerns, contact us through support tickets or email us at support@aspirehosting.net.
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Thank you for choosing Aspire Hosting.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
