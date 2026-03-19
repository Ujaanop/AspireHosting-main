export interface PlanAdjustment {
  percentage: number
  description: string
}

export interface PriceAdjustmentConfig {
  enabled: boolean
  budget: PlanAdjustment
  premium: PlanAdjustment
  validFrom: string
  validUntil: string
}

export interface GlobalAdjustmentSettings {
  currencySymbol: string
  roundToNearest: number
}

export interface PriceAdjustmentsConfig {
  adjustments: {
    [productType: string]: PriceAdjustmentConfig
  }
  globalSettings: GlobalAdjustmentSettings
}

export interface CalculatedAdjustment {
  originalPrice: string
  adjustedPrice: string
  adjustmentPercentage: number
  adjustmentAmount: string
  isAdjusted: boolean
}









