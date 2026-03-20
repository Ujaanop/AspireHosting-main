import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { verifyAdmin } from '@/lib/verifyAdmin'

const BLOG_PATH = path.join(process.cwd(), 'app', 'config', 'blog.json')

async function readBlog() {
  const raw = await fs.readFile(BLOG_PATH, 'utf-8')
  return JSON.parse(raw)
}

async function writeBlog(data: unknown) {
  await fs.writeFile(BLOG_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

export async function GET() {
  try {
    return NextResponse.json(await readBlog())
  } catch {
    return NextResponse.json({ categories: [], posts: [], settings: {} })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password, post } = body
    if (!await verifyAdmin(username, password)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!post?.title || !post?.content || !post?.category) return NextResponse.json({ error: 'title, content, and category are required' }, { status: 400 })
    const slug = (post.slug || post.title).toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
    const now = new Date().toISOString()
    const readTime = `${Math.max(1, Math.round(String(post.content).split(/\s+/).length / 200))} min read`
    const newPost = {
      id: slug, title: String(post.title).trim(), slug,
      excerpt: String(post.excerpt || '').trim() || String(post.content).slice(0, 160).trim(),
      content: String(post.content).trim(),
      author: { name: String(post.authorName || 'Aspire Team').trim(), role: String(post.authorRole || 'Aspire Hosting').trim(), avatar: '/authors/aspire-team.jpg' },
      category: String(post.category),
      tags: Array.isArray(post.tags) ? post.tags : String(post.tags || '').split(',').map((t: string) => t.trim()).filter(Boolean),
      featured: Boolean(post.featured), published: post.published !== false,
      publishedAt: now, updatedAt: now, readTime,
      image: String(post.image || '/blog/server.webp').trim(),
      seo: { title: String(post.seoTitle || post.title).trim(), description: String(post.seoDescription || post.excerpt || '').trim(), keywords: Array.isArray(post.tags) ? post.tags : String(post.tags || '').split(',').map((t: string) => t.trim()).filter(Boolean) },
    }
    const data = await readBlog()
    if (data.posts.some((p: { slug: string }) => p.slug === slug)) { newPost.id = `${slug}-${Date.now()}`; newPost.slug = newPost.id }
    data.posts.unshift(newPost)
    await writeBlog(data)
    return NextResponse.json({ success: true, post: newPost })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password, id, updates } = body
    if (!await verifyAdmin(username, password)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const data = await readBlog()
    const idx = data.posts.findIndex((p: { id: string }) => p.id === id)
    if (idx === -1) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    data.posts[idx] = { ...data.posts[idx], ...updates, updatedAt: new Date().toISOString() }
    await writeBlog(data)
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password, id } = body
    if (!await verifyAdmin(username, password)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const data = await readBlog()
    const before = data.posts.length
    data.posts = data.posts.filter((p: { id: string }) => p.id !== id)
    if (data.posts.length === before) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    await writeBlog(data)
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 })
  }
}
