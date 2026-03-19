'use client'

import { motion } from "framer-motion";
import { BookOpen, Scale, FileText } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0b0f] transition-colors duration-300">
      <Navbar />

      <div className="relative overflow-hidden">
        {/* Background Image and Gradients */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: `url('/vps/vps-hero-1.webp')`,
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
                <BookOpen className="w-5 h-5 icon-text-primary" />
                <span className="icon-text-primary text-sm font-medium">Terms of Service</span>
              </div>

              <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 orbitron-font">
                Terms of <span className="icon-text-primary">Service</span>
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4">
                The legal agreement governing your use of our hosting services.
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
                  icon: Scale,
                  title: "Fair Usage",
                  description: "Ensuring equitable resource distribution and preventing abuse."
                },
                {
                  icon: FileText,
                  title: "Legal Compliance",
                  description: "Adhering to all applicable laws and regulations."
                },
                {
                  icon: BookOpen,
                  title: "Community Standards",
                  description: "Promoting a safe and positive environment for all users."
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
                  1. Introduction
                </h2>
                <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  <p className="mb-4">
                    Welcome to Aspire Hosting! These Terms of Service ("Terms") govern your use of our web hosting services. By accessing or using our services, you agree to comply with these Terms.
                  </p>
                </div>
              </div>
              <div className="p-8 border-b border-secondary last:border-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  2. Account Registration
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  To use our services, you must create an account with accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                </p>
              </div>
              <div className="p-8 border-b border-secondary last:border-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  3. Service Description
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Aspire Hosting provides web hosting services, including but not limited to domain registration, website hosting, and related services. Details of the services, including pricing, are available on our website.
                </p>
              </div>
              <div className="p-8 border-b border-secondary last:border-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  4. Payment and Billing
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  You agree to pay all fees associated with your use of our services as specified on our website. Payment terms, billing cycles, and refund policies are outlined in our Billing Policy, which is incorporated by reference.
                </p>
              </div>
              <div className="p-8 border-b border-secondary last:border-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  5. Acceptable Use
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  You agree to use our services in compliance with applicable laws and our Acceptable Use Policy. Prohibited activities include, but are not limited to, illegal content, spam, and any actions that may disrupt our services or harm other users.
                </p>
              </div>
              <div className="p-8 border-b border-secondary last:border-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  6. Data Security and Privacy
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  We take reasonable measures to protect your data, as outlined in our Privacy Policy. However, you are responsible for maintaining the security of your account and website content.
                </p>
              </div>
              <div className="p-8 border-b border-secondary last:border-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  7. Intellectual Property
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  You retain ownership of your content. By using our services, you grant Aspire Hosting a non-exclusive license to use, reproduce, and display your content for the purpose of providing and improving our services.
                </p>
              </div>
              <div className="p-8 border-b border-secondary last:border-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  8. Domain Ownership and Responsibilities
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  You are solely responsible for ensuring that your domain name does not infringe upon the rights of any third party, and you agree to indemnify and hold Aspire Hosting harmless against any claims arising from your domain registration or use.
                </p>
              </div>
              <div className="p-8 border-b border-secondary last:border-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  9. Termination
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  We reserve the right to suspend or terminate your account if you violate these Terms or for any other reason at our discretion. You may terminate your account at any time by following the instructions on our website.
                </p>
              </div>
              <div className="p-8 border-b border-secondary last:border-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  10. Service Suspension for Disruptive Activities
                </h2>
                <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  <p className="mb-4">
                    In the event of any activities deemed by Aspire Hosting to be disruptive to our services or the experience of other users, we reserve the right to suspend your access to our services without prior notice. Such disruptive activities may include, but are not limited to:
                  </p>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>Excessive use of system resources</li>
                    <li>Any activity that compromises the security or stability of our systems</li>
                    <li>Actions that result in the impairment of services for other users</li>
                  </ul>
                  <p className="mb-4">
                    More Info on this: <a href="https://aspirehosting.net/acceptable-usage-policy" className="text-blue-500 hover:underline">https://aspirehosting.net/acceptable-usage-policy</a>
                  </p>
                  <p>
                    If your account is suspended due to disruptive activities, no refunds will be provided for any remaining service period.
                  </p>
                </div>
              </div>
              <div className="p-8 border-b border-secondary last:border-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  11. Any Specific Info on our products
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Aspire Hosting does not offer spoon-feeding support for our VPS Plans; but, if you need assistance with a light issue, we are happy to help.
                </p>
              </div>
              <div className="p-8 border-b border-secondary last:border-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  12. Limitation of Liability
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Aspire Hosting is not liable for any indirect, incidental, or consequential damages arising from your use of our services. Our total liability is limited to the fees you paid us in the last 3 months.
                </p>
              </div>
              <div className="p-8 border-b border-secondary last:border-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  13. Governing Law
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  These Terms are governed by the laws of India. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of India.
                </p>
              </div>
              <div className="p-8 border-b border-secondary last:border-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  14. Changes to Terms
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  We may update these Terms from time to time. You will be notified of any changes, and your continued use of our services after the changes take effect constitutes acceptance of the revised Terms.
                </p>
                {/* <p className="text-gray-600 dark:text-gray-300 leading-relaxed"> Legal Entity Name: B Namarata Patra</p> */}
              </div>
              {/* <div className="p-8 border-b border-secondary last:border-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  15. Tebex Checkout
                </h2>
                <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  <p className="mb-4">
                    We partner with Tebex Limited (www.tebex.io), who are the official merchant of digital content produced by us. If you wish to purchase licenses to use digital content we produce, you must do so through Tebex as our licensed reseller and merchant of record. In order to make any such purchase from Tebex, you must agree to their terms, available at <a href="https://checkout.tebex.io/terms" className="text-blue-500 hover:underline">https://checkout.tebex.io/terms</a>. If you have any queries about a purchase made through Tebex, including but not limited to refund requests, technical issues or billing enquiries, you should contact Tebex support at <a href="https://www.tebex.io/contact/checkout" className="text-blue-500 hover:underline">https://www.tebex.io/contact/checkout</a> in the first instance. 
                  </p>
                </div>
              </div> */}
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
