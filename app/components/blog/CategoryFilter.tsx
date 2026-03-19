"use client"

import { motion } from "framer-motion"
import type { BlogCategory } from "../../types/blog"

interface CategoryFilterProps {
  categories: BlogCategory[]
  selectedCategory: string
  onCategorySelect: (categoryId: string) => void
  className?: string
}

export default function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategorySelect, 
  className = "" 
}: CategoryFilterProps) {
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

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onCategorySelect("")}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selectedCategory === ""
            ? "bg-blue-500 text-white"
            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
        }`}
      >
        All Posts
      </motion.button>
      
      {categories.map((category) => (
        <motion.button
          key={category.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCategorySelect(category.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === category.id
              ? `${getCategoryColor(category.id)} text-white`
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          {category.name}
        </motion.button>
      ))}
    </div>
  )
}


