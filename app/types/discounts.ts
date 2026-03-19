export interface PlanDiscount {
  percentage: number
  description: string
}

export interface DiscountConfig {
  enabled: boolean
  discountType: "recurring" | "one-time"
  budget: PlanDiscount
  premium: PlanDiscount
  validFrom: string
  validUntil: string
}

export interface GlobalDiscountSettings {
  showDiscountBadge: boolean
  badgeColor: string
  badgeText: string
  currencySymbol: string
  roundToNearest: number
}

export interface DiscountsConfig {
  discounts: {
    [productType: string]: DiscountConfig
  }
  globalSettings: GlobalDiscountSettings
}

export interface CalculatedDiscount {
  originalPrice: string
  discountedPrice: string
  discountPercentage: number
  savings: string
  isDiscounted: boolean
  discountType?: "recurring" | "one-time"
}
