'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useCurrency } from '../contexts/CurrencyContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import type { Currency } from '../types/ui';

const DISPLAYED_CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];

interface CurrencySelectorProps {
  className?: string;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({ className = '' }) => {
  const { selectedCurrency, setSelectedCurrency, isLoading } = useCurrency();

  const handleChange = (code: string) => {
    const currency = DISPLAYED_CURRENCIES.find(c => c.code === code);
    if (currency) setSelectedCurrency(currency);
  };

  return (
    <div className={`relative ${className}`}>
      <Select value={selectedCurrency.code} onValueChange={handleChange} disabled={isLoading}>
        <SelectTrigger className="flex items-center justify-center px-2 py-2 rounded-lg border border-transparent transition-colors duration-300 text-gray-700 dark:text-gray-200 hover:text-icon-text-primary dark:hover:text-icon-text-primary h-10 min-w-[64px] gap-1 text-xs font-semibold">
          <span className="text-base leading-none">{selectedCurrency.symbol}</span>
          <span>{selectedCurrency.code}</span>
        </SelectTrigger>
        <SelectContent className="backdrop-blur-sm border border-secondary rounded-xl shadow-lg overflow-hidden">
          {DISPLAYED_CURRENCIES.map((currency) => (
            <SelectItem
              key={currency.code}
              value={currency.code}
              className={`flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 ${
                selectedCurrency.code === currency.code
                  ? 'bg-icon-text-primary/10 dark:bg-icon-text-primary/20 text-icon-text-primary dark:text-icon-text-primary'
                  : 'text-gray-700 dark:text-gray-200'
              }`}
            >
              <span className="text-base w-5 text-center">{currency.symbol}</span>
              <span className="text-sm font-medium">{currency.code}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{currency.name}</span>
              {selectedCurrency.code === currency.code && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto w-2 h-2 icon-text-primary rounded-full"
                />
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CurrencySelector;
