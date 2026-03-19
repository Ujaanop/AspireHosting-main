"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Server, Shield, Cpu, HardDrive, MemoryStick } from "lucide-react"
import gamesConfig from "../../config/sections/games.json"
import type { GamesConfig, Game, GamePlan, GameLocation } from "../../types/games"
import { useCurrency } from "../../contexts/CurrencyContext"
import { useLanguage } from "../../contexts/LanguageContext"
import { ComingSoonButton } from "../ui/coming-soon-button"
import { DiscountedPriceCompact } from "../ui/DiscountedPrice"

const config = gamesConfig as unknown as GamesConfig

export default function GameServerList() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const [selectedGame, setSelectedGame] = useState<string>(config.games[0]?.id || "")
  const [selectedLocation, setSelectedLocation] = useState<string>(config.locations[0]?.id || "")
  const [selectedPlanType, setSelectedPlanType] = useState<"budget" | "premium">("budget")

  // Handle initial URL parameters
  useEffect(() => {
    const game = searchParams.get("game")
    const location = searchParams.get("location")
    const plan = searchParams.get("plan") as "budget" | "premium"

    if (game && config.games.some((g: Game) => g.id === game)) {
      setSelectedGame(game)
    }
    if (location && config.locations.some((l) => l.id === location)) {
      setSelectedLocation(location)
    }
    if (plan && ["budget", "premium"].includes(plan)) {
      setSelectedPlanType(plan)
    }
  }, [searchParams])

  // Update URL when selections change
  useEffect(() => {
    const params = new URLSearchParams()
    params.set("game", selectedGame)
    params.set("location", selectedLocation)
    params.set("plan", selectedPlanType)
    const newUrl = `/games?${params.toString()}`
    const currentUrl = window.location.pathname + window.location.search
    if (newUrl !== currentUrl) {
      router.replace(newUrl)
    }
  }, [selectedGame, selectedLocation, selectedPlanType, router])

  const currentGame = config.games.find((g: Game) => g.id === selectedGame)
  const currentLocation = config.locations.find((loc) => loc.id === selectedLocation)
  const availablePlanTypes = currentLocation?.availablePlanTypes || []

  const handlePlanTypeSelection = (planType: "budget" | "premium") => {
    setSelectedPlanType(planType)
    const currentLoc = config.locations.find((loc) => loc.id === selectedLocation)
    if (currentLoc && !currentLoc.availablePlanTypes.includes(planType)) {
      const compatibleLocation = config.locations.find((loc) => loc.availablePlanTypes.includes(planType))
      if (compatibleLocation) {
        setSelectedLocation(compatibleLocation.id)
      }
    }
  }

  const handleLocationSelection = (locationId: string) => {
    setSelectedLocation(locationId)
    const newLocation = config.locations.find((loc) => loc.id === locationId)
    if (newLocation && !newLocation.availablePlanTypes.includes(selectedPlanType)) {
      if (newLocation.availablePlanTypes.length > 0) {
        setSelectedPlanType(newLocation.availablePlanTypes[0] as "budget" | "premium")
      }
    }
  }

  if (!currentGame || !currentLocation) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0b0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const plansForType = currentGame.plans[selectedPlanType] || []
  const filteredPlans = plansForType.filter((plan) => Array.isArray(plan.locations) && plan.locations.includes(selectedLocation) || Boolean(plan.locationComingSoon?.[selectedLocation]))

  return (
    <div className="bg-gray-50 dark:bg-[#0a0b0f] relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Image and Gradients */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${currentGame?.banner}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-gray-50/40 to-transparent dark:from-[#0a0b0f] dark:via-[#0a0b0f]/60 dark:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/80 to-gray-50/40 dark:from-[#0a0b0f] dark:via-[#0a0b0f]/95 dark:to-[#0a0b0f]/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 mt-16 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-left mb-8"
          style={
            {
              "--game-color": currentGame?.primaryColor || "#3b82f6",
            } as React.CSSProperties
          }
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
            <div className="flex-1">
              <div className="inline-flex items-left gap-2 bg-[var(--game-color)]/10 px-4 py-2 rounded-full mb-4">
                <Server className="w-4 h-4 text-[var(--game-color)]" />
                <span className="text-[var(--game-color)] text-sm">{t('gameServerList.badge')}</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 orbitron-font">
                {t('gameServerList.title').split(' ').slice(0, -2).join(' ')}{' '}
                <span className="text-[var(--game-color)]">{t('gameServerList.title').split(' ').slice(-2).join(' ')}</span>
              </h2>
              <p className="text-md text-gray-600 max-w-3xl dark:text-gray-300">
                {t('gameServerList.description')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filters - Side by Side Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-4"
          style={
            {
              "--game-color": currentGame?.primaryColor || "#3b82f6",
            } as React.CSSProperties
          }
        >
          <div className="flex flex-col lg:flex-row gap-6 justify-left items-left">
            {/* Plan Type Filter */}
            <div className="flex flex-col items-left">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('gameServerList.step1')}</h3>
              <div className="flex flex-wrap gap-2">
                {config.planTypes.map((type) => {
                  const isAvailable = availablePlanTypes.includes(type.id)
                  const isSelected = selectedPlanType === type.id
                  
                  return (
                    <button
                      key={type.id}
                      onClick={() => handlePlanTypeSelection(type.id as "budget" | "premium")}
                      disabled={!isAvailable}
                      className={`flex items-center gap-3 px-6 py-2 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm ${
                        isSelected
                          ? "bg-[var(--game-color)]/10 border border-[var(--game-color)]/30 text-[var(--game-color)] shadow-lg backdrop-blur-sm"
                          : isAvailable
                          ? "bg-white/5 dark:bg-gray-800/20 border border-[var(--game-color)]/30 dark:border-white/10 text-gray-700 dark:text-gray-400 hover:bg-[radial-gradient(50%_50%_at_50%_100%,rgba(255,255,255,0.05)_0%,transparent_100%)] hover:border-[var(--game-color)]/30"
                          : "bg-white/5 dark:bg-gray-800/10 border border-gray-300/40 dark:border-gray-600/20 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50"
                      }`}
                    >
                      <Image
                        src={type.image || "/placeholder.svg"}
                        alt={type.name}
                        width={32}
                        height={32}
                        className={`rounded-md object-contain ${!isAvailable ? 'opacity-50' : ''}`}
                      />
                      <span className="text-sm font-semibold">{type.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Location Filter */}
            <div className="flex flex-col items-left">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3.5">{t('gameServerList.step2')}</h3>
              <div className="flex flex-wrap gap-2">
                {config.locations.map((location: GameLocation) => {
                  const hasAvailablePlanTypes = location.availablePlanTypes.length > 0
                  const isSelected = selectedLocation === location.id
                  
                  return (
                    <button
                      key={location.id}
                      onClick={() => handleLocationSelection(location.id)}
                      disabled={!hasAvailablePlanTypes}
                      className={`flex items-center gap-3 px-4 py-3 rounded-md font-medium transition-all duration-300 backdrop-blur-sm ${
                        isSelected
                          ? "bg-[var(--game-color)]/10 border border-[var(--game-color)]/30 text-[var(--game-color)] shadow-lg backdrop-blur-sm"
                          : hasAvailablePlanTypes
                          ? "bg-white/5 dark:bg-gray-800/20 border border-[var(--game-color)]/30 dark:border-white/10 text-gray-700 dark:text-gray-400 hover:bg-[radial-gradient(50%_50%_at_50%_100%,rgba(255,255,255,0.05)_0%,transparent_100%)] hover:border-[var(--game-color)]/30"
                          : "bg-white/5 dark:bg-gray-800/10 border border-gray-300/40 dark:border-gray-600/20 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50"
                      }`}
                    >
                      <Image
                        src={location.flag || "/placeholder.svg"}
                        alt={`${location.name} flag`}
                        width={24}
                        height={24}
                        className={`rounded-full object-cover ${!hasAvailablePlanTypes ? 'opacity-50' : ''}`}
                      />
                      <span className="text-sm font-medium">{location.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Game Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-4"
        >
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('gameServerList.step3')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {config.games.map((game: Game) => (
              <button
                key={game.id}
                onClick={() => setSelectedGame(game.id)}
                style={{ "--game-color": game.primaryColor } as React.CSSProperties}
                className={`relative group rounded-xl overflow-hidden transition-all duration-300 p-3 text-left backdrop-blur-sm ${
                  selectedGame === game.id
                    ? "bg-[var(--game-color)]/30 text-white shadow-lg backdrop-blur-sm border border-[var(--game-color)]/40"
                    : "bg-white/20 dark:bg-gray-800/10 border border-[var(--game-color)]/40 hover:border-[var(--game-color)]/30 text-gray-700 dark:text-gray-300 hover:bg-[radial-gradient(50%_50%_at_50%_100%,rgba(255,255,255,0.05)_0%,transparent_100%)] dark:hover:bg-[radial-gradient(50%_50%_at_50%_100%,rgba(255,255,255,0.03)_0%,transparent_100%)]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={game.icon || "/placeholder.svg"}
                      alt={game.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-lg truncate">{game.name}</h4>
                      {game.featured && (
                        <div className="px-2 py-0.5 text-xs font-medium rounded-full bg-white/20 dark:bg-[var(--game-color)]/10 backdrop-blur-sm text-[var(--game-color)]">
                          {t('gameServerList.featured')}
                        </div>
                      )}
                    </div>
                    <p className="text-sm opacity-80 line-clamp-2 mb-2">{game.description}</p>
                    <p className="text-xs font-medium">{t('gameServerList.startingAt')} {game.startingAt}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('gameServerList.step4')}</h3>
        {/* Server Plans - Card Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {filteredPlans.map((plan: GamePlan, index: number) => {
            const isAvailableHere = Array.isArray(plan.locations) && plan.locations.includes(selectedLocation)
            const isComingSoon = plan.locationComingSoon?.[selectedLocation] || (!isAvailableHere)
            return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{ "--game-color": currentGame?.primaryColor } as React.CSSProperties}
              className="relative overflow-hidden rounded-xl bg-white/10 dark:bg-gray-900/10 backdrop-blur-sm border border-[var(--game-color)]/30 hover:border-[var(--game-color)]/30 dark:hover:border-[var(--game-color)]/40 transition-all duration-300 hover:bg-[radial-gradient(50%_50%_at_50%_100%,rgba(255,255,255,0.05)_0%,transparent_100%)] dark:hover:bg-[radial-gradient(50%_50%_at_50%_100%,rgba(255,255,255,0.03)_0%,transparent_100%)]"
            >
              {plan.type === "premium" && (
                <div className="absolute top-4 right-4">
                  <div className="px-2 py-1 text-xs font-medium rounded-full bg-white/20 dark:bg-[var(--game-color)]/10 backdrop-blur-sm text-[var(--game-color)]">
                    {t('gameServerList.premium')}
                  </div>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-8 h-8 rounded-md">
                    <Image
                      src={currentLocation?.flag || config.locations[0].flag}
                      alt={`${currentLocation?.name || "Location"}`}
                      fill
                      sizes="32px"
                      className="object-contain rounded-md"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <MemoryStick className="w-5 h-5 text-[var(--game-color)]" />
                    <span className="text-gray-600 dark:text-gray-300">{plan.ram} RAM</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Cpu className="w-5 h-5 text-[var(--game-color)]" />
                    <span className="text-gray-600 dark:text-gray-300">{plan.cpu} CPU</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <HardDrive className="w-5 h-5 text-[var(--game-color)]" />
                    <span className="text-gray-600 dark:text-gray-300">{plan.storage}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[var(--game-color)]" />
                    <span className="text-gray-600 dark:text-gray-300">{t('gameServerList.ddosProtection')}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <DiscountedPriceCompact
                    productType="games"
                    price={plan.originalPrice || plan.price}
                    period="/mo"
                    showPercentage={true}
                    color="text-green-500"
                    planType={plan.type}
                    showDiscountType={true}
                  />
                </div>

                <ComingSoonButton
                  comingSoon={isComingSoon}
                  orderLink={plan.locationOrderLinks?.[selectedLocation] || plan.orderLink}
                  className="orbitron-font w-full bg-[var(--game-color)] hover:opacity-90 dark:bg-[var(--game-color)]/30 text-white dark:text-white px-6 py-3 backdrop-blur-sm"
                >
                  {t('gameServerList.orderNow')}
                </ComingSoonButton>
              </div>
            </motion.div>
          )})}
        </div>
      </div>
    </div>
  )
}
