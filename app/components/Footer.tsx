"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"
import { Mail, Phone, Gamepad2, ExternalLink, Linkedin, Youtube, Instagram } from "lucide-react"
import { FaAddressBook, FaDiscord } from "react-icons/fa6"
import DiscordBanner from "./DiscordBanner"
import { useLanguage } from "../contexts/LanguageContext"
import FooterStatus from "./FooterStatus"

export default function Footer() {
  const { t } = useLanguage()
  
  const quickLinks = [
    { name: t('footer.clientArea'), href: "https://billing.aspirehosting.net/login" },
    { name: t('footer.discord'), href: "/discord" },
    { name: t('footer.vpsHosting'), href: "/vps" },
    { name: t('footer.dedicatedServerHosting'), href: "/dedicated" }
  ]

  const companyLinks = [
    { name: t('footer.aboutUs'), href: "/about-us" },
    { name: t('footer.careers'), href: "/careers" },
    { name: t('Trustpilot'), href: "https://www.trustpilot.com/review/aspirehosting.in" },
    { name: t('Infrastructure'), href: "/infrastructure" },
    { name: t('Blogs'), href: "/blog" }
  ]

  const legalLinks = [
    { name: t('navbar.termsOfService'), href: "/terms-of-services" },
    { name: t('navbar.privacyPolicy'), href: "/privacy-policy" },
    { name: t('Service Level Agreement'), href: "/service-level-agreement" },
    { name: t('Acceptable Usage Policy'), href: "/acceptable-usage-policy" },
    { name: t('Refund & Cancellation Policy'), href: "/refund-policy" },
    { name: t('Fair Usage Policy'), href: "/fair-usage-policy" },
  ]

  const contactInfo = [
    { icon: Mail, label: t('footer.email'), value: "support@aspirehosting.net", href: "mailto:support@aspirehosting.net" },
    { icon: Phone, label: t('footer.phone'), value: "+91 8910252658", href: "tel:+91 8910252658" },
    { icon: Gamepad2, label: t('Billing'), value: "billing.aspirehosting.net", href: "https://billing.aspirehosting.net" },
    { icon: FaAddressBook, label: t('Address'), value: "Q461/A, Garden Reach, Kolkata, West Bengal, India", href: "" },
  ]

  const socialMediaLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/company/aspire-hosting/", label: "LinkedIn" },
    { icon: FaDiscord, href: "https://discord.gg/B7J4dPZceh", label: "Discord" },
    { icon: Youtube, href: "https://www.youtube.com/@Aspire-Hosting", label: "YouTube" }
  ]

  return (
    <div className="relative">
      {/* Discord Banner with cut-off effect */}
      <div className="relative z-30 -mb-47">
        <DiscordBanner />
      </div>
      
      <footer className="bg-gray-100 dark:bg-[#0a0b0f] border-t border-gray-200 dark:border-white/10 relative z-10 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 mt-24  md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and Company Info */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="lg:col-span-1"
      >
        <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-6 orbitron-font">
          Aspire Hosting 
        </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
              {t('footer.description')}
            </p>
            <div className="text-xs text-gray-500 dark:text-gray-500 mb-4">
              Customized by <span className="icon-text-primary font-medium">AspireHosting</span>
            </div>
            
            {/* Social Media Buttons */}
            <div className="flex items-center space-x-2 mb-4">
              {socialMediaLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-9 h-9 bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-white/10 dark:hover:bg-white/5 hover:border-primary hover:text-primary dark:hover:text-primary transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>

          </motion.div>

          {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="lg:col-span-1"
      >
            <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-6 orbitron-font">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-icon-text-primary dark:hover:text-icon-text-primary transition-colors duration-300 text-sm flex items-center group"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="lg:col-span-1"
      >
            <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-6 orbitron-font">{t('footer.company')}</h3>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-icon-text-primary dark:hover:text-icon-text-primary transition-colors duration-300 text-sm flex items-center group"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="lg:col-span-1"
      >
            <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-6 orbitron-font">{t('footer.legal')}</h3>
            <ul className="space-y-3">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-icon-text-primary dark:hover:text-icon-text-primary transition-colors duration-300 text-sm flex items-center group"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Information */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="lg:col-span-1"
      >
            <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-6 orbitron-font">{t('footer.contactUs')}</h3>
            <ul className="space-y-4">
              {contactInfo.map((contact, index) => (
                <li key={index}>
                  <a
                    href={contact.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-icon-text-primary dark:hover:text-icon-text-primary transition-colors duration-300 text-sm flex items-center group"
                  >
                    <contact.icon className="w-4 h-4 mr-3 icon-text-primary" />
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wide">{contact.label}</div>
                      <div className="group-hover:text-icon-text-primary dark:group-hover:text-icon-text-primary transition-colors duration-300">{contact.value}</div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>

        {/* Bottom Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-12 pt-8 border-t border-gray-200 dark:border-white/10"
      >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 dark:text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} AspireHosting. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <FooterStatus />
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
    </div>
  )
}
