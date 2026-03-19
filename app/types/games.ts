export interface GamePlan {
  id: string
  name: string
  type: "budget" | "premium"
  ram: string
  cpu: string
  storage: string
  price: number
  originalPrice?: number
  orderLink: string
  comingSoon?: boolean
  // Optional list of location ids where this plan is available
  locations?: string[]
  // Per-location order link overrides
  locationOrderLinks?: {
    [locationId: string]: string
  }
  // Per-location coming soon override
  locationComingSoon?: {
    [locationId: string]: boolean
  }
}

export interface Game {
  id: string
  name: string
  description: string
  icon: string
  banner: string
  featured: boolean
  startingAt: string
  primaryColor: string
  plans: {
    budget: GamePlan[]
    premium: GamePlan[]
  }
}

export interface GameLocation {
  id: string
  name: string
  flag: string
  availablePlanTypes: string[]
}

export interface PlanType {
  id: string
  name: string
  image: string
}

export interface GamesConfig {
  planTypes: PlanType[]
  locations: GameLocation[]
  games: Game[]
}
