'use client'

import { motion } from 'framer-motion'
import { Globe, Trash2, MapPin, RefreshCw, Network } from 'lucide-react'
import type { ServerStatus } from '@/app/types/status'

interface ServerCardProps {
  server: ServerStatus
  onRemove?: () => void
  onMultiCheck: () => void
}

function latencyColor(ms: number | null) {
  if (ms === null) return 'text-gray-400 dark:text-gray-500'
  if (ms < 200) return 'text-green-500'
  if (ms < 500) return 'text-yellow-500'
  return 'text-red-500'
}

function uptimePercent(history: ServerStatus['history']) {
  if (history.length === 0) return null
  const online = history.filter((h) => h.online).length
  return Math.round((online / history.length) * 100)
}

export default function ServerCard({ server, onRemove, onMultiCheck }: ServerCardProps) {
  const { currentStatus, history, isChecking } = server
  const isIp = server.type === 'ip'

  const last24 = history.slice(-24)
  const uptime = uptimePercent(history)
  const isOnline = currentStatus?.online ?? null

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="card-primary rounded-xl border border-secondary p-4 flex flex-col gap-3"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
              isChecking
                ? 'bg-yellow-400 animate-pulse'
                : isOnline === null
                ? 'bg-gray-400 dark:bg-gray-600'
                : isOnline
                ? 'bg-green-500'
                : 'bg-red-500'
            }`}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{server.name}</h3>
              {isIp && (
                <span className="flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-medium">
                  IPv4
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
              {isIp
                ? <Network className="w-3 h-3 flex-shrink-0" />
                : <Globe className="w-3 h-3 flex-shrink-0" />}
              {server.url}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={onMultiCheck}
            title="Check from multiple locations"
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400 hover:text-icon-text-primary"
          >
            <MapPin className="w-4 h-4" />
          </button>
          {!server.isPreset && onRemove && (
            <button
              onClick={onRemove}
              title="Remove server"
              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-gray-500 dark:text-gray-400 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-xs">
        <div>
          <span className="text-gray-500 dark:text-gray-400">Status </span>
          <span
            className={`font-semibold ${
              isChecking
                ? 'text-yellow-500'
                : isOnline === null
                ? 'text-gray-400 dark:text-gray-500'
                : isOnline
                ? 'text-green-500'
                : 'text-red-500'
            }`}
          >
            {isChecking ? 'Checking…' : isOnline === null ? 'Unknown' : isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        {currentStatus?.latencyMs != null && (
          <div>
            <span className="text-gray-500 dark:text-gray-400">Latency </span>
            <span className={`font-semibold ${latencyColor(currentStatus.latencyMs)}`}>
              {currentStatus.latencyMs}ms
            </span>
          </div>
        )}

        {uptime !== null && (
          <div>
            <span className="text-gray-500 dark:text-gray-400">Uptime </span>
            <span
              className={`font-semibold ${
                uptime >= 90 ? 'text-green-500' : uptime >= 70 ? 'text-yellow-500' : 'text-red-500'
              }`}
            >
              {uptime}%
            </span>
          </div>
        )}

        {isChecking && (
          <RefreshCw className="w-3 h-3 text-gray-400 animate-spin ml-auto" />
        )}
      </div>

      {/* Uptime bar */}
      {last24.length > 0 && (
        <div>
          <div className="flex gap-0.5">
            {Array.from({ length: 24 }, (_, i) => {
              const entry = last24[last24.length - 24 + i]
              if (!entry) {
                return (
                  <div key={i} className="flex-1 h-6 rounded-sm bg-gray-200 dark:bg-gray-700" title="No data" />
                )
              }
              return (
                <div
                  key={i}
                  className={`flex-1 h-6 rounded-sm transition-colors ${
                    entry.online ? 'bg-green-500 hover:bg-green-400' : 'bg-red-500 hover:bg-red-400'
                  }`}
                  title={`${entry.online ? 'Online' : 'Offline'}${entry.latencyMs ? ` · ${entry.latencyMs}ms` : ''} · ${new Date(entry.checkedAt).toLocaleTimeString()}`}
                />
              )
            })}
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
            <span>24 checks ago</span>
            <span>Now</span>
          </div>
        </div>
      )}
    </motion.div>
  )
}
