"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { formatDate } from "../lib/blogUtils"
import type { BlogFilters, BlogPost, BlogCategory } from "../types/blog"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import BlogCard from "../components/blog/BlogCard"
import CategoryFilter from "../components/blog/CategoryFilter"
import BlogPagination from "../components/blog/BlogPagination"

export default function BlogPage() {
  const [filters, setFilters] = useState<BlogFilters>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [allPosts, setAllPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])

  useEffect(() => {
    fetch('/api/admin/blog')
      .then(r => r.json())
      .then(data => {
        setAllPosts((data.posts ?? []).filter((p: BlogPost) => p.published))
        setCategories(data.categories ?? [])
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const newFilters: BlogFilters = {}
    if (searchQuery.trim()) newFilters.search = searchQuery.trim()
    if (selectedCategory) newFilters.category = selectedCategory
    setFilters(newFilters)
    setCurrentPage(1)
  }, [searchQuery, selectedCategory])

  // Filter & paginate client-side
  const POSTS_PER_PAGE = 6
  const filtered = allPosts.filter(p => {
    if (filters.category && p.category !== filters.category) return false
    if (filters.search) {
      const q = filters.search.toLowerCase()
      return p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q))
    }
    return true
  })
  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE)
  const posts = filtered.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)
  const pagination = { currentPage, totalPages, totalPosts: filtered.length, hasNextPage: currentPage < totalPages, hasPreviousPage: currentPage > 1 }
  const featuredPost = allPosts.find(p => p.featured) ?? null
  const recentPosts = allPosts.slice(0, 4)
  const isFiltered = searchQuery.trim() !== "" || selectedCategory !== ""

  const getCategoryBg = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId)
    if (!cat) return "bg-gray-500"
    const map: Record<string, string> = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      red: "bg-red-500",
      purple: "bg-purple-500",
      orange: "bg-orange-500",
    }
    return map[cat.color] ?? "bg-gray-500"
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />

      {/* ── Header ──────────────────────────────────────────── */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
          {/* Title row */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-xs font-semibold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-2">
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                The Blog
              </h1>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-400 max-w-lg">
                Hosting guides, infrastructure insights, and company updates.
              </p>
            </div>

            {/* Search */}
            <div className="w-full md:w-72">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <svg
                  className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Category pills */}
          <div className="mt-7 overflow-x-auto pb-1">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-14">

        {/* ── Hero: Featured + Recent sidebar ─────────────────── */}
        {!isFiltered && featuredPost && (
          <section className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

              {/* Featured article */}
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="lg:col-span-2 group block"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-2xl overflow-hidden"
                >
                  <div className="relative aspect-[16/9] bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-7">
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getCategoryBg(featuredPost.category)}`}
                        >
                          {categories.find((c) => c.id === featuredPost.category)?.name}
                        </span>
                        <span className="text-xs text-white/60 font-medium uppercase tracking-wide">
                          Featured
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug mb-3 group-hover:text-blue-200 transition-colors">
                        {featuredPost.title}
                      </h2>
                      <p className="text-white/70 text-sm line-clamp-2 mb-4">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center gap-5 text-white/55 text-xs">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(featuredPost.publishedAt)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {featuredPost.readTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>

              {/* Recent posts sidebar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-6">
                  Recent Posts
                </p>
                <div className="space-y-6">
                  {recentPosts
                    .filter((p) => p.id !== featuredPost.id)
                    .slice(0, 3)
                    .map((post) => (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="group flex gap-4"
                      >
                        <div className="relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-white text-xs font-medium mb-1.5 ${getCategoryBg(post.category)}`}
                          >
                            {categories.find((c) => c.id === post.category)?.name}
                          </span>
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                            {post.title}
                          </h4>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(post.publishedAt)}
                          </p>
                        </div>
                      </Link>
                    ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* ── Latest / filtered posts ──────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isFiltered
                ? searchQuery.trim()
                  ? `Results for "${searchQuery}"`
                  : (categories.find((c) => c.id === selectedCategory)?.name ?? "All Posts")
                : "Latest Posts"}
            </h2>
            <span className="text-sm text-gray-400">
              {pagination.totalPosts} article{pagination.totalPosts !== 1 ? "s" : ""}
            </span>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-gray-400 text-lg">No articles found.</p>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("")
                }}
                className="mt-4 text-blue-500 hover:underline text-sm"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                >
                  <BlogCard post={post} categories={categories} />
                </motion.div>
              ))}
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="mt-14">
              <BlogPagination
                pagination={pagination}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
