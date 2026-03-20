import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { verifyAdmin } from '@/lib/verifyAdmin'

const MESSAGES_PATH = path.join(process.cwd(), 'app', 'config', 'contact-messages.json')

async function readMessages() {
  try {
    return JSON.parse(await fs.readFile(MESSAGES_PATH, 'utf-8'))
  } catch { return { messages: [] } }
}

async function writeMessages(data: unknown) {
  await fs.writeFile(MESSAGES_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json()
    if (!name || !email || !subject || !message) return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    const newMessage = { id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, name: String(name).trim(), email: String(email).trim(), subject: String(subject).trim(), message: String(message).trim(), read: false, receivedAt: new Date().toISOString() }
    const data = await readMessages()
    data.messages.unshift(newMessage)
    await writeMessages(data)
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  if (!await verifyAdmin(searchParams.get('username') ?? '', searchParams.get('password') ?? '')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(await readMessages())
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password, id, read, markAllRead } = body
    if (!await verifyAdmin(username, password)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const data = await readMessages()
    if (markAllRead) {
      data.messages = data.messages.map((m: { read: boolean }) => ({ ...m, read: true }))
    } else {
      const idx = data.messages.findIndex((m: { id: string }) => m.id === id)
      if (idx === -1) return NextResponse.json({ error: 'Message not found' }, { status: 404 })
      data.messages[idx].read = read ?? true
    }
    await writeMessages(data)
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
    const data = await readMessages()
    const before = data.messages.length
    data.messages = data.messages.filter((m: { id: string }) => m.id !== id)
    if (data.messages.length === before) return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    await writeMessages(data)
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 })
  }
}
