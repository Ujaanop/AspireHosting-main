"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import uiConfig from "../config/sections/ui.json"
import type { UIConfig, Currency } from "../types/ui"

const config = uiConfig as UIConfig

interface CurrencyContextType {
  selectedCurrency: Currency
  setSelectedCurrency: (currency: Currency) => void
  exchangeRates: Record<string, number>
  convertPrice: (price: string) => string
  isLoading: boolean
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const defaultCurrency = config.currency.supportedCurrencies.find(
    c => c.code === config.currency.defaultCurrency
  ) || config.currency.supportedCurrencies[0]

  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(defaultCurrency)
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({ USD: 1 })
  const [isLoading, setIsLoading] = useState(false)

  // Load saved currency from localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency')
    if (savedCurrency) {
      try {
        const parsed = JSON.parse(savedCurrency)
        const currency = config.currency.supportedCurrencies.find(c => c.code === parsed.code)
        if (currency) {
          setSelectedCurrency(currency)
        }
      } catch (error) {
        console.error('Failed to parse saved currency:', error)
      }
    }
  }, [])

  // Save currency to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('selectedCurrency', JSON.stringify(selectedCurrency))
  }, [selectedCurrency])

  // Fetch live exchange rates from ExchangeRate-API
  useEffect(() => {
    const fetchRates = async () => {
      setIsLoading(true)
      try {
        const apiKey = config.currency.apiKey
        const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (data.result === 'success' && data.conversion_rates) {
          setExchangeRates({ USD: 1, ...data.conversion_rates })
        }
      } catch (err) {
        console.error('Failed to fetch exchange rates, falling back to 1:1:', err)
        // Fallback: keep rates at 1:1 (prices shown in USD values)
        setExchangeRates({ USD: 1 })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRates()
  }, [])

  const convertPrice = (price: string): string => {
    // Remove any currency symbols and extract the numeric value
    let cleaned = price.toString()
      .replace(/C\$/g, '')
      .replace(/A\$/g, '')
      .replace(/[£$€¥₹]/g, '')
      .trim()

    const numericPrice = parseFloat(cleaned)

    if (isNaN(numericPrice)) {
      return `${selectedCurrency.symbol}0.00`
    }

    // Convert from USD base to the selected currency
    const rate = exchangeRates[selectedCurrency.code] ?? 1
    const converted = numericPrice * rate

    if (selectedCurrency.code === "JPY") {
      return `${selectedCurrency.symbol}${Math.round(converted)}`
    }
    return `${selectedCurrency.symbol}${converted.toFixed(2)}`
  }

  return (
    <CurrencyContext.Provider
      value={{
        selectedCurrency,
        setSelectedCurrency,
        exchangeRates,
        convertPrice,
        isLoading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency(): CurrencyContextType {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
