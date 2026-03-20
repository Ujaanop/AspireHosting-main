import { NextRequest, NextResponse } from 'next/server'
import { dbGet, dbSet } from '@/lib/db'
import { verifyAdmin } from '@/lib/verifyAdmin'

interface AdminEntry { username: string; password: string }

const SERVERS_KEY = 'status_servers'
const SERVERS_FILE = 'app/config/sections/statusServers.json'
const ADMINS_KEY = 'admins'
const ADMINS_FILE = 'app/config/sections/statusAdmins.json'

async function readData() {
  const data = await dbGet<{ servers: unknown[]; categories: unknown[] }>(SERVERS_KEY, SERVERS_FILE)
  return data ?? { servers: [], categories: [] }
}

async function writeData(data: unknown) {
  await dbSet(SERVERS_KEY, data, SERVERS_FILE)
}

// GET — public
export async function GET() {
  try {
    const data = await readData()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ categories: [], servers: [] })
  }
}

// POST — add server or category (admin only)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password, type } = body

    if (!await verifyAdmin(username, password)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await readData()

    if (type === 'category') {
      const { name, description } = body
      if (!name) return NextResponse.json({ error: 'name is required' }, { status: 400 })
      const newCat = {
        id: `cat-${Date.now()}`,
        name: String(name).trim(),
        description: description ? String(description).trim() : undefined,
      }
      data.categories = data.categories ?? []
      ;(data.categories as unknown[]).push(newCat)
      await writeData(data)
      return NextResponse.json({ success: true, category: newCat })
    }

    const { name, url, categoryId } = body
    if (!name || !url) {
      return NextResponse.json({ error: 'name and url are required' }, { status: 400 })
    }
    const newServer = {
      id: `custom-${Date.now()}`,
      name: String(name).trim(),
      url: String(url).trim(),
      type: type === 'ip' ? 'ip' : 'http',
      isPreset: false,
      addedAt: Date.now(),
      categoryId: categoryId ?? null,
    }
    ;(data.servers as unknown[]).push(newServer)
    await writeData(data)
    return NextResponse.json({ success: true, server: newServer })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 })
  }
}

// DELETE — remove server or category (admin only)
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password, id, type } = body

    if (!await verifyAdmin(username, password)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    const data = await readData()

    if (type === 'category') {
      data.categories = (data.categories as { id: string }[]).filter((c) => c.id !== id)
      data.servers = (data.servers as { categoryId?: string }[]).map((s) =>
        s.categoryId === id ? { ...s, categoryId: null } : s
      )
      await writeData(data)
      return NextResponse.json({ success: true })
    }

    const servers = data.servers as { id: string; isPreset: boolean }[]
    const target = servers.find((s) => s.id === id)
    if (!target) return NextResponse.json({ error: 'Server not found' }, { status: 404 })
    if (target.isPreset) return NextResponse.json({ error: 'Cannot remove preset servers' }, { status: 403 })
    data.servers = servers.filter((s) => s.id !== id)
    await writeData(data)
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 })
  }
}

// PATCH — update admins list or rename category (admin only)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password, type } = body

    if (!await verifyAdmin(username, password)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (type === 'category') {
      const { id, name, description } = body
      if (!id || !name) return NextResponse.json({ error: 'id and name required' }, { status: 400 })
      const data = await readData()
      data.categories = (data.categories as { id: string; name: string; description?: string }[]).map((c) =>
        c.id === id ? { ...c, name: String(name).trim(), description: description ?? c.description } : c
      )
      await writeData(data)
      return NextResponse.json({ success: true })
    }

    const { admins } = body
    if (!Array.isArray(admins)) {
      return NextResponse.json({ error: 'admins must be an array' }, { status: 400 })
    }
    const validAdmins = admins.filter(
      (a: unknown) =>
        typeof a === 'object' && a !== null &&
        typeof (a as AdminEntry).username === 'string' &&
        typeof (a as AdminEntry).password === 'string' &&
        (a as AdminEntry).username.trim().length > 0 &&
        (a as AdminEntry).password.trim().length > 0
    )
    if (validAdmins.length === 0) {
      return NextResponse.json({ error: 'At least one valid admin is required' }, { status: 400 })
    }
    await dbSet(ADMINS_KEY, { admins: validAdmins }, ADMINS_FILE)
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 })
  }
}
