'use client'
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Link from "next/link"

export default function DedicatedComingSoonPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0b0f] transition-colors duration-300 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 pt-16">
        <div className="max-w-2xl w-full text-center py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 orbitron-font">
            Dedicated Servers – Coming Soon
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            We\'re preparing something powerful. Dedicated servers are being finalized and will be available here shortly.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="button-primary text-button-primary px-6 py-3 rounded-lg font-medium">
              Back to Home
            </Link>
            <Link href="/vps" className="border border-secondary text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg font-medium hover:border-primary">
              Explore VPS
            </Link>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
            Need something now? Contact us and we\'ll help you choose the best option for your workload.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}