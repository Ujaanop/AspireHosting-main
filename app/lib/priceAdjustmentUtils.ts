import priceAdjustmentConfig from "../config/priceAdjustments.json"
import type { PriceAdjustmentsConfig, CalculatedAdjustment } from "../types/priceAdjustments"

const config = priceAdjustmentConfig as PriceAdjustmentsConfig

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
  // Round to 2 decimal places and format
  const rounded = Math.round(amount * 100) / 100
  return `${currencySymbol}${rounded.toFixed(2)}`
}

/**
 * Round to nearest specified decimal place
 */
function roundToNearest(value: number, nearest: number): number {
  return Math.round(value / nearest) * nearest
}

/**
 * Calculate price adjustment for a given product type and base price
 * The input price is treated as the BASE price, and we calculate the adjusted price
 * @param productType - The product type (vps, games, discord, webhosting, dedicated)
 * @param basePrice - The base price (string or number)
 * @param currency - Optional currency symbol override
 * @param planType - Optional plan type ("budget" | "premium"). Defaults to "budget" if not provided
 */
export function calculatePriceAdjustment(
  productType: string,
  basePrice: string | number,
  currency?: string,
  planType?: "budget" | "premium"
): CalculatedAdjustment {
  const productAdjustment = config.adjustments[productType]
  
  if (!productAdjustment || !productAdjustment.enabled) {
    return {
      originalPrice: typeof basePrice === 'string' ? basePrice : `$${basePrice}`,
      adjustedPrice: typeof basePrice === 'string' ? basePrice : `$${basePrice}`,
      adjustmentPercentage: 0,
      adjustmentAmount: '$0',
      isAdjusted: false
    }
  }

  // Check if adjustment is currently valid
  const now = new Date()
  const validFrom = new Date(productAdjustment.validFrom)
  const validUntil = new Date(productAdjustment.validUntil)
  
  if (now < validFrom || now > validUntil) {
    return {
      originalPrice: typeof basePrice === 'string' ? basePrice : `$${basePrice}`,
      adjustedPrice: typeof basePrice === 'string' ? basePrice : `$${basePrice}`,
      adjustmentPercentage: 0,
      adjustmentAmount: '$0',
      isAdjusted: false
    }
  }

  // Extract numeric value from base price string
  const numericBasePrice = extractNumericPrice(basePrice)
  
  // Determine plan type - default to budget if not specified
  const selectedPlanType = planType || "budget"
  
  // Get the appropriate adjustment based on plan type
  const planAdjustment = selectedPlanType === "premium" 
    ? productAdjustment.premium 
    : productAdjustment.budget
  
  const adjustmentPercentage = planAdjustment.percentage
  
  // Calculate adjusted price from base price
  // Positive percentage = increase, negative percentage = decrease
  const adjustedPrice = numericBasePrice * (1 + adjustmentPercentage / 100)
  const adjustmentAmount = adjustedPrice - numericBasePrice
  
  // Round to specified decimal places
  const roundedAdjusted = roundToNearest(adjustedPrice, config.globalSettings.roundToNearest)
  const roundedAdjustment = roundToNearest(adjustmentAmount, config.globalSettings.roundToNearest)
  
  // Format prices with currency
  const currencySymbol = currency || config.globalSettings.currencySymbol
  
  return {
    originalPrice: formatPrice(numericBasePrice, currencySymbol),
    adjustedPrice: formatPrice(roundedAdjusted, currencySymbol),
    adjustmentPercentage: Math.round(adjustmentPercentage),
    adjustmentAmount: formatPrice(roundedAdjustment, currencySymbol),
    isAdjusted: true
  }
}

/**
 * Check if price adjustment is currently valid
 */
export function isPriceAdjustmentValid(productType: string): boolean {
  const productAdjustment = config.adjustments[productType]
  
  if (!productAdjustment || !productAdjustment.enabled) {
    return false
  }
  
  const now = new Date()
  const validFrom = new Date(productAdjustment.validFrom)
  const validUntil = new Date(productAdjustment.validUntil)
  
  return now >= validFrom && now <= validUntil
}

/**
 * Get price adjustment configuration for a product type
 */
export function getPriceAdjustmentConfig(productType: string) {
  return config.adjustments[productType] || null
}

/**
 * Get global adjustment settings
 */
export function getGlobalAdjustmentSettings() {
  return config.globalSettings
}

/**
 * Get all active price adjustments
 */
export function getActivePriceAdjustments() {
  return Object.entries(config.adjustments)
    .filter(([_, adjustment]) => adjustment.enabled && isPriceAdjustmentValid(_))
    .reduce((acc, [key, value]) => {
      acc[key] = value
      return acc
    }, {} as Record<string, any>)
}

/**
 * Calculate price adjustment for VPS plans
 */
export function calculateVPSPriceAdjustment(price: string, planType?: "budget" | "premium"): CalculatedAdjustment {
  return calculatePriceAdjustment('vps', price, undefined, planType)
}

/**
 * Calculate price adjustment for Web Hosting plans
 */
export function calculateWebHostingPriceAdjustment(price: string, planType?: "budget" | "premium"): CalculatedAdjustment {
  return calculatePriceAdjustment('webhosting', price, '£', planType)
}

/**
 * Calculate price adjustment for Discord plans
 */
export function calculateDiscordPriceAdjustment(price: string, planType?: "budget" | "premium"): CalculatedAdjustment {
  return calculatePriceAdjustment('discord', price, undefined, planType)
}

/**
 * Calculate price adjustment for Game Server plans
 */
export function calculateGamesPriceAdjustment(price: number, planType?: "budget" | "premium"): CalculatedAdjustment {
  return calculatePriceAdjustment('games', price, undefined, planType)
}

