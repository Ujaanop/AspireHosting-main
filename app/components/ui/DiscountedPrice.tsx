"use client"

import React from "react"
import { motion } from "framer-motion"
import { calculateDiscount, getGlobalDiscountSettings } from "../../lib/discountUtils"
import { calculatePriceAdjustment } from "../../lib/priceAdjustmentUtils"
import { useCurrency } from "../../contexts/CurrencyContext"
import type { CalculatedDiscount } from "../../types/discounts"

interface DiscountedPriceProps {
  productType: string
  price: string | number
  period?: string
  className?: string
  showPercentage?: boolean
  size?: "sm" | "md" | "lg" | "xl"
  color?: string
  currency?: string
  planType?: "budget" | "premium"
  showDiscountType?: boolean
}

interface DiscountedPriceDisplayProps {
  originalPrice: string
  discountedPrice: string
  discountPercentage: number
  period?: string
  className?: string
  showPercentage?: boolean
  size?: "sm" | "md" | "lg" | "xl"
  color?: string
  discountType?: "recurring" | "one-time"
  showDiscountType?: boolean
}

// Main component that calculates discounts automatically
export function DiscountedPrice({
  productType,
  price,
  period = "/mo",
  className = "",
  showPercentage = true,
  size = "lg",
  color = "text-red-500",
  currency,
  planType,
  showDiscountType = false
}: DiscountedPriceProps) {
  const { convertPrice, selectedCurrency, exchangeRates } = useCurrency()
  
  // Extract numeric price from input (handles strings like "$5.99" or numbers)
  const extractNumeric = (val: string | number): number => {
    if (typeof val === 'number') return val
    // Remove currency symbols including multi-character ones like C$ and A$
    let cleaned = val.toString()
      .replace(/C\$/g, '')  // Remove C$ first
      .replace(/A\$/g, '')  // Remove A$ first
      .replace(/[£$€¥₹]/g, '')  // Remove single character symbols
      .trim()
    return parseFloat(cleaned) || 0
  }
  
  // Convert numeric price to selected currency
  const convertNumericPrice = (numericPrice: number): number => {
    if (selectedCurrency.code === 'USD') return numericPrice
    if (!exchangeRates || !exchangeRates[selectedCurrency.code]) {
      console.warn(`Exchange rate not available for ${selectedCurrency.code}, using USD price`)
      return numericPrice
    }
    const converted = numericPrice * exchangeRates[selectedCurrency.code]
    console.log(`Converting ${numericPrice} USD to ${selectedCurrency.code}: ${converted} (rate: ${exchangeRates[selectedCurrency.code]})`)
    return converted
  }
  
  // Step 1: Extract base numeric price
  const baseNumericPrice = extractNumeric(price)
  
  // Step 2: Convert to selected currency FIRST
  const convertedBasePrice = convertNumericPrice(baseNumericPrice)
  
  // Step 3: Apply price adjustment to converted price (using numeric value)
  // Pass selected currency symbol so formatting is correct
  const priceAdjustment = calculatePriceAdjustment(productType, convertedBasePrice, selectedCurrency.symbol, planType)
  
  // Step 4: Extract numeric from adjusted price
  const adjustedNumericPrice = extractNumeric(priceAdjustment.isAdjusted ? priceAdjustment.adjustedPrice : convertedBasePrice)
  
  // Step 5: Apply discount to the adjusted price
  // Pass selected currency symbol so formatting is correct
  const discount = calculateDiscount(productType, adjustedNumericPrice, selectedCurrency.symbol, planType)
  
  const globalSettings = getGlobalDiscountSettings()
  
  // Use adjusted price as the "original" price for discount display
  const originalPriceForDisplay = priceAdjustment.isAdjusted 
    ? adjustedNumericPrice 
    : extractNumeric(discount.originalPrice)
  
  // Format prices with selected currency symbol
  const formatPrice = (amount: number): string => {
    if (selectedCurrency.code === "JPY") {
      return `${selectedCurrency.symbol}${Math.round(amount)}`
    }
    return `${selectedCurrency.symbol}${amount.toFixed(2)}`
  }
  
  return (
    <DiscountedPriceDisplay
      originalPrice={formatPrice(originalPriceForDisplay)}
      discountedPrice={formatPrice(extractNumeric(discount.discountedPrice))}
      discountPercentage={discount.discountPercentage}
      period={period}
      className={className}
      showPercentage={showPercentage && globalSettings.showDiscountBadge && discount.isDiscounted}
      size={size}
      color={color}
      discountType={discount.discountType}
      showDiscountType={showDiscountType}
    />
  )
}

// Display component for showing calculated discounts
export function DiscountedPriceDisplay({
  originalPrice,
  discountedPrice,
  discountPercentage,
  period = "/mo",
  className = "",
  showPercentage = true,
  size = "lg",
  color = "text-red-500",
  discountType,
  showDiscountType = false
}: DiscountedPriceDisplayProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl", 
    lg: "text-2xl",
    xl: "text-3xl"
  }

  const percentageSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-sm", 
    xl: "text-base"
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="flex items-baseline gap-2 mb-1">
        {/* Original Price - Crossed Out */}
        <span className={`${sizeClasses[size]} text-gray-400 dark:text-gray-500 line-through`}>
          {originalPrice}
        </span>
        
        {/* Discounted Price */}
        <span className={`${sizeClasses[size]} font-bold text-gray-900 dark:text-white`}>
          {discountedPrice}
        </span>
        
        {/* Period */}
        <span className="text-gray-500 dark:text-gray-400 text-sm">
          {period}
        </span>
      </div>
      
      {/* Discount Badge */}
      {showPercentage && discountPercentage > 0 && (
        <div className="flex flex-col items-center gap-1">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className={`inline-flex items-center px-2 py-1 rounded-full text-white font-medium ${percentageSizeClasses[size]} ${color.replace('text-', 'bg-')}`}
          >
            {discountPercentage}% off
          </motion.div>
          {showDiscountType && discountType && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {discountType === "recurring" ? "Recurring" : "One-time"}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// Horizontal layout variant
export function DiscountedPriceHorizontal({
  productType,
  price,
  period = "/mo",
  className = "",
  showPercentage = true,
  size = "lg",
  color = "text-red-500",
  currency,
  planType,
  showDiscountType = false
}: DiscountedPriceProps) {
  const { selectedCurrency, exchangeRates } = useCurrency()
  
  // Extract numeric price from input
  const extractNumeric = (val: string | number): number => {
    if (typeof val === 'number') return val
    return parseFloat(val.replace(/[£$€¥₹C\$A\$]/g, '')) || 0
  }
  
  // Convert numeric price to selected currency
  const convertNumericPrice = (numericPrice: number): number => {
    if (selectedCurrency.code === 'USD') return numericPrice
    if (!exchangeRates || !exchangeRates[selectedCurrency.code]) {
      console.warn(`Exchange rate not available for ${selectedCurrency.code}, using USD price`)
      return numericPrice
    }
    const converted = numericPrice * exchangeRates[selectedCurrency.code]
    console.log(`Converting ${numericPrice} USD to ${selectedCurrency.code}: ${converted} (rate: ${exchangeRates[selectedCurrency.code]})`)
    return converted
  }
  
  // Step 1: Extract base numeric price
  const baseNumericPrice = extractNumeric(price)
  
  // Step 2: Convert to selected currency FIRST
  const convertedBasePrice = convertNumericPrice(baseNumericPrice)
  
  // Step 3: Apply price adjustment to converted price
  // Pass selected currency symbol so formatting is correct
  const priceAdjustment = calculatePriceAdjustment(productType, convertedBasePrice, selectedCurrency.symbol, planType)
  
  // Step 4: Extract numeric from adjusted price
  const adjustedNumericPrice = extractNumeric(priceAdjustment.isAdjusted ? priceAdjustment.adjustedPrice : convertedBasePrice)
  
  // Step 5: Apply discount to the adjusted price
  // Pass selected currency symbol so formatting is correct
  const discount = calculateDiscount(productType, adjustedNumericPrice, selectedCurrency.symbol, planType)
  
  const globalSettings = getGlobalDiscountSettings()
  
  // Use adjusted price as the "original" price for discount display
  const originalPriceForDisplay = priceAdjustment.isAdjusted 
    ? adjustedNumericPrice 
    : extractNumeric(discount.originalPrice)
  
  // Format prices with selected currency symbol
  const formatPrice = (amount: number): string => {
    if (selectedCurrency.code === "JPY") {
      return `${selectedCurrency.symbol}${Math.round(amount)}`
    }
    return `${selectedCurrency.symbol}${amount.toFixed(2)}`
  }
  
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl", 
    xl: "text-3xl"
  }

  const percentageSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-sm",
    xl: "text-base"
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Original Price - Crossed Out */}
      <span className={`${sizeClasses[size]} text-gray-400 dark:text-gray-500 line-through`}>
        {formatPrice(originalPriceForDisplay)}
      </span>
      
      {/* Discounted Price */}
      <span className={`${sizeClasses[size]} font-bold text-gray-900 dark:text-white`}>
        {formatPrice(extractNumeric(discount.discountedPrice))}
      </span>
      
      {/* Period */}
      <span className="text-gray-500 dark:text-gray-400 text-sm">
        {period}
      </span>
      
      {/* Discount Badge */}
      {showPercentage && globalSettings.showDiscountBadge && discount.isDiscounted && (
        <div className="flex flex-col items-center gap-1">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className={`inline-flex items-center px-2 py-1 rounded-full text-white font-medium ${percentageSizeClasses[size]} ${color.replace('text-', 'bg-')}`}
          >
            {discount.discountPercentage}% off
          </motion.div>
          {showDiscountType && discount.discountType && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {discount.discountType === "recurring" ? "Recurring" : "One-time"}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// Compact version for smaller spaces
export function DiscountedPriceCompact({
  productType,
  price,
  period = "/mo",
  className = "",
  showPercentage = true,
  color = "text-red-500",
  currency,
  planType,
  showDiscountType = false
}: DiscountedPriceProps) {
  const { selectedCurrency, exchangeRates } = useCurrency()
  
  // Extract numeric price from input
  const extractNumeric = (val: string | number): number => {
    if (typeof val === 'number') return val
    return parseFloat(val.replace(/[£$€¥₹C\$A\$]/g, '')) || 0
  }
  
  // Convert numeric price to selected currency
  const convertNumericPrice = (numericPrice: number): number => {
    if (selectedCurrency.code === 'USD') return numericPrice
    if (!exchangeRates || !exchangeRates[selectedCurrency.code]) {
      console.warn(`Exchange rate not available for ${selectedCurrency.code}, using USD price`)
      return numericPrice
    }
    const converted = numericPrice * exchangeRates[selectedCurrency.code]
    console.log(`Converting ${numericPrice} USD to ${selectedCurrency.code}: ${converted} (rate: ${exchangeRates[selectedCurrency.code]})`)
    return converted
  }
  
  // Step 1: Extract base numeric price
  const baseNumericPrice = extractNumeric(price)
  
  // Step 2: Convert to selected currency FIRST
  const convertedBasePrice = convertNumericPrice(baseNumericPrice)
  
  // Step 3: Apply price adjustment to converted price
  // Pass selected currency symbol so formatting is correct
  const priceAdjustment = calculatePriceAdjustment(productType, convertedBasePrice, selectedCurrency.symbol, planType)
  
  // Step 4: Extract numeric from adjusted price
  const adjustedNumericPrice = extractNumeric(priceAdjustment.isAdjusted ? priceAdjustment.adjustedPrice : convertedBasePrice)
  
  // Step 5: Apply discount to the adjusted price
  // Pass selected currency symbol so formatting is correct
  const discount = calculateDiscount(productType, adjustedNumericPrice, selectedCurrency.symbol, planType)
  
  const globalSettings = getGlobalDiscountSettings()
  
  // Use adjusted price as the "original" price for discount display
  const originalPriceForDisplay = priceAdjustment.isAdjusted 
    ? adjustedNumericPrice 
    : extractNumeric(discount.originalPrice)
  
  // Format prices with selected currency symbol
  const formatPrice = (amount: number): string => {
    if (selectedCurrency.code === "JPY") {
      return `${selectedCurrency.symbol}${Math.round(amount)}`
    }
    return `${selectedCurrency.symbol}${amount.toFixed(2)}`
  }
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Original Price - Crossed Out */}
      <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
        {formatPrice(originalPriceForDisplay)}
      </span>
      
      {/* Discounted Price */}
      <span className="text-lg font-bold text-gray-900 dark:text-white">
        {formatPrice(extractNumeric(discount.discountedPrice))}
      </span>
      
      {/* Period */}
      <span className="text-gray-500 dark:text-gray-400 text-xs">
        {period}
      </span>
      
      {/* Discount Badge */}
      {showPercentage && globalSettings.showDiscountBadge && discount.isDiscounted && (
        <div className="flex flex-col items-center gap-0.5">
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className={`inline-flex items-center px-1.5 py-0.5 rounded text-white text-xs font-medium ${color.replace('text-', 'bg-')}`}
          >
            {discount.discountPercentage}% off
          </motion.span>
          {showDiscountType && discount.discountType && (
            <span className="text-[10px] text-gray-500 dark:text-gray-400">
              {discount.discountType === "recurring" ? "Recurring" : "One-time"}
            </span>
          )}
        </div>
      )}
    </div>
  )
}