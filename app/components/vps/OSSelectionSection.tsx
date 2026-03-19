"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Monitor, Download } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useLanguage } from '../../contexts/LanguageContext';

// ===== EASILY MODIFIABLE CONFIGURATION =====

// Header Content Configuration
const HEADER_CONFIG = {
  badge: {
    icon: Monitor,
    text: "Operating Systems"
  },
  title: "Choose your OS",
  description: "Select from a wide range of popular operating systems. All images are pre-configured and ready to deploy instantly on your VPS."
};

// OS Configuration - Easy to modify
const OPERATING_SYSTEMS = [
  {
    id: "ubuntu",
    name: "Ubuntu",
    logo: "/os/ubuntu.png",
  },
  {
    id: "windows",
    name: "Windows",
    logo: "/os/windows.png",
  },
  {
    id: "fedora",
    name: "Fedora",
    logo: "/os/fedora.png",
  },
  {
    id: "debian",
    name: "Debian",
    logo: "/os/debian.png",
  },
  {
    id: "kali",
    name: "Kali Linux",
    logo: "/os/kali.png",
  },
  {
    id: "custom",
    name: "Custom ISO",
    logo: "/os/download.png",
  }
];

export default function OSSelectionSection() {
  const { t } = useLanguage();
  const [selectedOS, setSelectedOS] = useState("ubuntu");

  return (
    <div className="bg-gray-50 dark:bg-[#0a0b0f] relative py-12 px-4 sm:px-6 lg:px-8">
      {/* Content */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col justify-end items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-600/20 px-4 py-2 rounded-full mb-6">
            <Monitor className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-600 dark:text-blue-400 text-sm">{t('osSelection.badge')}</span>
          </div>

          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 orbitron-font">
            {t('osSelection.title').split(' ').slice(0, -1).join(' ')} <span className="text-blue-600 dark:text-blue-400">
              {t('osSelection.title').split(' ').slice(-1)[0]}
            </span>
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
            {t('osSelection.description')}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-wrap justify-center gap-8">
            {OPERATING_SYSTEMS.map((os, index) => (
              <motion.div
                key={os.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                onClick={() => setSelectedOS(os.id)}
                  className={`group cursor-pointer p-6 rounded-md border transition-all duration-300 ${
                    selectedOS === os.id
                      ? "border-blue-400 dark:border-blue-400 bg-[radial-gradient(50%_50%_at_50%_100%,_rgba(30,121,195,0.15)_0%,_transparent_100%)] dark:bg-[radial-gradient(50%_50%_at_50%_100%,_rgba(30,121,195,0.25)_0%,_transparent_100%)]"
                      : "border-transparent hover:border-blue-300 dark:hover:border-blue-400 hover:bg-[radial-gradient(50%_50%_at_50%_100%,_rgba(30,121,195,0.15)_0%,_transparent_100%)] dark:hover:bg-[radial-gradient(50%_50%_at_50%_100%,_rgba(30,121,195,0.25)_0%,_transparent_100%)]"
                  }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    {os.id === "custom" ? (
                      <Download className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <Image
                        src={os.logo}
                        alt={`${os.name} logo`}
                        width={80}
                        height={80}
                        className="object-contain"
                      />
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm mt-4">
                    {os.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
