"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Clock, Mail, Calendar } from "lucide-react"
import Link from "next/link"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function ComingSoonPage() {
  const [page, setPage] = useState<string>("")
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    // Get the page parameter from URL
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const pageParam = urlParams.get('page')
      setPage(pageParam || '')
    }
  }, [])

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // Here you could integrate with your email service
      setIsSubscribed(true)
      setEmail("")
    }
  }

  const getPageInfo = () => {
    switch (page) {
      case 'blog':
        return {
          title: "Blog",
          description: "Our company blog with the latest hosting news, tutorials, and exclusive offers",
          icon: "📝",
          features: [
            "Latest hosting industry news",
            "Step-by-step tutorials",
            "Exclusive offers and discounts",
            "Technical guides and tips"
          ]
        }
      default:
        return {
          title: "Feature",
          description: "This feature is currently under development",
          icon: "🚀",
          features: [
            "Coming soon",
            "Stay tuned for updates",
            "We're working hard on this",
            "Thank you for your patience"
          ]
        }
    }
  }

  const pageInfo = getPageInfo()

  // Debug: Log the page parameter
  console.log('Coming Soon Page - page parameter:', page)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0b0f]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-6">{pageInfo.icon}</div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {pageInfo.title} Coming Soon
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              {pageInfo.description}
            </p>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Under Development</span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            What to Expect
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pageInfo.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg"
              >
                <div className="text-2xl mb-3">✨</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature}
                </h3>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Email Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Get Notified When It's Ready
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We'll send you an email as soon as this feature becomes available
          </p>
          
          {!isSubscribed ? (
            <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Notify Me
                </button>
              </div>
            </form>
          ) : (
            <div className="text-green-600 dark:text-green-400 font-medium">
              ✅ Thanks! We'll notify you when it's ready.
            </div>
          )}
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Homepage
          </Link>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
