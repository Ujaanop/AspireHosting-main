'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Wrench, AlertTriangle, AlertCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react'

interface MaintenanceWindow {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  affectedServices: string[]
  type: 'maintenance' | 'outage' | 'partial_outage'
  status: 'scheduled' | 'active' | 'completed'
}

const TYPE_CONFIG = {
  maintenance: {
    icon: Wrench,
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-800/60',
    dot: 'bg-amber-400',
    badge: 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300',
    title: 'text-amber-900 dark:text-amber-100',
    text: 'text-amber-700 dark:text-amber-300',
    label: 'Maintenance',
    pulse: 'bg-amber-400',
  },
  outage: {
    icon: AlertTriangle,
    bg: 'bg-red-50 dark:bg-red-950/40',
    border: 'border-red-200 dark:border-red-800/60',
    dot: 'bg-red-500',
    badge: 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300',
    title: 'text-red-900 dark:text-red-100',
    text: 'text-red-700 dark:text-red-300',
    label: 'Outage',
    pulse: 'bg-red-500',
  },
  partial_outage: {
    icon: AlertCircle,
    bg: 'bg-orange-50 dark:bg-orange-950/40',
    border: 'border-orange-200 dark:border-orange-800/60',
    dot: 'bg-orange-400',
    badge: 'bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300',
    title: 'text-orange-900 dark:text-orange-100',
    text: 'text-orange-700 dark:text-orange-300',
    label: 'Partial Outage',
    pulse: 'bg-orange-400',
  },
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function MaintenancePopup() {
  const [activeWindows, setActiveWindows] = useState<MaintenanceWindow[]>([])
  const [dismissed, setDismissed] = useState<string[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)

  const fetchWindows = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/maintenance')
      if (!res.ok) return
      const data = await res.json()
      const active = (data.windows ?? []).filter(
        (w: MaintenanceWindow) => w.status === 'active' || w.status === 'scheduled'
      )
      setActiveWindows(active)
    } catch { /* silent */ }
  }, [])

  useEffect(() => {
    // Load dismissed ids from sessionStorage
    try {
      const stored = JSON.parse(sessionStorage.getItem('dismissed_maintenance') ?? '[]')
      setDismissed(stored)
    } catch { /* ignore */ }

    fetchWindows()
    const interval = setInterval(fetchWindows, 60_000) // refresh every minute
    return () => clearInterval(interval)
  }, [fetchWindows])

  const dismiss = useCallback((id: string) => {
    setDismissed(prev => {
      const next = [...prev, id]
      try { sessionStorage.setItem('dismissed_maintenance', JSON.stringify(next)) } catch { /* ignore */ }
      return next
    })
  }, [])

  const visible = activeWindows.filter(w => !dismissed.includes(w.id))
  if (visible.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[9998] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {visible.map((win) => {
          const cfg = TYPE_CONFIG[win.type] ?? TYPE_CONFIG.maintenance
          const Icon = cfg.icon
          const isExpanded = expanded === win.id

          return (
            <motion.div
              key={win.id}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20, stiffness: 260 }}
              className={`pointer-events-auto rounded-xl border shadow-lg backdrop-blur-sm ${cfg.bg} ${cfg.border}`}
            >
              {/* Header */}
              <div className="flex items-start gap-3 p-4">
                <div className="relative flex-shrink-0 mt-0.5">
                  <span className={`absolute inset-0 rounded-full ${cfg.pulse} animate-ping opacity-40`} />
                  <div className={`relative w-8 h-8 rounded-full ${cfg.badge} flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className={`text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${cfg.badge}`}>
                      {cfg.label}
                    </span>
                    {win.status === 'scheduled' && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Upcoming
                      </span>
                    )}
                  </div>
                  <p className={`text-sm font-semibold leading-snug ${cfg.title}`}>{win.title}</p>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => setExpanded(isExpanded ? null : win.id)}
                    className={`p-1 rounded-lg transition-colors ${cfg.text} hover:opacity-70`}
                    aria-label="Toggle details"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => dismiss(win.id)}
                    className={`p-1 rounded-lg transition-colors ${cfg.text} hover:opacity-70`}
                    aria-label="Dismiss"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Expandable details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className={`px-4 pb-4 border-t ${cfg.border} pt-3 space-y-2`}>
                      {win.description && (
                        <p className={`text-xs leading-relaxed ${cfg.text}`}>{win.description}</p>
                      )}
                      <div className={`text-xs ${cfg.text} space-y-1`}>
                        <div className="flex gap-1">
                          <span className="font-medium">Start:</span>
                          <span>{formatTime(win.startTime)}</span>
                        </div>
                        <div className="flex gap-1">
                          <span className="font-medium">End:</span>
                          <span>{formatTime(win.endTime)}</span>
                        </div>
                        {win.affectedServices.length > 0 && (
                          <div>
                            <span className="font-medium">Affected: </span>
                            <span>{win.affectedServices.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
