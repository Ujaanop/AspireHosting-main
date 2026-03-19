'use client'

import { motion } from "framer-motion";
import { Shield, Clock, CreditCard, AlertTriangle, XCircle, CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0b0f] transition-colors duration-300">
      <Navbar />

      <div className="relative overflow-hidden">
        {/* Background Image and Gradients */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: `url('/vps/vps-hero-2.webp')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-gray-50/40 to-transparent dark:from-[#0a0b0f] dark:via-[#0a0b0f]/60 dark:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/80 to-gray-50/40 dark:from-[#0a0b0f] dark:via-[#0a0b0f]/95 dark:to-[#0a0b0f]/60" />
        </div>

        {/* Content */}
        <div className="relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center justify-center gap-2 card-primary px-6 py-3 rounded-full mb-6 border border-secondary">
                <Shield className="w-5 h-5 icon-text-primary" />
                <span className="icon-text-primary text-sm font-medium">Refund Policy</span>
              </div>

              <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 orbitron-font">
                Refund & <span className="icon-text-primary">Cancellation</span> Policy
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4">
                Our comprehensive refund and cancellation policy ensures transparency and fairness for all our customers.
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last Updated: January 2025
              </p>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Refund Eligibility */}
              <div className="bg-white dark:bg-gray-950/20 backdrop-blur-xl border border-secondary rounded-md overflow-hidden hover:border-secondary dark:border-secondary hover:hover-gradient dark:hover:hover-gradient transition-all duration-300">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 card-primary rounded-xl flex items-center justify-center border border-secondary">
                      <Clock className="w-6 h-6 icon-text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      1. Refund Eligibility
                    </h2>
                  </div>
                  
                  <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
                    <p>
                      Aspire Hosting offers a <strong className="text-gray-900 dark:text-white">24-hour refund policy</strong> from the date of purchase for our web hosting services. You are eligible for a refund if you meet the following conditions:
                    </p>
                    
                    <ul className="space-y-2 ml-4">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Your request for a refund is submitted within 24 hours of the initial purchase.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Your account is in good standing with no violations of our Terms of Service.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>If the payment was made in cryptocurrency, it will be refunded as account credits.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>If the payment was made using a coupon code, a refund will not be possible.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>If the payment was made using PayPal and was less than $1.50 USD, a refund will be denied.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Valid Reasons */}
              <div className="bg-white dark:bg-gray-950/20 backdrop-blur-xl border border-secondary rounded-md overflow-hidden hover:border-secondary dark:border-secondary hover:hover-gradient dark:hover:hover-gradient transition-all duration-300">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 card-primary rounded-xl flex items-center justify-center border border-secondary">
                      <CheckCircle className="w-6 h-6 icon-text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      2. Valid Reasons for Refund
                    </h2>
                  </div>
                  
                  <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    <p className="mb-4">Valid reasons for a refund include:</p>
                    <ul className="space-y-2 ml-4">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Unresolved technical issues preventing the use of our services.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Failure to deliver the promised services within the specified timeframe.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Any misrepresentation of our services that significantly differs from what was described at the time of purchase.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Refund Process */}
              <div className="bg-white dark:bg-gray-950/20 backdrop-blur-xl border border-secondary rounded-md overflow-hidden hover:border-secondary dark:border-secondary hover:hover-gradient dark:hover:hover-gradient transition-all duration-300">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 card-primary rounded-xl flex items-center justify-center border border-secondary">
                      <CreditCard className="w-6 h-6 icon-text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      3. Refund Process
                    </h2>
                  </div>
                  
                  <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    <p>
                      To request a refund, please contact our customer support team within the specified 24-hour period. You can reach us through our support tickets. Provide your account details, the reason for the refund, and any relevant information to assist us in processing your request.
                    </p>
                  </div>
                </div>
              </div>

              {/* Refund Exceptions */}
              <div className="bg-white dark:bg-gray-950/20 backdrop-blur-xl border border-secondary rounded-md overflow-hidden hover:border-secondary dark:border-secondary hover:hover-gradient dark:hover:hover-gradient transition-all duration-300">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 card-primary rounded-xl flex items-center justify-center border border-secondary">
                      <AlertTriangle className="w-6 h-6 icon-text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      4. Refund Exceptions
                    </h2>
                  </div>
                  
                  <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
                    <p>Refunds will not be granted in the following situations:</p>
                    <ul className="space-y-2 ml-4">
                      <li className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>The 24-hour refund window has expired.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>If account credits were purchased, there will be no refund for them.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>Violation of our Terms of Service or Acceptable Use Policy.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>Services that have been suspended or terminated due to non-compliance.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>If an item is marked as out of stock through dropdowns or product titles, and you proceed with the order, a refund will not be issued. Instead, the amount will be added to your account credits.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>No refunds will be provided on service renewals.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>Custom Plans are not eligible for refunds, regardless of the reason.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>If a payment was made through PayPal subscriptions, no refund will be granted. It is the customer's responsibility to cancel the subscription before renewal.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Products Not Entitled to Refunds */}
              <div className="bg-white dark:bg-gray-950/20 backdrop-blur-xl border border-secondary rounded-md overflow-hidden hover:border-secondary dark:border-secondary hover:hover-gradient dark:hover:hover-gradient transition-all duration-300">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Products that are not entitled to Refunds:
                  </h2>
                  
                  <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    <ul className="space-y-2 ml-4">
                      <li className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>Standard VPS Florida</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>Cloud Server UK</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>UK DirectAdmin Reseller Hosting</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>Standard VPS Kansas City</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>Domains</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Payment Gateways */}
              <div className="bg-white dark:bg-gray-950/20 backdrop-blur-xl border border-secondary rounded-md overflow-hidden hover:border-secondary dark:border-secondary hover:hover-gradient dark:hover:hover-gradient transition-all duration-300">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    5. Certain Gateways / Payment Methods
                  </h2>
                  
                  <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
                    <p>Following Payment Gateways have some rules:</p>
                    <ul className="space-y-3 ml-4">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span><strong>Cryptomus</strong> (All Payments are final, if requested it can be refunded in account credits)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span><strong>Wert</strong> (All Payments are final, if requested it can be refunded in account credits)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span><strong>Pay4bit</strong> (All Payments are final, if requested it can be refunded in account credits)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span><strong>PayPal</strong> (If a refund is requested in the first 24 hours with a valid/genuine reason and is eligible, a refund will be processed with the exact amount received on our end. That would mean if we received 3 USD out of 3.5 USD then only 3 USD will be refunded as the 0.50 USD was taken by PayPal fee)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Processing Time */}
              <div className="bg-white dark:bg-gray-950/20 backdrop-blur-xl border border-secondary rounded-md overflow-hidden hover:border-secondary dark:border-secondary hover:hover-gradient dark:hover:hover-gradient transition-all duration-300">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    6. Processing Time
                  </h2>
                  
                  <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    <p>
                      Once your refund request is received and approved, we will process the refund within <strong className="text-gray-900 dark:text-white">2-3 Business Days</strong>. The refunded amount will be credited back to the original payment method used for the purchase.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="bg-white dark:bg-gray-950/20 backdrop-blur-xl border border-secondary rounded-md overflow-hidden hover:border-secondary dark:border-secondary hover:hover-gradient dark:hover:hover-gradient transition-all duration-300">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    7. Cancellation Policy
                  </h2>
                  
                  <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    <p>
                      You can cancel your service by navigating to "Services" and clicking "Cancel"; however, refunds won't be processed if the request is made after 24 hours, and applicable conditions apply. If PayPal was used to purchase the service and if the service was later cancelled, it falls under your responsibility to cancel the PayPal subscription on your end to avoid automatic payments to continue coming after cancelling the Service on Aspire Hosting.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white dark:bg-gray-950/20 backdrop-blur-xl border border-secondary rounded-md overflow-hidden hover:border-secondary dark:border-secondary hover:hover-gradient dark:hover:hover-gradient transition-all duration-300">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    8. Contact Information
                  </h2>
                  
                  <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    <p>
                      If you have any questions or concerns about our refund policy, please contact our customer support team at our support tickets.
                    </p>
                  </div>
                </div>
              </div>

              {/* Changes to Policy */}
              <div className="bg-white dark:bg-gray-950/20 backdrop-blur-xl border border-secondary rounded-md overflow-hidden hover:border-secondary dark:border-secondary hover:hover-gradient dark:hover:hover-gradient transition-all duration-300">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    9. Changes to Refund Policy
                  </h2>
                  
                  <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    <p>
                      Aspire Hosting reserves the right to update or modify this refund policy at any time. Any changes will be communicated to users, and the updated policy will be effective immediately upon posting.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

