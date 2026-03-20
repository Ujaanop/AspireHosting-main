'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Globe } from 'lucide-react'

interface AddServerModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (name: string, url: string) => void
}

export default function AddServerModal({ isOpen, onClose, onAdd }: AddServerModalProps) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmedName = name.trim()
    const trimmedUrl = url.trim()

    if (!trimmedName) {
      setError('Please enter a display name.')
      return
    }
    if (!trimmedUrl) {
      setError('Please enter a URL or hostname.')
      return
    }

    // Basic URL validation
    try {
      const testUrl = trimmedUrl.startsWith('http') ? trimmedUrl : `https://${trimmedUrl}`
      new URL(testUrl)
    } catch {
      setError('Please enter a valid URL or hostname.')
      return
    }

    onAdd(trimmedName, trimmedUrl)
    setName('')
    setUrl('')
    setError('')
    onClose()
  }

  function handleClose() {
    setName('')
    setUrl('')
    setError('')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="pointer-events-auto w-full max-w-md card-primary rounded-2xl border border-secondary shadow-2xl p-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg card-primary border border-secondary flex items-center justify-center">
                    <Plus className="w-4 h-4 icon-text-primary" />
                  </div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">Add Server</h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError('') }}
                    placeholder="My Server"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-secondary bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-button-bg/50 transition-shadow"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    URL or Hostname
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => { setUrl(e.target.value); setError('') }}
                      placeholder="example.com or https://example.com"
                      className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-secondary bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-button-bg/50 transition-shadow"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-red-500">{error}</p>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 py-2 text-sm font-medium rounded-lg border border-secondary text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-sm font-medium rounded-lg button-primary text-white transition-colors"
                  >
                    Add Server
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
