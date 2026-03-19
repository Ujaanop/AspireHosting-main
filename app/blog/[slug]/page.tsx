"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, Tag, ArrowLeft, Share2, ChevronRight, Copy, Check } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  getPostBySlug,
  getRelatedPosts,
  getRecentPosts,
  getAllCategories,
  formatDate,
} from "../../lib/blogUtils"
import type { BlogPost } from "../../types/blog"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import BlogCard from "../../components/blog/BlogCard"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const loadPost = async () => {
      const { slug } = await params
      const foundPost = getPostBySlug(slug)
      if (!foundPost) {
        notFound()
        return
      }
      setPost(foundPost)
      setRelatedPosts(getRelatedPosts(foundPost, 3))
      setRecentPosts(getRecentPosts(4))
    }
    loadPost()
  }, [params])

  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const categories = getAllCategories()
  const category = categories.find((c) => c.id === post.category)

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

  const getCategoryText = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId)
    if (!cat) return "text-gray-500"
    const map: Record<string, string> = {
      blue: "text-blue-600 dark:text-blue-400",
      green: "text-green-600 dark:text-green-400",
      red: "text-red-600 dark:text-red-400",
      purple: "text-purple-600 dark:text-purple-400",
      orange: "text-orange-600 dark:text-orange-400",
    }
    return map[cat.color] ?? "text-gray-500"
  }

  const authorInitials = post.author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, text: post.excerpt, url })
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />

      {/* ── Breadcrumb ───────────────────────────────────── */}
      <div className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 text-sm text-gray-400">
          <Link href="/blog" className="hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            Blog
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className={`font-medium ${getCategoryText(post.category)}`}>
            {category?.name}
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-600 dark:text-gray-300 line-clamp-1">{post.title}</span>
        </div>
      </div>

      {/* ── Hero image ───────────────────────────────────── */}
      <div className="relative w-full aspect-[21/9] max-h-[480px] bg-gray-100 dark:bg-gray-800">
        <Image
          src={post.image}
          alt={post.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* ── Main layout ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* ── Article ──────────────────────────────────── */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            {/* Category + back link */}
            <div className="flex items-center justify-between mb-5">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getCategoryBg(post.category)}`}>
                {category?.name}
              </span>
              <Link
                href="/blog"
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                All posts
              </Link>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-8 border-l-4 border-blue-500 pl-5">
              {post.excerpt}
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-5 pb-8 border-b border-gray-100 dark:border-gray-800 mb-8">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {authorInitials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none">
                    {post.author.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{post.author.role}</p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                {formatDate(post.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
              <button
                onClick={handleShare}
                className="ml-auto flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    Share
                  </>
                )}
              </button>
            </div>

            {/* Body */}
            <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <Tag className="w-4 h-4" />
                  Tags
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.article>

          {/* ── Sidebar ──────────────────────────────────── */}
          <motion.aside
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Author */}
            <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-6 bg-gray-50 dark:bg-gray-900">
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">
                About the Author
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {authorInitials}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{post.author.name}</p>
                  <p className="text-sm text-gray-400">{post.author.role}</p>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-6 bg-gray-50 dark:bg-gray-900">
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">
                Categories
              </p>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href="/blog"
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                      {cat.name}
                    </span>
                    <span className={`w-2.5 h-2.5 rounded-full ${getCategoryBg(cat.id)}`} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent posts */}
            <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-6 bg-gray-50 dark:bg-gray-900">
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">
                Recent Posts
              </p>
              <div className="space-y-4">
                {recentPosts
                  .filter((p) => p.id !== post.id)
                  .slice(0, 3)
                  .map((recentPost) => (
                    <Link
                      key={recentPost.id}
                      href={`/blog/${recentPost.slug}`}
                      className="group flex gap-3"
                    >
                      <div className="relative w-14 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700">
                        <Image
                          src={recentPost.image}
                          alt={recentPost.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                          {recentPost.title}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">{formatDate(recentPost.publishedAt)}</p>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </motion.aside>
        </div>

        {/* ── Related posts ──────────────────────────────── */}
        {relatedPosts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-20 pt-12 border-t border-gray-100 dark:border-gray-800"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost, i) => (
                <motion.div
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}
                >
                  <BlogCard post={relatedPost} categories={categories} />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      <Footer />
    </div>
  )
}
