export interface InfraFilterOption {
  id: string
  name: string
}

export interface InfraFilters {
  hardwareTypes: InfraFilterOption[]
  other: InfraFilterOption[]
}

export interface InfraNode {
  tier: string
  nodeType: 'game' | 'vps' | 'web' | 'bot'
  ownedHardware?: boolean
  waterCooled?: boolean
  comingSoon?: boolean
  cpu: string
  ram: string
  storage: string
  bandwidth: string
}

export interface InfraLocation {
  id: string
  name: string
  nodes: InfraNode[]
}

export interface InfrastructureConfig {
  filters: InfraFilters
  locations: InfraLocation[]
}
