'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Loader2, RefreshCw, CheckCircle, XCircle, HelpCircle } from 'lucide-react'
import type { MultiCheckResult, MultiLocationNode } from '@/app/types/status'

interface MultiLocationModalProps {
  isOpen: boolean
  onClose: () => void
  host: string
  serverName: string
  type?: 'http' | 'ip'
}

function NodeRow({ node }: { node: MultiLocationNode }) {
  const icon =
    node.online === null ? (
      <HelpCircle className="w-4 h-4 text-gray-400" />
    ) : node.online ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    )

  const latencyColor =
    node.latencyMs === null
      ? 'text-gray-400 dark:text-gray-500'
      : node.latencyMs < 200
      ? 'text-green-500'
      : node.latencyMs < 500
      ? 'text-yellow-500'
      : 'text-red-500'

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-secondary last:border-0">
      {icon}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {node.city}
          </span>
          {node.country && (
            <span className="text-xs text-gray-500 dark:text-gray-400">{node.country}</span>
          )}
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{node.statusText}</p>
      </div>
      {node.latencyMs !== null && (
        <span className={`text-xs font-semibold tabular-nums ${latencyColor}`}>
          {node.latencyMs}ms
        </span>
      )}
    </div>
  )
}

export default function MultiLocationModal({ isOpen, onClose, host, serverName, type = 'http' }: MultiLocationModalProps) {
  const [result, setResult] = useState<MultiCheckResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function runCheck() {
    if (!host) return
    setIsLoading(true)
    setError(null)
    setResult(null)
    try {
      // Extract hostname from URL
      let hostname = host
      try {
        const u = host.startsWith('http') ? host : `https://${host}`
        hostname = new URL(u).hostname
      } catch {
        hostname = host
      }

      const res = await fetch(`/api/status/multicheck?host=${encodeURIComponent(hostname)}&type=${type}`)
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || `HTTP ${res.status}`)
      }
      const data: MultiCheckResult = await res.json()
      setResult(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Check failed')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && host) {
      runCheck()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, host])

  function handleClose() {
    onClose()
  }

  const onlineCount = result?.nodes.filter((n) => n.online === true).length ?? 0
  const totalCount = result?.nodes.length ?? 0

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="pointer-events-auto w-full max-w-md card-primary rounded-2xl border border-secondary shadow-2xl p-6 max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-lg card-primary border border-secondary flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 icon-text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                      {serverName}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{host}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!isLoading && (
                    <button
                      onClick={runCheck}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400 hover:text-icon-text-primary"
                      title="Re-check"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={handleClose}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Summary bar */}
              {result && (
                <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-secondary flex-shrink-0">
                  <div className="text-sm">
                    <span className="font-semibold text-green-500">{onlineCount}</span>
                    <span className="text-gray-500 dark:text-gray-400"> / {totalCount} nodes online</span>
                  </div>
                  <div className="ml-auto text-xs text-gray-400 dark:text-gray-500">
                    {new Date(result.checkedAt).toLocaleTimeString()}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="overflow-y-auto flex-1 -mx-1 px-1">
                {isLoading && (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Checking from global nodes…
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">This takes ~8 seconds</p>
                  </div>
                )}

                {error && !isLoading && (
                  <div className="flex flex-col items-center justify-center py-12 gap-2">
                    <XCircle className="w-6 h-6 text-red-500" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">{error}</p>
                    <button
                      onClick={runCheck}
                      className="mt-2 text-xs text-icon-text-primary hover:underline"
                    >
                      Try again
                    </button>
                  </div>
                )}

                {result && !isLoading && (
                  <div>
                    {result.nodes.map((node) => (
                      <NodeRow key={node.nodeId} node={node} />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
