import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { verifyAdmin } from '@/lib/verifyAdmin'

const FILE = path.join(process.cwd(), 'app', 'config', 'maintenance.json')

export interface MaintenanceWindow {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  affectedServices: string[]
  type: 'maintenance' | 'outage' | 'partial_outage'
  createdAt: string
}

async function read() {
  try { return JSON.parse(await fs.readFile(FILE, 'utf-8')) }
  catch { return { windows: [] } }
}

async function write(data: unknown) {
  await fs.writeFile(FILE, JSON.stringify(data, null, 2), 'utf-8')
}

// Resolve effective status from time range
function withStatus(w: MaintenanceWindow) {
  const now = Date.now()
  const start = new Date(w.startTime).getTime()
  const end = new Date(w.endTime).getTime()
  let status: 'scheduled' | 'active' | 'completed'
  if (now < start) status = 'scheduled'
  else if (now >= start && now <= end) status = 'active'
  else status = 'completed'
  return { ...w, status }
}

export async function GET() {
  const data = await read()
  return NextResponse.json({ windows: (data.windows ?? []).map(withStatus) })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password, title, description, startTime, endTime, affectedServices, type } = body
    if (!await verifyAdmin(username, password)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!title || !startTime || !endTime) return NextResponse.json({ error: 'title, startTime, endTime required' }, { status: 400 })
    const win: MaintenanceWindow = {
      id: `maint-${Date.now()}`,
      title: String(title).trim(),
      description: String(description || '').trim(),
      startTime, endTime,
      affectedServices: Array.isArray(affectedServices) ? affectedServices : [],
      type: type ?? 'maintenance',
      createdAt: new Date().toISOString(),
    }
    const data = await read()
    data.windows.unshift(win)
    await write(data)
    return NextResponse.json({ success: true, window: withStatus(win) })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password, id, ...updates } = body
    if (!await verifyAdmin(username, password)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const data = await read()
    const idx = data.windows.findIndex((w: MaintenanceWindow) => w.id === id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const { username: _u, password: _p, id: _id, ...safeUpdates } = updates
    void _u; void _p; void _id
    data.windows[idx] = { ...data.windows[idx], ...safeUpdates }
    await write(data)
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
    const data = await read()
    const before = data.windows.length
    data.windows = data.windows.filter((w: MaintenanceWindow) => w.id !== id)
    if (data.windows.length === before) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    await write(data)
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 })
  }
}
