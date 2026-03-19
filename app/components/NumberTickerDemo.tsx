'use client'

import { NumberTicker } from "@/components/magicui/number-ticker";
import { motion } from "framer-motion";

export default function NumberTickerDemo() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 orbitron-font">
          NumberTicker Theme Variants
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          All colors automatically adapt to your theme changes
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Primary Variant */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-6 bg-white dark:bg-gray-950/20 backdrop-blur-xl rounded-lg shadow-lg border border-secondary hover:border-primary transition-all duration-300"
        >
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Primary</h3>
          <NumberTicker 
            value={1000} 
            startValue={0} 
            className="whitespace-pre-wrap text-4xl font-medium tracking-tighter" 
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Uses --ticker-primary</p>
        </motion.div>

        {/* Secondary Variant */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-6 bg-white dark:bg-gray-950/20 backdrop-blur-xl rounded-lg shadow-lg border border-secondary hover:border-primary transition-all duration-300"
        >
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Secondary</h3>
          <NumberTicker 
            value={500} 
            startValue={0} 
            className="whitespace-pre-wrap text-4xl font-medium tracking-tighter" 
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Uses --ticker-secondary</p>
        </motion.div>

        {/* Accent Variant */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="p-6 bg-white dark:bg-gray-950/20 backdrop-blur-xl rounded-lg shadow-lg border border-secondary hover:border-primary transition-all duration-300"
        >
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Accent</h3>
          <NumberTicker 
            value={750} 
            startValue={0} 
            className="whitespace-pre-wrap text-4xl font-medium tracking-tighter" 
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Uses --ticker-accent</p>
        </motion.div>

        {/* Success Variant */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="p-6 bg-white dark:bg-gray-950/20 backdrop-blur-xl rounded-lg shadow-lg border border-secondary hover:border-primary transition-all duration-300"
        >
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Success</h3>
          <div className="whitespace-pre-wrap text-4xl font-medium tracking-tighter">
            <NumberTicker 
              value={99.9} 
              decimalPlaces={1}
              startValue={0} 
              className="inline" 
            />
            <span className="inline">%</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Uses --ticker-success</p>
        </motion.div>

        {/* Warning Variant */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="p-6 bg-white dark:bg-gray-950/20 backdrop-blur-xl rounded-lg shadow-lg border border-secondary hover:border-primary transition-all duration-300"
        >
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Warning</h3>
          <NumberTicker 
            value={85} 
            startValue={0} 
            className="whitespace-pre-wrap text-4xl font-medium tracking-tighter" 
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Uses --ticker-warning</p>
        </motion.div>

        {/* Error Variant */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="p-6 bg-white dark:bg-gray-950/20 backdrop-blur-xl rounded-lg shadow-lg border border-secondary hover:border-primary transition-all duration-300"
        >
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Error</h3>
          <NumberTicker 
            value={5} 
            startValue={0} 
            className="whitespace-pre-wrap text-4xl font-medium tracking-tighter" 
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Uses --ticker-error</p>
        </motion.div>

        {/* Custom Variant */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="p-6 bg-white dark:bg-gray-950/20 backdrop-blur-xl rounded-lg shadow-lg border border-secondary hover:border-primary transition-all duration-300"
        >
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Custom</h3>
          <NumberTicker 
            value={42} 
            startValue={0} 
            className="whitespace-pre-wrap text-4xl font-medium tracking-tighter" 
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Custom purple color</p>
        </motion.div>

        {/* Gradient Example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="p-6 bg-white dark:bg-gray-950/20 backdrop-blur-xl rounded-lg shadow-lg border border-secondary hover:border-primary transition-all duration-300"
        >
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Gradient</h3>
          <div className="text-4xl font-medium tracking-tighter bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            <NumberTicker 
              value={2024} 
              startValue={2000} 
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent" 
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Gradient text effect</p>
        </motion.div>

        {/* With Prefix/Suffix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="p-6 bg-white dark:bg-gray-950/20 backdrop-blur-xl rounded-lg shadow-lg border border-secondary hover:border-primary transition-all duration-300"
        >
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">With Prefix/Suffix</h3>
          <div className="whitespace-pre-wrap text-4xl font-medium tracking-tighter">
            <span className="inline">$</span>
            <NumberTicker 
              value={1500} 
              startValue={0} 
              className="inline" 
            />
            <span className="inline">K</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Revenue example</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
        className="mt-12 p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800"
      >
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
          How to Use Theme-Based NumberTicker
        </h3>
        <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
          <p><strong>Available Variants:</strong> primary, secondary, accent, success, warning, error, custom</p>
          <p><strong>Theme Integration:</strong> Colors automatically change when users switch themes</p>
          <p><strong>Custom Colors:</strong> Use variant="custom" with customColor prop for specific colors</p>
          <p><strong>CSS Variables:</strong> Modify --ticker-* variables in globals.css to change theme colors</p>
        </div>
      </motion.div>
    </div>
  );
}

