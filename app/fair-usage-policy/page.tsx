'use client'

import { motion } from "framer-motion";
import { Shield, Activity, AlertTriangle, Monitor, Bell, Settings, Database, Gavel, RefreshCw } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function FairUsagePolicyPage() {
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
                <span className="icon-text-primary text-sm font-medium">Fair Usage Policy</span>
              </div>

              <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 orbitron-font">
                Fair Usage <span className="icon-text-primary">Policy</span>
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4">
                Our Fair Usage Policy ensures equitable resource distribution and optimal service quality for all customers.
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
              {/* Overview */}
              <div className="bg-white dark:bg-gray-950/20 backdrop-blur-xl border border-secondary rounded-md overflow-hidden hover:border-secondary dark:border-secondary hover:hover-gradient dark:hover:hover-gradient transition-all duration-300">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 card-primary rounded-xl flex items-center justify-center border border-secondary">
                      <Shield className="w-6 h-6 icon-text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      1. Overview
                    </h2>
                  </div>
                  
                  <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    <p>
                      Aspire Hosting is committed to providing a reliable and high-quality web hosting service to all our customers. This Fair Usage Policy ("FUP") outlines acceptable usage of our services to ensure fair and equitable resource distribution.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bandwidth and Resource Usage */}
              <div className="bg-white dark:bg-gray-950/20 backdrop-blur-xl border border-secondary rounded-md overflow-hidden hover:border-secondary dark:border-secondary hover:hover-gradient dark:hover:hover-gradient transition-all duration-300">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 card-primary rounded-xl flex items-center justify-center border border-secondary">
                      <Activity className="w-6 h-6 icon-text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      2. Bandwidth and Resource Usage
                    </h2>
                  </div>
                  
                  <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Bandwidth Allocation:</h3>
                      <p>
                        Our hosting plans come with specified bandwidth allocations. For plans advertised as "500Mbps unmetered," this means the bandwidth speed is allocated at 500 Mbps with unmetered data transfer, allowing unrestricted usage within this speed limit.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Excessive Use:</h3>
                      <p>
                        Excessive use that exceeds the normal and reasonable limits may be considered a violation of this policy. Aspire Hosting reserves the right to review and take appropriate action against accounts exceeding these limits.
                      </p>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Minecraft Backup Limit:</h3>
                      <p className="text-blue-800 dark:text-blue-200">
                        Specifically for Minecraft hosting, we request that all your backups stay under <strong>60-80 GB</strong>. Any backups exceeding this limit will be subject to restrictions.
                      </p>
                    </div>
                    
                    <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                      <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-2">VPS CPU Usage:</h3>
                      <p className="text-orange-800 dark:text-orange-200">
                        The full allotted CPU to your VPS can be used, but not 24/7. For example, if allocated 4vCores, the entire 4vCores cannot be used 24/7.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prohibited Activities */}
              <div className="bg-white dark:bg-gray-950/20 backdrop-blur-xl border border-secondary rounded-md overflow-hidden hover:border-secondary dark:border-secondary hover:hover-gradient dark:hover:hover-gradient transition-all duration-300">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 card-primary rounded-xl flex items-center justify-center border border-secondary">
                      <AlertTriangle className="w-6 h-6 icon-text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      3. Prohibited Activities
                    </h2>
                  </div>
                  
                  <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
                    <p>The following activities are strictly prohibited under this Fair Usage Policy:</p>
                    <ul className="space-y-3 ml-4">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span><strong>Excessive Resource Consumption:</strong> Any usage that adversely impacts server performance or disrupts the experience of other users.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span><strong>Abuse of Network Resources:</strong> Any attempt to undermine the integrity of our network, including but not limited to, malicious activities, denial of service attacks, and unauthorized access.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span><strong>Spam and Unsolicited Communication:</strong> Sending unsolicited emails, messages, or any form of communication that may be considered spam.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span><strong>Illegal Content:</strong> Hosting or distributing content that violates local, national, or international laws.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Monitoring and Enforcement */}
              <div className="bg-white dark:bg-gray-950/20 backdrop-blur-xl border border-secondary rounded-md overflow-hidden hover:border-secondary dark:border-secondary hover:hover-gradient dark:hover:hover-gradient transition-all duration-300">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 card-primary rounded-xl flex items-center justify-center border border-secondary">
                      <Monitor className="w-6 h-6 icon-text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      4. Monitoring and Enforcement
                    </h2>
                  </div>
                  
                  <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    <p>
                      Aspire Hosting employs various tools and monitoring systems to identify accounts that may be in violation of this Fair Usage Policy. In the event of a potential violation, we may take corrective action, including, but not limited to, warning the user, suspending the account, or terminating services.
                    </p>
                  </div>
                </div>
              </div>

              {/* Notification */}
              <div className="bg-white dark:bg-gray-950/20 backdrop-blur-xl border border-secondary rounded-md overflow-hidden hover:border-secondary dark:border-secondary hover:hover-gradient dark:hover:hover-gradient transition-all duration-300">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 card-primary rounded-xl flex items-center justify-center border border-secondary">
                      <Bell className="w-6 h-6 icon-text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      5. Notification
                    </h2>
                  </div>
                  
                  <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    <p>
                      If your account is found to be in violation of this policy, Aspire Hosting will make reasonable efforts to notify you. You will be given an opportunity to rectify the situation within a specified timeframe.
                    </p>
                  </div>
                </div>
              </div>

              {/* Resource Allocation Adjustments */}
              <div className="bg-white dark:bg-gray-950/20 backdrop-blur-xl border border-secondary rounded-md overflow-hidden hover:border-secondary dark:border-secondary hover:hover-gradient dark:hover:hover-gradient transition-all duration-300">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 card-primary rounded-xl flex items-center justify-center border border-secondary">
                      <Settings className="w-6 h-6 icon-text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      6. Resource Allocation Adjustments
                    </h2>
                  </div>
                  
                  <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
                    <p>
                      In cases of excessive resource usage impacting server stability or the experience of other users, Aspire Hosting reserves the right to adjust resource allocations or offer alternative solutions to affected users.
                    </p>
                    
                    <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Domains:</h3>
                      <p className="text-yellow-800 dark:text-yellow-200">
                        Domain registrations are subject to fair use, and any activity that monopolizes resources, such as bulk domain registration for spamming or cybersquatting, is prohibited and may result in suspension or termination of your service.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Unmetered Storage Clause */}
              <div className="bg-white dark:bg-gray-950/20 backdrop-blur-xl border border-secondary rounded-md overflow-hidden hover:border-secondary dark:border-secondary hover:hover-gradient dark:hover:hover-gradient transition-all duration-300">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 card-primary rounded-xl flex items-center justify-center border border-secondary">
                      <Database className="w-6 h-6 icon-text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      7. Unmetered Storage Clause for DirectAdmin Unmetered Plan
                    </h2>
                  </div>
                  
                  <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    <p>
                      Due to the unmetered nature of the DirectAdmin plan, Aspire Hosting reserves the right to request that customers with excessively high usage migrate to a VPS for better performance and resource management.
                    </p>
                  </div>
                </div>
              </div>

              {/* Appeals */}
              <div className="bg-white dark:bg-gray-950/20 backdrop-blur-xl border border-secondary rounded-md overflow-hidden hover:border-secondary dark:border-secondary hover:hover-gradient dark:hover:hover-gradient transition-all duration-300">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 card-primary rounded-xl flex items-center justify-center border border-secondary">
                      <Gavel className="w-6 h-6 icon-text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      8. Appeals
                    </h2>
                  </div>
                  
                  <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    <p>
                      If you believe your account was flagged in error or if you have rectified the issues leading to a violation, you may appeal the decision by contacting our support team.
                    </p>
                  </div>
                </div>
              </div>

              {/* Changes to Policy */}
              <div className="bg-white dark:bg-gray-950/20 backdrop-blur-xl border border-secondary rounded-md overflow-hidden hover:border-secondary dark:border-secondary hover:hover-gradient dark:hover:hover-gradient transition-all duration-300">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 card-primary rounded-xl flex items-center justify-center border border-secondary">
                      <RefreshCw className="w-6 h-6 icon-text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      9. Changes to Fair Usage Policy
                    </h2>
                  </div>
                  
                  <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    <p>
                      Aspire Hosting reserves the right to update or modify this Fair Usage Policy at any time. Any changes will be communicated to users, and the updated policy will be effective immediately upon posting.
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

