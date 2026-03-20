'use client'

import { useEffect, useState } from 'react'

interface MaintenanceWindow {
  id: string
  title: string
  type: 'maintenance' | 'outage' | 'partial_outage'
  status: 'scheduled' | 'active' | 'completed'
}

type SystemStatus = 'operational' | 'maintenance' | 'partial_outage' | 'outage'

const STATUS_CONFIG: Record<SystemStatus, { dot: string; text: string; label: string }> = {
  operational: {
    dot: 'bg-green-400',
    text: 'text-gray-600 dark:text-gray-400',
    label: 'All Systems Operational',
  },
  maintenance: {
    dot: 'bg-amber-400',
    text: 'text-amber-600 dark:text-amber-400',
    label: 'System Under Maintenance',
  },
  partial_outage: {
    dot: 'bg-orange-400',
    text: 'text-orange-600 dark:text-orange-400',
    label: 'Partial System Outage',
  },
  outage: {
    dot: 'bg-red-500',
    text: 'text-red-600 dark:text-red-400',
    label: 'System Outage Detected',
  },
}

export default function FooterStatus() {
  const [status, setStatus] = useState<SystemStatus>('operational')

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch('/api/admin/maintenance')
        if (!res.ok) return
        const data = await res.json()
        const active = (data.windows ?? []).filter(
          (w: MaintenanceWindow) => w.status === 'active'
        )
        if (active.some((w: MaintenanceWindow) => w.type === 'outage')) setStatus('outage')
        else if (active.some((w: MaintenanceWindow) => w.type === 'partial_outage')) setStatus('partial_outage')
        else if (active.length > 0) setStatus('maintenance')
        else setStatus('operational')
      } catch { /* keep operational */ }
    }
    check()
    const interval = setInterval(check, 60_000)
    return () => clearInterval(interval)
  }, [])

  const cfg = STATUS_CONFIG[status]

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-2 h-2 rounded-full animate-pulse ${cfg.dot}`} />
      <a href="/status" className={`text-sm transition-colors hover:underline ${cfg.text}`}>
        {cfg.label}
      </a>
    </div>
  )
}
