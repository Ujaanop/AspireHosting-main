"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { searchPosts } from "../../lib/blogUtils"
import type { BlogPost } from "../../types/blog"

interface BlogSearchProps {
  onSearchResults: (posts: BlogPost[]) => void
  onClear: () => void
  className?: string
}

export default function BlogSearch({ onSearchResults, onClear, className = "" }: BlogSearchProps) {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsSearching(true)
    const results = searchPosts(query)
    onSearchResults(results)
    setIsSearching(false)
  }

  const handleClear = () => {
    setQuery("")
    onClear()
  }

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search articles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <button
        type="submit"
        disabled={isSearching || !query.trim()}
        className="mt-3 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        {isSearching ? "Searching..." : "Search"}
      </button>
    </form>
  )
}


