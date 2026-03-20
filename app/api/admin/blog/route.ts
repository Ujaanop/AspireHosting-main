import { NextRequest, NextResponse } from 'next/server'
import { dbGet, dbSet } from '@/lib/db'
import { verifyAdmin } from '@/lib/verifyAdmin'

const BLOG_KEY = 'blog'
const BLOG_FILE = 'app/config/blog.json'

async function readBlog() {
  const data = await dbGet<{ categories: unknown[]; posts: unknown[]; settings: unknown }>(BLOG_KEY, BLOG_FILE)
  return data ?? { categories: [], posts: [], settings: {} }
}

async function writeBlog(data: unknown) {
  await dbSet(BLOG_KEY, data, BLOG_FILE)
}

// GET — public
export async function GET() {
  try {
    const data = await readBlog()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ categories: [], posts: [], settings: {} })
  }
}

// POST — add post (admin only)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password, post } = body
    if (!await verifyAdmin(username, password)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (!post?.title || !post?.content || !post?.category) {
      return NextResponse.json({ error: 'title, content, and category are required' }, { status: 400 })
    }

    const slug = (post.slug || post.title)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')

    const now = new Date().toISOString()
    const wordCount = String(post.content).split(/\s+/).length
    const readTime = `${Math.max(1, Math.round(wordCount / 200))} min read`

    const newPost = {
      id: slug,
      title: String(post.title).trim(),
      slug,
      excerpt: String(post.excerpt || '').trim() || String(post.content).slice(0, 160).trim(),
      content: String(post.content).trim(),
      author: {
        name: String(post.authorName || 'Aspire Team').trim(),
        role: String(post.authorRole || 'Aspire Hosting').trim(),
        avatar: '/authors/aspire-team.jpg',
      },
      category: String(post.category),
      tags: Array.isArray(post.tags)
        ? post.tags
        : String(post.tags || '').split(',').map((t: string) => t.trim()).filter(Boolean),
      featured: Boolean(post.featured),
      published: post.published !== false,
      publishedAt: now,
      updatedAt: now,
      readTime,
      image: String(post.image || '/blog/server.webp').trim(),
      seo: {
        title: String(post.seoTitle || post.title).trim(),
        description: String(post.seoDescription || post.excerpt || '').trim(),
        keywords: Array.isArray(post.tags)
          ? post.tags
          : String(post.tags || '').split(',').map((t: string) => t.trim()).filter(Boolean),
      },
    }

    const data = await readBlog()
    const posts = data.posts as { slug: string; id: string }[]
    if (posts.some((p) => p.slug === slug)) {
      newPost.id = `${slug}-${Date.now()}`
      newPost.slug = newPost.id
    }
    posts.unshift(newPost)
    await writeBlog(data)
    return NextResponse.json({ success: true, post: newPost })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 })
  }
}

// PATCH — update post (admin only)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password, id, updates } = body
    if (!await verifyAdmin(username, password)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const data = await readBlog()
    const posts = data.posts as { id: string }[]
    const idx = posts.findIndex((p) => p.id === id)
    if (idx === -1) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    posts[idx] = { ...posts[idx], ...updates, updatedAt: new Date().toISOString() }
    await writeBlog(data)
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 })
  }
}

// DELETE — remove post (admin only)
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password, id } = body
    if (!await verifyAdmin(username, password)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const data = await readBlog()
    const posts = data.posts as { id: string }[]
    const before = posts.length
    data.posts = posts.filter((p) => p.id !== id)
    if ((data.posts as unknown[]).length === before) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    await writeBlog(data)
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 })
  }
}
