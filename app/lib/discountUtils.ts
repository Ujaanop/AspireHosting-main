import discountConfig from "../config/discounts.json"
import type { DiscountsConfig, CalculatedDiscount } from "../types/discounts"

const config = discountConfig as DiscountsConfig

/**
 * Calculate discount for a given product type and price
 * The input price is treated as the ORIGINAL price, and we calculate the discounted price
 * @param productType - The product type (vps, games, discord, webhosting, dedicated)
 * @param originalPrice - The original price (string or number)
 * @param currency - Optional currency symbol override
 * @param planType - Optional plan type ("budget" | "premium"). Defaults to "budget" if not provided
 */
export function calculateDiscount(
  productType: string,
  originalPrice: string | number,
  currency?: string,
  planType?: "budget" | "premium"
): CalculatedDiscount {
  const productDiscount = config.discounts[productType]
  
  if (!productDiscount || !productDiscount.enabled) {
    return {
      originalPrice: typeof originalPrice === 'string' ? originalPrice : `$${originalPrice}`,
      discountedPrice: typeof originalPrice === 'string' ? originalPrice : `$${originalPrice}`,
      discountPercentage: 0,
      savings: '$0',
      isDiscounted: false
    }
  }

  // Extract numeric value from original price string
  const numericOriginalPrice = extractNumericPrice(originalPrice)
  
  // Determine plan type - default to budget if not specified
  const selectedPlanType = planType || "budget"
  
  // Get the appropriate discount based on plan type
  const planDiscount = selectedPlanType === "premium" 
    ? productDiscount.premium 
    : productDiscount.budget
  
  const discountPercentage = planDiscount.percentage
  
  // Calculate discounted price from original price
  const discountedPrice = numericOriginalPrice * (1 - discountPercentage / 100)
  const savings = numericOriginalPrice - discountedPrice
  
  // Round to specified decimal places
  const roundedDiscounted = roundToNearest(discountedPrice, config.globalSettings.roundToNearest)
  const roundedSavings = roundToNearest(savings, config.globalSettings.roundToNearest)
  
  // Format prices with currency
  const currencySymbol = currency || config.globalSettings.currencySymbol
  
  return {
    originalPrice: formatPrice(numericOriginalPrice, currencySymbol),
    discountedPrice: formatPrice(roundedDiscounted, currencySymbol),
    discountPercentage: Math.round(discountPercentage),
    savings: formatPrice(roundedSavings, currencySymbol),
    isDiscounted: true,
    discountType: productDiscount.discountType
  }
}

/**
 * Extract numeric value from price string (handles $, £, €, etc.)
 */
function extractNumericPrice(price: string | number): number {
  if (typeof price === 'number') {
    return price
  }
  
  // Remove currency symbols and extract number
  const numericString = price.replace(/[^\d.,]/g, '')
  const normalizedString = numericString.replace(',', '.')
  
  return parseFloat(normalizedString) || 0
}

/**
 * Format price with currency symbol
 */
function formatPrice(amount: number, currencySymbol: string): string {
  return `${currencySymbol}${amount.toFixed(2)}`
}

/**
 * Round to nearest specified decimal place
 */
function roundToNearest(value: number, nearest: number): number {
  return Math.round(value / nearest) * nearest
}

/**
 * Check if discount is currently valid
 */
export function isDiscountValid(productType: string): boolean {
  const productDiscount = config.discounts[productType]
  
  if (!productDiscount || !productDiscount.enabled) {
    return false
  }
  
  const now = new Date()
  const validFrom = new Date(productDiscount.validFrom)
  const validUntil = new Date(productDiscount.validUntil)
  
  return now >= validFrom && now <= validUntil
}

/**
 * Get discount configuration for a product type
 */
export function getDiscountConfig(productType: string) {
  return config.discounts[productType] || null
}

/**
 * Get global discount settings
 */
export function getGlobalDiscountSettings() {
  return config.globalSettings
}

/**
 * Get all active discounts
 */
export function getActiveDiscounts() {
  return Object.entries(config.discounts)
    .filter(([_, discount]) => discount.enabled && isDiscountValid(_))
    .reduce((acc, [key, value]) => {
      acc[key] = value
      return acc
    }, {} as Record<string, any>)
}

/**
 * Calculate discount for VPS plans
 */
export function calculateVPSDiscount(price: string, planType?: "budget" | "premium"): CalculatedDiscount {
  return calculateDiscount('vps', price, undefined, planType)
}

/**
 * Calculate discount for Web Hosting plans
 */
export function calculateWebHostingDiscount(price: string, planType?: "budget" | "premium"): CalculatedDiscount {
  return calculateDiscount('webhosting', price, '£', planType)
}

/**
 * Calculate discount for Discord plans
 */
export function calculateDiscordDiscount(price: string, planType?: "budget" | "premium"): CalculatedDiscount {
  return calculateDiscount('discord', price, undefined, planType)
}

/**
 * Calculate discount for Game Server plans
 */
export function calculateGamesDiscount(price: number, planType?: "budget" | "premium"): CalculatedDiscount {
  return calculateDiscount('games', price, undefined, planType)
}
