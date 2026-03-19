"use client"

import { motion } from "framer-motion"
import { Clock, User, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { BlogPost, BlogCategory } from "../../types/blog"

interface BlogCardProps {
  post: BlogPost
  categories: BlogCategory[]
  featured?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function BlogCard({ 
  post, 
  categories, 
  featured = false, 
  size = "md",
  className = "" 
}: BlogCardProps) {
  const category = categories.find(cat => cat.id === post.category)

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    if (!category) return "bg-gray-500"
    
    const colorMap: { [key: string]: string } = {
      blue: "bg-blue-500",
      green: "bg-green-500", 
      red: "bg-red-500",
      purple: "bg-purple-500",
      orange: "bg-orange-500"
    }
    
    return colorMap[category.color] || "bg-gray-500"
  }

  const sizeClasses = {
    sm: {
      image: "h-32",
      title: "text-lg",
      excerpt: "text-sm",
      padding: "p-4"
    },
    md: {
      image: "h-48",
      title: "text-xl",
      excerpt: "text-base",
      padding: "p-6"
    },
    lg: {
      image: "h-64",
      title: "text-2xl",
      excerpt: "text-lg",
      padding: "p-8"
    }
  }

  const classes = sizeClasses[size]

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow ${className}`}
    >
      <div className={`relative ${classes.image}`}>
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getCategoryColor(post.category)}`}>
            {category?.name}
          </span>
        </div>
        {featured && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white">
              Featured
            </span>
          </div>
        )}
      </div>
      
      <div className={classes.padding}>
        <h3 className={`font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 ${classes.title}`}>
          {post.title}
        </h3>
        
        <p className={`text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 ${classes.excerpt}`}>
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            {post.author.name}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {post.readTime}
          </div>
        </div>
        
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
        >
          Read More
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </motion.div>
  )
}


