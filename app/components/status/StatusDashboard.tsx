'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, Bell, BellOff, Activity } from 'lucide-react'
import type { ServerStatus, MonitoredServer, PingResult, HistoryEntry, StatusCategory } from '@/app/types/status'
import ServerCard from './ServerCard'
import MultiLocationModal from './MultiLocationModal'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

const STORAGE_KEY_HISTORY = 'aspire_status_history'
const MAX_HISTORY = 90
const AUTO_REFRESH_INTERVAL = 60_000

function loadHistory(): Record<string, HistoryEntry[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveHistory(history: Record<string, HistoryEntry[]>) {
  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history))
  } catch {}
}

export default function StatusDashboard() {
  const [statuses, setStatuses] = useState<ServerStatus[]>([])
  const [categories, setCategories] = useState<StatusCategory[]>([])
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [multiCheckTarget, setMultiCheckTarget] = useState<{ id: string; url: string; name: string; type: 'http' | 'ip' } | null>(null)
  const [isLoadingServers, setIsLoadingServers] = useState(true)

  useEffect(() => {
    async function fetchServers() {
      setIsLoadingServers(true)
      try {
        const res = await fetch('/api/admin/status-servers')
        const data = await res.json()
        const servers: MonitoredServer[] = data.servers ?? []
        const cats: StatusCategory[] = data.categories ?? []
        const history = loadHistory()
        setCategories(cats)
        setStatuses(
          servers.map((s) => ({
            ...s,
            currentStatus: null,
            history: history[s.id] ?? [],
            isChecking: false,
          }))
        )
      } catch {
        setStatuses([])
      } finally {
        setIsLoadingServers(false)
      }
    }
    fetchServers()
  }, [])

  const checkServer = useCallback(async (serverId: string, url: string, type: 'http' | 'ip' = 'http') => {
    setStatuses((prev) =>
      prev.map((s) => (s.id === serverId ? { ...s, isChecking: true } : s))
    )

    let result: PingResult
    try {
      const res = await fetch('/api/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, type }),
      })
      const data = await res.json()
      result = {
        online: data.online ?? false,
        latencyMs: data.latencyMs ?? null,
        statusCode: data.statusCode ?? null,
        error: data.error,
        checkedAt: data.checkedAt ?? Date.now(),
      }
    } catch {
      result = { online: false, latencyMs: null, statusCode: null, error: 'Network error', checkedAt: Date.now() }
    }

    const historyEntry: HistoryEntry = {
      online: result.online,
      latencyMs: result.latencyMs,
      checkedAt: result.checkedAt,
    }

    setStatuses((prev) => {
      const next = prev.map((s) => {
        if (s.id !== serverId) return s
        const newHistory = [...s.history, historyEntry].slice(-MAX_HISTORY)
        return { ...s, currentStatus: result, history: newHistory, isChecking: false }
      })
      const historyMap: Record<string, HistoryEntry[]> = {}
      for (const s of next) historyMap[s.id] = s.history
      saveHistory(historyMap)
      return next
    })
  }, [])

  useEffect(() => {
    if (statuses.length === 0) return
    statuses.forEach((s) => checkServer(s.id, s.url, s.type ?? 'http'))
    if (!autoRefresh) return
    const interval = setInterval(() => {
      setStatuses((current) => {
        current.forEach((s) => checkServer(s.id, s.url, s.type ?? 'http'))
        return current
      })
    }, AUTO_REFRESH_INTERVAL)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statuses.map((s) => s.id).join(','), autoRefresh, checkServer])

  function refreshAll() {
    statuses.forEach((s) => checkServer(s.id, s.url, s.type ?? 'http'))
  }

  const anyChecking = statuses.some((s) => s.isChecking)
  const onlineCount = statuses.filter((s) => s.currentStatus?.online === true).length
  const offlineCount = statuses.filter((s) => s.currentStatus?.online === false).length

  // Group servers: categorised first (in category order), then uncategorised
  const categorisedGroups = categories.map((cat) => ({
    category: cat,
    servers: statuses.filter((s) => s.categoryId === cat.id),
  })).filter((g) => g.servers.length > 0)

  const uncategorised = statuses.filter(
    (s) => !s.categoryId || !categories.find((c) => c.id === s.categoryId)
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0b0f] transition-colors duration-300">
      <Navbar />

      {/* Hero section */}
      <section className="pt-24 pb-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-4"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border border-secondary card-primary icon-text-primary">
              <Activity className="w-3.5 h-3.5" />
              System Status
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white text-center mb-2"
          >
            Service Health
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 dark:text-gray-400 text-center text-sm mb-6"
          >
            Real-time monitoring across all AspireHosting infrastructure
          </motion.p>

          {/* Overall status banner */}
          {!isLoadingServers && statuses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className={`max-w-xl mx-auto px-5 py-3.5 rounded-2xl border flex items-center gap-3 ${
                offlineCount > 0
                  ? 'border-red-500/30 bg-red-50 dark:bg-red-900/20'
                  : anyChecking
                  ? 'border-yellow-500/30 bg-yellow-50 dark:bg-yellow-900/20'
                  : 'border-green-500/30 bg-green-50 dark:bg-green-900/20'
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full flex-shrink-0 ${
                  offlineCount > 0 ? 'bg-red-500' : anyChecking ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'
                }`}
              />
              <p
                className={`text-sm font-semibold ${
                  offlineCount > 0
                    ? 'text-red-700 dark:text-red-400'
                    : anyChecking
                    ? 'text-yellow-700 dark:text-yellow-400'
                    : 'text-green-700 dark:text-green-400'
                }`}
              >
                {anyChecking && onlineCount === 0 && offlineCount === 0
                  ? 'Checking services…'
                  : offlineCount > 0
                  ? `${offlineCount} service${offlineCount > 1 ? 's' : ''} offline · ${onlineCount} online`
                  : `All ${onlineCount} services operational`}
              </p>
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => setAutoRefresh((v) => !v)}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    autoRefresh
                      ? 'border-green-500/30 text-green-600 dark:text-green-400'
                      : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                  }`}
                  title={autoRefresh ? 'Auto-refresh on' : 'Auto-refresh off'}
                >
                  {autoRefresh ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={refreshAll}
                  disabled={anyChecking}
                  className="p-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-white/10 transition-colors disabled:opacity-50"
                  title="Refresh all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${anyChecking ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Main content */}
      <section className="pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {isLoadingServers ? (
            <div className="text-center py-20 text-gray-400 dark:text-gray-500">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3" />
              <p className="text-sm">Loading services…</p>
            </div>
          ) : statuses.length === 0 ? (
            <div className="text-center py-20 text-gray-400 dark:text-gray-500">
              <Activity className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No services configured yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              {/* Categorised groups */}
              {categorisedGroups.map(({ category, servers }, groupIdx) => {
                const groupOnline = servers.filter((s) => s.currentStatus?.online === true).length
                const groupOffline = servers.filter((s) => s.currentStatus?.online === false).length
                const groupChecking = servers.some((s) => s.isChecking)

                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: groupIdx * 0.06 }}
                  >
                    {/* Category header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-base font-bold text-gray-900 dark:text-white">{category.name}</h2>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              groupChecking
                                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                : groupOffline > 0
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            }`}
                          >
                            {groupChecking && groupOnline === 0 && groupOffline === 0
                              ? 'Checking'
                              : groupOffline > 0
                              ? `${groupOffline} offline`
                              : `${groupOnline} operational`}
                          </span>
                        </div>
                        {category.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{category.description}</p>
                        )}
                      </div>
                      <div className="flex-1 h-px bg-gray-200 dark:bg-white/10 ml-2" />
                    </div>

                    {/* Servers grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <AnimatePresence mode="popLayout">
                        {servers.map((server) => (
                          <ServerCard
                            key={server.id}
                            server={server}
                            onMultiCheck={() =>
                              setMultiCheckTarget({ id: server.id, url: server.url, name: server.name, type: server.type ?? 'http' })
                            }
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )
              })}

              {/* Uncategorised servers */}
              {uncategorised.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: categorisedGroups.length * 0.06 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-base font-bold text-gray-900 dark:text-white">Other</h2>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnimatePresence mode="popLayout">
                      {uncategorised.map((server) => (
                        <ServerCard
                          key={server.id}
                          server={server}
                          onMultiCheck={() =>
                            setMultiCheckTarget({ id: server.id, url: server.url, name: server.name, type: server.type ?? 'http' })
                          }
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Last updated */}
          {!isLoadingServers && statuses.length > 0 && (
            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-10">
              Updates every 60 seconds · {new Date().toLocaleDateString(undefined, { dateStyle: 'medium' })}
            </p>
          )}
        </div>
      </section>

      <Footer />

      <MultiLocationModal
        isOpen={multiCheckTarget !== null}
        onClose={() => setMultiCheckTarget(null)}
        host={multiCheckTarget?.url ?? ''}
        serverName={multiCheckTarget?.name ?? ''}
        type={multiCheckTarget?.type ?? 'http'}
      />
    </div>
  )
}
