export interface VPSPlan {
  id: string
  name: string
  badge?: string
  image: string
  cpu: string
  cpuDetail: string
  speed: string
  ram: string
  ramDetail: string
  storage: string
  storageDetail: string
  bandwidth?: string
  bandwidthDetail?: string
  price: string
  originalPrice?: string
  period: string
  orderLink: string
  comingSoon?: boolean
  // Optional list of location ids where this plan is available. If omitted, plan is shown for all locations.
  locations?: string[]
  // Location-specific order links. If provided, overrides the default orderLink for specific locations.
  locationOrderLinks?: {
    [locationId: string]: string
  }
  // Location-specific comingSoon override. If true for a location, the plan shows as Coming Soon there.
  locationComingSoon?: {
    [locationId: string]: boolean
  }
}

export interface VPSPlanType {
  id: string
  name: string
  displayName: string
  image: string
}

export interface VPSLocation {
  id: string
  name: string
  flag: string
  displayName: string
  availableCpus: string[]
}



export interface VPSConfig {
  planTypes: VPSPlanType[]
  locations: VPSLocation[]
  plans: {
    [key: string]: VPSPlan[]
  }
}
