"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import uiConfig from "../../config/sections/ui.json";
import type { UIConfig, Currency } from "../../types/ui";
import { useCurrency } from "../../contexts/CurrencyContext";

const config = uiConfig as UIConfig;

interface CurrencySelectorProps {
  selectedCurrency?: Currency;
  onCurrencyChange?: (currency: Currency) => void;
  className?: string;
}

export function CurrencySelector({ 
  selectedCurrency: propSelectedCurrency, 
  onCurrencyChange: propOnCurrencyChange, 
  className = "" 
}: CurrencySelectorProps) {
  // Use context if no props provided, otherwise use props (for backward compatibility)
  const contextCurrency = useCurrency();
  const selectedCurrency = propSelectedCurrency || contextCurrency.selectedCurrency;
  const onCurrencyChange = propOnCurrencyChange || contextCurrency.setSelectedCurrency;
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 300,
        duration: 0.2,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.15,
        ease: "easeInOut" as const,
      },
    },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.02,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 300,
      },
    },
    tap: { scale: 0.98 },
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <motion.button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        className="flex items-center justify-between w-full bg-white/20 dark:bg-white/5 hover:bg-white/30 dark:hover:bg-white/10 border border-white/20 dark:border-white/10 hover:border-blue-500/40 dark:hover:border-blue-400/40 rounded-lg px-3 sm:px-4 py-2 text-gray-900 dark:text-white transition-all duration-300 backdrop-blur-sm"
      >
        <span>
          {selectedCurrency.symbol} {selectedCurrency.code}
        </span>
        <motion.div
          animate={{ rotate: isDropdownOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-full mt-2 right-0 w-full sm:w-64 bg-white/20 dark:bg-[#0a0b0f]/90 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-lg shadow-xl z-[100] overflow-hidden"
          >
            {config.currency.supportedCurrencies.map((currency, index) => (
              <motion.button
                key={currency.code}
                onClick={() => {
                  onCurrencyChange(currency);
                  setIsDropdownOpen(false);
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: index * 0.05 }
                }}
                whileHover={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  transition: { duration: 0.2 }
                }}
                className="w-full px-4 py-2 text-left hover:bg-white/10 dark:hover:bg-white/10 text-gray-900 dark:text-white transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
              >
                {currency.symbol} {currency.code} - {currency.name}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

