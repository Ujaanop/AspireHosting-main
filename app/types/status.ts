export interface StatusCategory {
  id: string
  name: string
  description?: string
}

export interface MonitoredServer {
  id: string
  name: string
  url: string
  type: 'http' | 'ip'
  isPreset: boolean
  addedAt: number
  categoryId?: string
}

export interface PingResult {
  online: boolean
  latencyMs: number | null
  statusCode: number | null
  error?: string
  checkedAt: number
}

export interface HistoryEntry {
  online: boolean
  latencyMs: number | null
  checkedAt: number
}

export interface ServerStatus extends MonitoredServer {
  currentStatus: PingResult | null
  history: HistoryEntry[]
  isChecking: boolean
}

export interface MultiLocationNode {
  nodeId: string
  city: string
  country: string
  countryCode: string
  ips: string[]
  online: boolean | null
  latencyMs: number | null
  statusText: string
}

export interface MultiCheckResult {
  host: string
  nodes: MultiLocationNode[]
  checkedAt: number
}
