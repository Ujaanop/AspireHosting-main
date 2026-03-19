export interface BlogCategory {
  id: string
  name: string
  description: string
  color: string
  icon: string
}

export interface BlogAuthor {
  name: string
  role: string
  avatar: string
}

export interface BlogSEO {
  title: string
  description: string
  keywords: string[]
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: BlogAuthor
  category: string
  tags: string[]
  featured: boolean
  published: boolean
  publishedAt: string
  updatedAt: string
  readTime: string
  image: string
  seo: BlogSEO
}

export interface BlogSettings {
  postsPerPage: number
  featuredPostsCount: number
  recentPostsCount: number
  enableComments: boolean
  enableSharing: boolean
  enableSearch: boolean
  enableCategories: boolean
  enableTags: boolean
  enableAuthorInfo: boolean
  enableReadTime: boolean
  enableRelatedPosts: boolean
}

export interface BlogConfig {
  categories: BlogCategory[]
  posts: BlogPost[]
  settings: BlogSettings
}

export interface BlogFilters {
  category?: string
  tag?: string
  search?: string
  featured?: boolean
  author?: string
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalPosts: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}


