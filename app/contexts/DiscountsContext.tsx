'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { DiscountsConfig } from '@/app/types/discounts'
import discountFallback from '@/app/config/discounts.json'

interface DiscountsContextValue {
  config: DiscountsConfig
  loading: boolean
}

const DiscountsContext = createContext<DiscountsContextValue>({
  config: discountFallback as DiscountsConfig,
  loading: true,
})

export function DiscountsProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<DiscountsConfig>(discountFallback as DiscountsConfig)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/discounts')
      .then(r => r.json())
      .then(data => { if (data.discounts) setConfig(data.discounts) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <DiscountsContext.Provider value={{ config, loading }}>
      {children}
    </DiscountsContext.Provider>
  )
}

export function useDiscounts() {
  return useContext(DiscountsContext)
}
