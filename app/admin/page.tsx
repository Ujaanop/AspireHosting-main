"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Lock, ExternalLink, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function AdminPage() {
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple password check - you can change this
    if (password === "admin123") {
      setIsAuthenticated(true)
    } else {
      alert("Incorrect password")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0b0f] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg w-full max-w-md"
        >
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Access</h1>
            <p className="text-gray-600 dark:text-gray-300">Enter password to access hidden pages</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white pr-10"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Access Admin Panel
            </button>
          </form>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
            Hint: admin123
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0b0f]">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Admin Panel
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Access hidden pages and features
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Blog Access */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              📝 Blog System
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Access the blog system with all posts and categories
            </p>
            <div className="space-y-3">
              <Link
                href="/blog"
                className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <span className="text-blue-600 dark:text-blue-400 font-medium">Blog Homepage</span>
                <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </Link>
              <Link
                href="/blog-new"
                className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                <span className="text-green-600 dark:text-green-400 font-medium">Blog (Alternative)</span>
                <ExternalLink className="w-4 h-4 text-green-600 dark:text-green-400" />
              </Link>
            </div>
          </motion.div>

          {/* Infrastructure Access */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              🏗️ Infrastructure
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Access the infrastructure page with hardware and locations
            </p>
            <div className="space-y-3">
              <Link
                href="/infrastructure"
                className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <span className="text-blue-600 dark:text-blue-400 font-medium">Infrastructure Page</span>
                <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </Link>
              <Link
                href="/infrastructure-test"
                className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                <span className="text-green-600 dark:text-green-400 font-medium">Infrastructure (Test)</span>
                <ExternalLink className="w-4 h-4 text-green-600 dark:text-green-400" />
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
          >
            ← Back to Homepage
          </Link>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
