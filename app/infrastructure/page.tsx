"use client"

import React, { useMemo, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Image from "next/image"
import { motion } from "framer-motion"
import { Server, Globe, Shield, Zap, Cpu, Network, Database, Cloud, SlidersHorizontal, MapPin } from "lucide-react"
import infraConfig from "../config/infrastructure.json"
import type { InfrastructureConfig, InfraLocation, InfraNode } from "../types/infrastructure"

const config = infraConfig as InfrastructureConfig

export default function InfrastructurePage() {
  const [selectedLocationId, setSelectedLocationId] = useState<string>("all")
  const [selectedHardwareType, setSelectedHardwareType] = useState<string>("all")
  const [otherFilters, setOtherFilters] = useState<string[]>([])

  const locations = useMemo(() => config.locations, [])
  const hardwareTypes = useMemo(() => config.filters.hardwareTypes, [])
  const otherOptions = useMemo(() => config.filters.other, [])

  const filteredLocations: InfraLocation[] = useMemo(() => {
    return locations
      .filter(loc => selectedLocationId === "all" || loc.id === selectedLocationId)
      .map(loc => ({
        ...loc,
        nodes: loc.nodes.filter(node => {
          if (selectedHardwareType !== "all" && node.nodeType !== selectedHardwareType) return false
          // other filters
          if (otherFilters.includes("owned") && !node.ownedHardware) return false
          if (otherFilters.includes("waterCooled") && !node.waterCooled) return false
          if (otherFilters.includes("nvme") && !/NVMe/i.test(node.storage)) return false
          if (otherFilters.includes("multiBlend10g") && !/10 Gbit/i.test(node.bandwidth)) return false
          return true
        })
      }))
      .filter(loc => loc.nodes.length > 0)
  }, [locations, selectedLocationId, selectedHardwareType, otherFilters])

  const resetFilters = () => {
    setSelectedLocationId("all")
    setSelectedHardwareType("all")
    setOtherFilters([])
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] dark:bg-[#0a0b0f]">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Light mode soft background, dark mode blue→black */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#eef3ff] via-[#f7fafc] to-[#eef2f7] dark:from-blue-700 dark:via-blue-900 dark:to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-700/10 via-transparent to-transparent dark:from-blue-300/10" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 text-left">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 bg-blue-600/10 text-blue-700 dark:bg-white/15 dark:text-white">
              <Server className="w-4 h-4" />
              <span className="text-sm font-semibold">Hardware & Locations</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">Enterprise Hardware & Global Locations</h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 max-w-3xl">Select your preferred location and explore our available hardware for game, VPS, web and bot hosting.</p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-xl border border-secondary bg-white dark:bg-gray-900/40 p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4 text-gray-700 dark:text-gray-300">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm font-semibold">View All Filters</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Location */}
            <div>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Location</div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedLocationId("all")}
                  className={`px-3 py-1.5 rounded-lg text-sm ${selectedLocationId === "all" ? 'button-primary text-button-primary' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                >View all</button>
                {locations.map(loc => (
                  <button
                    key={loc.id}
                    onClick={() => setSelectedLocationId(loc.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm ${selectedLocationId === loc.id ? 'button-primary text-button-primary' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                  >{loc.name}</button>
                ))}
              </div>
            </div>

            {/* Hardware Type */}
            <div>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Hardware Type</div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedHardwareType("all")}
                  className={`px-3 py-1.5 rounded-lg text-sm ${selectedHardwareType === "all" ? 'button-primary text-button-primary' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                >View all</button>
                {hardwareTypes.map(ht => (
                  <button
                    key={ht.id}
                    onClick={() => setSelectedHardwareType(ht.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm ${selectedHardwareType === ht.id ? 'button-primary text-button-primary' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                  >{ht.name}</button>
                ))}
              </div>
            </div>

            {/* Other Filters */}
            <div>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Other Filters</div>
              <div className="flex flex-wrap gap-2">
                {otherOptions.map(opt => {
                  const active = otherFilters.includes(opt.id)
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setOtherFilters(prev => active ? prev.filter(id => id !== opt.id) : [...prev, opt.id])}
                      className={`px-3 py-1.5 rounded-lg text-sm ${active ? 'button-primary text-button-primary' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                    >{opt.name}</button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button onClick={resetFilters} className="text-sm text-gray-600 dark:text-gray-300 hover:underline">Reset filters</button>
          </div>
        </div>
      </section>

      {/* Location Sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filteredLocations.map((loc) => (
          <div key={loc.id} className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{loc.name}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loc.nodes.map((node, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className="relative bg-white dark:bg-gray-900/40 border border-secondary rounded-xl p-4 overflow-hidden"
                >
                  {node.comingSoon && (
                    <div className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 z-10 whitespace-nowrap">
                      Coming Soon
                    </div>
                  )}
                  <div className={`flex items-start justify-between mb-3 gap-2 ${node.comingSoon ? 'pr-24' : ''}`}>
                    <div className="text-sm px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold">
                      {node.nodeType === 'game' ? 'Game Hosting' : node.nodeType === 'vps' ? 'VPS Hosting' : node.nodeType === 'web' ? 'Web Hosting' : 'Bot Hosting'}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-end min-w-0">
                      {node.ownedHardware && (
                        <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 whitespace-nowrap">Owned Hardware</span>
                      )}
                      {node.waterCooled && (
                        <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 whitespace-nowrap">Water Cooled</span>
                      )}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{node.tier}</h3>
                  <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2"><Cpu className="w-4 h-4 text-blue-500" /> <span className="font-medium">CPU</span> <span className="ml-auto">{node.cpu}</span></div>
                    <div className="flex items-center gap-2"><Database className="w-4 h-4 text-blue-500" /> <span className="font-medium">RAM</span> <span className="ml-auto">{node.ram}</span></div>
                    <div className="flex items-center gap-2"><Server className="w-4 h-4 text-blue-500" /> <span className="font-medium">Storage</span> <span className="ml-auto">{node.storage}</span></div>
                    <div className="flex items-center gap-2"><Network className="w-4 h-4 text-blue-500" /> <span className="font-medium">Bandwidth</span> <span className="ml-auto">{node.bandwidth}</span></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  )
}
