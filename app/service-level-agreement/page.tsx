'use client'

import { motion } from "framer-motion";
import { useState } from "react";
import { Scroll, FileText } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import legalConfig from "../config/sections/legal.json";
import type { LegalSection } from "../types/legal";

export default function serviceLevelAgreement() {
  const [activeSection, setActiveSection] = useState<string>(legalConfig.serviceLevelAgreement.sections[0].title);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -100; // Offset for fixed header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setActiveSection(sectionId);
  };

  // Handle scroll events to update active section
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      const sections = legalConfig.serviceLevelAgreement.sections.map(section => ({
        id: section.title,
        element: document.getElementById(section.title)
      }));

      const current = sections.find(section => {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });

      if (current) {
        setActiveSection(current.id);
      }
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0b0f] transition-colors duration-300">
      <Navbar />
      
      <div className="max-w-7xl mt-12 mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 card-primary px-4 py-2 rounded-full mb-4">
            <FileText className="w-4 h-4 icon-text-primary" />
            <span className="icon-text-primary text-sm">Legal</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 orbitron-font">
            Service Level <span className="icon-text-primary">Agreement</span>
          </h1>

          <p className="text-gray-600 dark:text-gray-300">
            Last updated: {legalConfig.serviceLevelAgreement.lastUpdated}
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-64 flex-shrink-0"
          >
            <div className="sticky top-24 space-y-1">
              {legalConfig.serviceLevelAgreement.sections.map((section: LegalSection) => (
                <button
                  key={section.title}
                  onClick={() => scrollToSection(section.title)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeSection === section.title
                      ? "button-primary text-button-primary"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800/40 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex-1 prose dark:prose-invert max-w-none"
          >
            {legalConfig.serviceLevelAgreement.sections.map((section: LegalSection, index: number) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                id={section.title}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {section.title}
                </h2>
                <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {section.content}
                </div>
              </motion.div>
            ))}

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-12 p-6 bg-white dark:bg-white/3 rounded-xl"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                If you have any questions about these Terms of Service, please contact us at:{" "}
                <a
                  href={`mailto:${legalConfig.serviceLevelAgreement.contactEmail}`}
                  className="icon-text-primary hover:text-icon-text-primary/80 hover:underline"
                >
                  {legalConfig.serviceLevelAgreement.contactEmail}
                </a>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
