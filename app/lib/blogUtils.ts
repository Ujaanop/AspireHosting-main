import blogConfig from "../config/blog.json"
import type { BlogConfig, BlogPost, BlogCategory, BlogFilters, PaginationInfo } from "../types/blog"

const config = blogConfig as BlogConfig

/**
 * Get all published blog posts
 */
export function getAllPosts(): BlogPost[] {
  return config.posts.filter(post => post.published)
}

/**
 * Get all blog categories
 */
export function getAllCategories(): BlogCategory[] {
  return config.categories
}

/**
 * Get blog settings
 */
export function getBlogSettings() {
  return config.settings
}

/**
 * Get posts with filters and pagination
 */
export function getPosts(
  filters: BlogFilters = {},
  page: number = 1,
  postsPerPage: number = config.settings.postsPerPage
): { posts: BlogPost[]; pagination: PaginationInfo } {
  let filteredPosts = getAllPosts()

  // Apply filters
  if (filters.category) {
    filteredPosts = filteredPosts.filter(post => post.category === filters.category)
  }

  if (filters.tag) {
    filteredPosts = filteredPosts.filter(post => 
      post.tags.some(tag => tag.toLowerCase().includes(filters.tag!.toLowerCase()))
    )
  }

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase()
    filteredPosts = filteredPosts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }

  if (filters.featured !== undefined) {
    filteredPosts = filteredPosts.filter(post => post.featured === filters.featured)
  }

  if (filters.author) {
    filteredPosts = filteredPosts.filter(post => 
      post.author.name.toLowerCase().includes(filters.author!.toLowerCase())
    )
  }

  // Sort by published date (newest first)
  filteredPosts.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  // Calculate pagination
  const totalPosts = filteredPosts.length
  const totalPages = Math.ceil(totalPosts / postsPerPage)
  const startIndex = (page - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex)

  const pagination: PaginationInfo = {
    currentPage: page,
    totalPages,
    totalPosts,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  }

  return { posts: paginatedPosts, pagination }
}

/**
 * Get a single blog post by slug
 */
export function getPostBySlug(slug: string): BlogPost | null {
  return config.posts.find(post => post.slug === slug && post.published) || null
}

/**
 * Get featured posts
 */
export function getFeaturedPosts(count: number = config.settings.featuredPostsCount): BlogPost[] {
  return getAllPosts()
    .filter(post => post.featured)
    .slice(0, count)
}

/**
 * Get recent posts
 */
export function getRecentPosts(count: number = config.settings.recentPostsCount): BlogPost[] {
  return getAllPosts()
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, count)
}

/**
 * Get related posts based on category and tags
 */
export function getRelatedPosts(currentPost: BlogPost, count: number = 3): BlogPost[] {
  const allPosts = getAllPosts().filter(post => post.id !== currentPost.id)
  
  // Find posts with same category
  const sameCategoryPosts = allPosts.filter(post => post.category === currentPost.category)
  
  // Find posts with similar tags
  const similarTagPosts = allPosts.filter(post => 
    post.tags.some(tag => currentPost.tags.includes(tag))
  )
  
  // Combine and deduplicate
  const relatedPosts = [...sameCategoryPosts, ...similarTagPosts]
    .filter((post, index, self) => self.findIndex(p => p.id === post.id) === index)
    .slice(0, count)
  
  return relatedPosts
}

/**
 * Get posts by category
 */
export function getPostsByCategory(categoryId: string): BlogPost[] {
  return getAllPosts().filter(post => post.category === categoryId)
}

/**
 * Get posts by tag
 */
export function getPostsByTag(tag: string): BlogPost[] {
  return getAllPosts().filter(post => 
    post.tags.some(postTag => postTag.toLowerCase().includes(tag.toLowerCase()))
  )
}

/**
 * Get all unique tags
 */
export function getAllTags(): string[] {
  const allTags = getAllPosts().flatMap(post => post.tags)
  return [...new Set(allTags)].sort()
}

/**
 * Get category by ID
 */
export function getCategoryById(categoryId: string): BlogCategory | null {
  return config.categories.find(category => category.id === categoryId) || null
}

/**
 * Search posts
 */
export function searchPosts(query: string): BlogPost[] {
  if (!query.trim()) return []
  
  const searchTerm = query.toLowerCase()
  return getAllPosts().filter(post => 
    post.title.toLowerCase().includes(searchTerm) ||
    post.excerpt.toLowerCase().includes(searchTerm) ||
    post.content.toLowerCase().includes(searchTerm) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    post.author.name.toLowerCase().includes(searchTerm)
  )
}

/**
 * Get archive data (posts grouped by month/year)
 */
export function getArchiveData() {
  const posts = getAllPosts()
  const archive: { [key: string]: BlogPost[] } = {}
  
  posts.forEach(post => {
    const date = new Date(post.publishedAt)
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    
    if (!archive[monthYear]) {
      archive[monthYear] = []
    }
    archive[monthYear].push(post)
  })
  
  return Object.keys(archive)
    .sort()
    .reverse()
    .map(monthYear => ({
      monthYear,
      posts: archive[monthYear],
      count: archive[monthYear].length
    }))
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Get reading time estimate
 */
export function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} min read`
}


