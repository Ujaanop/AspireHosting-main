import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const SERVERS_PATH = path.join(process.cwd(), 'app', 'config', 'sections', 'statusServers.json')
const ADMINS_PATH = path.join(process.cwd(), 'app', 'config', 'sections', 'statusAdmins.json')

interface AdminEntry {
  username: string
  password: string
}

async function verifyAdmin(username: string, password: string): Promise<boolean> {
  try {
    const raw = await fs.readFile(ADMINS_PATH, 'utf-8')
    const data = JSON.parse(raw)
    const admins: AdminEntry[] = data.admins ?? []
    return admins.some((a) => a.username === username && a.password === password)
  } catch {
    return false
  }
}

async function readData() {
  const raw = await fs.readFile(SERVERS_PATH, 'utf-8')
  return JSON.parse(raw)
}

async function writeData(data: unknown) {
  await fs.writeFile(SERVERS_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

// GET — public, returns servers + categories
export async function GET() {
  try {
    const data = await readData()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ categories: [], servers: [] })
  }
}

// POST — add a server OR category (admin only)
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
      data.categories.push(newCat)
      await writeData(data)
      return NextResponse.json({ success: true, category: newCat })
    }

    // Default: add server
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
    data.servers.push(newServer)
    await writeData(data)
    return NextResponse.json({ success: true, server: newServer })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 })
  }
}

// DELETE — remove a server or category (admin only)
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
      data.categories = (data.categories ?? []).filter((c: { id: string }) => c.id !== id)
      // Unassign any servers from this category
      data.servers = data.servers.map((s: { categoryId?: string }) =>
        s.categoryId === id ? { ...s, categoryId: null } : s
      )
      await writeData(data)
      return NextResponse.json({ success: true })
    }

    // Default: remove server
    const target = data.servers.find((s: { id: string }) => s.id === id)
    if (!target) return NextResponse.json({ error: 'Server not found' }, { status: 404 })
    if (target.isPreset) return NextResponse.json({ error: 'Cannot remove preset servers' }, { status: 403 })

    data.servers = data.servers.filter((s: { id: string }) => s.id !== id)
    await writeData(data)
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 })
  }
}

// PATCH — update admin users list OR rename a category (admin only)
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
      data.categories = (data.categories ?? []).map((c: { id: string; name: string; description?: string }) =>
        c.id === id ? { ...c, name: String(name).trim(), description: description ?? c.description } : c
      )
      await writeData(data)
      return NextResponse.json({ success: true })
    }

    // Default: update admin users
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
    await fs.writeFile(ADMINS_PATH, JSON.stringify({ admins: validAdmins }, null, 2), 'utf-8')
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 })
  }
}
